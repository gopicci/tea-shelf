import difflib
import re
from binascii import a2b_base64

from google.cloud import vision

from .models import (
    Category,
    CategoryName,
    Subcategory,
    SubcategoryName,
    Vendor,
    VendorTrademark,
)


class VisionParser:
    """
    Gets text from an image through Vision API and extracts tea data from it.

    Attributes:
        client: Vision API client.
        image: Vision client image.
        document: Detected text document
        category: Integer ID of found category.
        subcategory: Integer ID of found subcategory.
        vendor: Integer ID of found vendor.
        tea_data: Dictionary containing all found tea data as well as
            a reduced version of Vision text detection.
        categories: List of Category instances.
        categories_names: List of alternative categories names
            as CategoryName objects.
        subcategories: List of public Subcategory instances.
        subcategories_names: List of alternative subcategories names
            as SubcategoryName objects.
        vendors: List of Vendor instances.

    Usage example:
        parser = VisionParser(image_data)
        tea_data = parser.get_tea_data()
    """

    def __init__(self, data):
        """
        Declares vision client, image and response data attributes,
        loads relevant objects lists.

        Args:
            data: Image data as base64 string.
        """
        self.client = vision.ImageAnnotatorClient()
        self.image = vision.types.Image(content=a2b_base64(data))

        self.document = None

        self.category = None
        self.subcategory = None
        self.vendor = None

        self.tea_data = {}

        self.categories = Category.objects.all()
        self.categories_names = CategoryName.objects.all()
        self.subcategories = Subcategory.objects.filter(is_public=True)
        self.subcategories_names = SubcategoryName.objects.all()
        self.vendors = Vendor.objects.filter(is_public=True)

    def get_tea_data(self):
        """
        Main parsing method, finds matches and returns extracted tea data if any.

        Returns:
            Dictionary containing all found tea data as well as a reduced
            version of Vision text detection. For example:
            {
                "dtd": {
                    "blocks": [{
                        "phrases": [{
                            "words": ["foo", "bar"],
                            "font_size": 10.5,
                            "confidence": 0.8
                            }]
                        }]
                    },
                "subcategory": 12,
                "subcategory_confidence": 0.8,
                "vendor": 3,
                "vendor_confidence": 1,
                "year": 2002,
                "name": "Foo bar tea"
            }
        """
        self.document = self.document_text_detection()

        # Reduces detected text data to a more readable format
        self.tea_data["dtd"] = self.reduced_data_parser()

        # Build lists of names to look for
        category_names = self.get_categories_lookup()
        subcategory_names = self.get_subcategories_lookup()
        vendor_names = self.get_vendors_lookup()

        # Search for vendor
        vendor_match, vendor_confidence = self.find_match(vendor_names)
        if vendor_match:
            self.vendor = self.get_vendor_from_name(vendor_match)
            if self.vendor:
                self.tea_data["vendor"] = self.vendor.id
                self.tea_data["vendor_confidence"] = vendor_confidence

        # Search for a category from the list in the document
        category_match, category_confidence = self.find_match(category_names)
        if category_match:
            # Category found
            self.category = self.get_category_from_name(category_match)

            if vendor_confidence == 1 and category_match in vendor_match:
                # Sometimes vendor names contain a category name
                self.category = None

        # Search for a subcategory from the list in the document
        subcategory_match, subcategory_confidence = self.find_match(subcategory_names)
        if subcategory_match:
            # Subcategory found
            self.subcategory = self.get_subcategory_from_name(subcategory_match)

            if (
                self.category
                and self.subcategory.category.id
                and self.subcategory.category.id != self.category
            ):
                # Different categories
                if subcategory_confidence < 1 and category_confidence == 1:
                    # Subcategory not sure, category is sure, ditch subcategory
                    self.subcategory = None
                else:
                    # Subcategory category confidence ratio is enough, ditch category
                    self.category = None

        if self.subcategory:
            self.tea_data["subcategory"] = self.subcategory.id
            self.tea_data["subcategory_confidence"] = subcategory_confidence
            if self.subcategory.category:
                self.tea_data["category"] = self.subcategory.category.id

        if self.category:
            self.tea_data["category"] = self.category.id
            self.tea_data["category_confidence"] = category_confidence

        # Search for year
        year = self.find_year()
        if year:
            self.tea_data["year"] = year

        # Build a name
        name = self.find_name()
        if name:
            self.tea_data["name"] = name

        return self.tea_data

    def document_text_detection(self):
        """
        Runs document_text_detection through Vision API.

        Returns:
            Vision client full_text_annotation document.
        """
        response = self.client.document_text_detection(image=self.image)
        return response.full_text_annotation

    def get_text_detection_word_list(self):
        """
        Returns a list of all words from detected text.

        Returns:
            List of single words as strings.
        """
        word_list = []
        for page in self.document.pages:
            for block in page.blocks:
                for paragraph in block.paragraphs:
                    for word in paragraph.words:
                        word_string = ""
                        for symbol in word.symbols:
                            word_string += symbol.text
                        word_list.append(word_string)
        return word_list

    def combine_words_list(self, word_list, length):
        """
        Combines a word list in phrases of defined length.

        Args:
            word_list: List of strings of single words.
            length: Desired integer length of phrases.

        Returns:
            List of phrases. Each phrase being a string containing
            the defined number of words separated by spaces.
        """
        statements_list = []
        for i in range(len(word_list) - length + 1):
            statement = " ".join([word_list[i + j] for j in range(length)])
            statements_list.append(statement)
        return statements_list

    def find_match(self, items):
        """
        Searches for any item of a list of string in a text detection document.
        Returns best match and score ratio if any.

        Args:
            items: List of strings with items to search for.

        Returns:
            If a match is found it returns a tuple with the matched string and
            highest confidence score, for example:

            ("foo bar", 0.8)
        """
        single_words_list = self.get_text_detection_word_list()
        combined_words_list = (
            single_words_list
            + self.combine_words_list(single_words_list, 2)
            + self.combine_words_list(single_words_list, 3)
            + self.combine_words_list(single_words_list, 4)
        )
        no_spaces_text = "".join(single_words_list)

        # First search for a match in words combos
        highest_score = 0
        best_match = ""
        for name in combined_words_list:
            match = difflib.get_close_matches(name.lower(), items, cutoff=0.8)
            if match:
                score = difflib.SequenceMatcher(None, name.lower(), match[0]).ratio()
                if score > highest_score:
                    highest_score = score
                    best_match = match[0]
                # In case of multiple matches with same score pick the longest string
                if score == highest_score and len(match[0]) > len(best_match):
                    best_match = match[0]

        # If no match then try with no spaces strings
        if highest_score == 0:
            for item in items:
                if item.replace(" ", "").lower() in no_spaces_text.lower() and len(
                    item
                ) > len(best_match):
                    best_match = item
                    highest_score = 1

        if best_match and highest_score > 0:
            return best_match, highest_score

        return None, None

    def find_year(self):
        """
        Searches for a year in a text detection document.

        Returns:
            If a year is found it returns it as an integer.
        """
        # need to cover '90 cases
        words_list = self.get_text_detection_word_list()
        base_year = 1900
        for word in words_list:
            if word.startswith(("19", "20")) and word[0:4].isdigit():
                potential_year = int(word[0:4])
                if potential_year > base_year:
                    base_year = potential_year
        if base_year > 1900:
            return base_year

        return None

    def get_area_from_bounding_box(self, bounding_box):
        """
        Calculates an area from a list of vertices

        Args:
            bounding_box: A dictionary with a list of vertices as float values.
                For example: {
                    vertices: [
                        {
                            x: 15.5,
                            y: 76.2
                        },
                        ...
                    ]
                }

        Returns:
            Area as a float number if there are at least 4 vertices, otherwise 0.
        """
        vertices = [vertex for vertex in bounding_box.vertices if vertex.x and vertex.y]
        area_sum = 0
        for i in range(len(vertices) - 1):
            area_sum += (
                vertices[i].x * vertices[i + 1].y - vertices[i].y * vertices[i + 1].x
            )
        area_sum += vertices[-1].x * vertices[0].y - vertices[-1].y * vertices[0].x

        if len(vertices) < 4:
            return 0

        return abs(area_sum) / 2

    def reduced_data_parser(self):
        """
        Reduces text_detection response data structure to help processing the tea name.
        Determines phrases as chunks with an end of line and drops paragraphs/pages

        Returns:
            Reduced data structure, for example:

            {
                'blocks': [
                    {
                        'phrases': [
                            {
                                'words': ["foo", "bar"],
                                'font_size': 13.5,
                                'confidence': 0.8,
                            },
                            ...
                        ]
                    },
                    ...
                ]
            }
        """
        blocks = []

        for page in self.document.pages:
            for block in page.blocks:
                phrases = []
                for paragraph in block.paragraphs:
                    phrase_words = []
                    phrase_area = 0
                    phrase_confidence = 0
                    for word in paragraph.words:
                        end_of_phrase = False
                        word_area = self.get_area_from_bounding_box(word.bounding_box)
                        word_string = ""
                        for symbol in word.symbols:
                            word_string += symbol.text
                            if symbol.property.detected_break.type in (3, 5):
                                end_of_phrase = True
                        if word.confidence:
                            phrase_confidence += word.confidence
                        else:
                            phrase_confidence += 1
                        phrase_words.append(word_string)
                        phrase_area += word_area
                        if end_of_phrase:
                            font_size = phrase_area / len("".join(phrase_words))
                            confidence = phrase_confidence / len(phrase_words)
                            phrases.append(
                                {
                                    "words": phrase_words,
                                    "font_size": font_size,
                                    "confidence": confidence,
                                }
                            )
                            phrase_words = []
                            phrase_area = 0
                            phrase_confidence = 0
                blocks.append({"phrases": phrases})

        return {"blocks": blocks}

    def cleaned_data_parser(self, data):
        """
        Cleans up reduced text detection data of unwanted words,
        based on declared restrictions.

        Args:
            data: Dictionary of text detection data reduced through
                reduced_data_parser method.

        Returns:
            Cleaned up data in reduced data structure format, for example:

            {
                'blocks': [
                    {
                        'phrases': [
                            {
                                'words': ["foo", "bar"],
                                'font_size': 13.5,
                                'confidence': 0.8,
                            },
                            ...
                        ]
                    },
                    ...
                ]
            }
        """
        # Restrictions:
        min_confidence = 0.8
        allowed_characters = re.compile("^[a-zA-Z0-9À-ÿ ·,.'\"()&_-]*$")
        web_words = "www .com .org .net .ca"
        drop_common_words = "visit us at the order"
        trademark_words = []

        vendor_name = ""
        if self.vendor:
            vendor_name = re.split(r"(\W)", self.vendor.name.lower())
            vendor_name.append("".join(vendor_name))
            vendor_name.append(self.vendor.name.lower())
            vendor_trademarks = VendorTrademark.objects.filter(vendor=self.vendor)
            if vendor_trademarks:
                trademark_phrases = [t.name.lower() for t in vendor_trademarks]
                for tp in trademark_phrases:
                    for tw in tp.split(" "):
                        trademark_words.append(tw)

        cleaned_blocks = []
        for block in data["blocks"]:

            cleaned_phrases = []
            for phrase in block["phrases"]:
                # Drop entire phrase if confidence is below level
                if phrase["confidence"] < min_confidence:
                    continue

                cleaned_words = []
                for word in phrase["words"]:
                    # Drop single characters words
                    if len(word) < 2:
                        continue

                    # Drop vendor name and trademarks
                    if self.vendor:
                        match = difflib.get_close_matches(
                            word.lower(), vendor_name, cutoff=0.8
                        )
                        if match and match[0].lower() != "tea":
                            continue
                        if word.lower() in trademark_words:
                            continue

                    # Drop word with not allowed symbols
                    if allowed_characters.match(word):
                        # Check if word is a year
                        if any(char.isdigit() for char in word):
                            if word.startswith(("19", "20")) and word[0:4].isdigit():
                                if len(word) == 5 and (
                                    word[4] == "5" or word[4].lower() == "s"
                                ):
                                    cleaned_words.append(word[0:4] + "s")
                                elif len(word) >= 4:
                                    cleaned_words.append(word[0:4])
                        # Check if word is a website or common word
                        elif (
                            not any(w in word for w in web_words.split(" "))
                            and word.lower() not in drop_common_words
                        ):
                            cleaned_words.append(word)

                if cleaned_words:
                    if len(cleaned_words) == 1 and cleaned_words[0].lower() == "tea":
                        continue
                    font_size = (
                        phrase["font_size"] * len(cleaned_words) / len(phrase["words"])
                    )
                    cleaned_phrases.append(
                        {
                            "words": cleaned_words,
                            "font_size": font_size,
                            "confidence": phrase["confidence"],
                        }
                    )

            if cleaned_phrases:
                cleaned_blocks.append({"phrases": cleaned_phrases})

        return {"blocks": cleaned_blocks}

    def format_join(self, data):
        """
        Returns a properly formatted string out of a words and punctuation list.

        Args:
            data: List of words as strings.

        Returns:
            String with properly formatted phrase.
        """
        words = data

        first_double = True
        i = 0
        while i < len(words):
            if words[i] in ".,?!)]}:;" and i > 0:
                words[i - 1] += words[i]
                words.pop(i)
            elif words[i] in "([{'" and i < len(words) - 1:
                words[i + 1] = words[i] + words[i + 1]
                words.pop(i)
            elif words[i] == '"':
                if first_double and i < len(words) - 1:
                    words[i + 1] = words[i] + words[i + 1]
                    words.pop(i)
                elif not first_double and i > 0:
                    words[i - 1] += words[i]
                    words.pop(i)
                first_double = not first_double
            elif words[i] in "-_" and 0 < i < len(words) - 1:
                words[i - 1] += words[i]
                words.pop(i)
                words[i - 1] += words[i]
                words.pop(i)
            else:
                i += 1

        return " ".join(words)

    def title(self, name):
        """
        Capitalizes string using re.sub to make up for
        string.title() not counting for numbers.

        Args:
            name: String to capitalize.
        Returns:
            Capitalized string
        """
        return re.sub(
            r"[A-Za-z0-9]+('[A-Za-z0-9]+)?",
            lambda mo: mo.group(0)[0].upper() + mo.group(0)[1:].lower(),
            name,
        )

    def find_name(self):
        """
        Guesses tea name. Based on biggest elements remaining in the
        text detection after eliminating other known data with a
        certain confidence ratio.

        Returns:
            Guessed name as string.
        """
        reduced_data = self.reduced_data_parser()
        cleaned_data = self.cleaned_data_parser(reduced_data)

        # Blocks not a driven event, could use in certain occasions

        # Grab biggest elements after cleanup within a certain ratio
        keep_ratio = 0.4

        biggest_font_size = 0
        for block in cleaned_data["blocks"]:
            for phrase in block["phrases"]:
                if phrase["font_size"] > biggest_font_size:
                    biggest_font_size = phrase["font_size"]

        biggest_words = []
        for block in cleaned_data["blocks"]:
            for phrase in block["phrases"]:
                if (
                    biggest_font_size - phrase["font_size"]
                ) / biggest_font_size <= keep_ratio:
                    for word in phrase["words"]:
                        biggest_words.append(word)
        name = self.format_join(biggest_words)

        # Change word if similar to subcategory name
        if self.subcategory:
            alternative_names = SubcategoryName.objects.filter(
                subcategory__id=self.subcategory.id
            )
            subcategory_names = [alt.name for alt in alternative_names]
            subcategory_names += [
                self.subcategory.name,
                self.subcategory.translated_name,
            ]
            words = name.split(" ")
            words += self.combine_words_list(words, 2)
            words += self.combine_words_list(words, 3)
            words += self.combine_words_list(words, 4)
            for word in words:
                for sub_name in subcategory_names:
                    matcher = difflib.SequenceMatcher(
                        None, word.lower(), sub_name.lower()
                    )
                    if matcher.ratio() > 0.8:
                        return self.title(name.replace(word, sub_name))

        return self.title(name)

    def get_en_zh_ratio(self):
        """
        Calculates ratio between english and chinese characters.
        Not currently used as Vision Chinese recognition isn't
        quite good yet.

        Returns:
            Ratio of english to chinese characters as float, or 10
            if no chinese characters were found.
        """
        word_list = self.get_text_detection_word_list()
        text_detection_string = "".join(word_list)
        chinese_characters = 0
        english_characters = 0
        chinese = re.compile("^[\u4e00-\u9FFF]*$")
        english = re.compile("^[a-zA-Z0-9À-ÿ]*$")
        for char in text_detection_string:
            if chinese.match(char):
                chinese_characters += 1
            if english.match(char):
                english_characters += 1
        if chinese_characters:
            return english_characters / chinese_characters

        return 10

    def get_subcategories_lookup(self):
        """
        Builds list of subcategories names to use in match lookup,
        using standard, translated and alternative subcategories names.

        Returns:
            List of strings with possible subcategories names.
        """
        lookup_names = [s.name.lower() for s in self.subcategories]
        lookup_names += [s.translated_name.lower() for s in self.subcategories]
        lookup_names += [s.name.lower() for s in self.subcategories_names]
        return lookup_names

    def get_categories_lookup(self):
        """
        Builds list of categories names to use in match lookup,
        using standard and alternative categories names.

        Returns:
            List of strings with possible categories names.
        """
        lookup_names = [c.name.lower() for c in self.categories]
        lookup_names += [c.name.lower() for c in self.categories_names]
        return lookup_names

    def get_vendors_lookup(self):
        """
        Builds list of vendors names to use in match lookup,
        using vendors names and websites.

        Returns:
            List of strings with possible vendor names.
        """
        lookup_names = [v.name.lower() for v in self.vendors]
        lookup_names += [v.website.lower() for v in self.vendors]
        return lookup_names

    def get_subcategory_from_name(self, name):
        """
        Searches for a subcategory from a string.

        Args:
            name: Standard, translated or alternative name of the subcategory as string.
        Returns:
            Subcategory object.
        """
        sub = next(
            (s.subcategory for s in self.subcategories_names if s.name.lower() == name),
            None,
        )
        if not sub:
            sub = next(
                (
                    s
                    for s in self.subcategories
                    if s.name.lower() == name or s.translated_name.lower() == name
                ),
                None,
            )
        return sub

    def get_category_from_name(self, name):
        """
        Searches for a category from a string.

        Args:
            name: Name or alternative name of the category as string.
        Returns:
            Category object.
        """
        sub = next(
            (c.category for c in self.categories_names if c.name.lower() == name), None,
        )
        if not sub:
            sub = next((c for c in self.categories if c.name.lower() == name), None,)
        return sub

    def get_vendor_from_name(self, name):
        """
        Searches for a vendor from a string.

        Args:
            name: Name or website of the vendor as string.
        Returns:
            Vendor object.
        """
        sub = next(
            (
                v
                for v in self.vendors
                if v.name.lower() == name or v.website.lower() == name
            ),
            None,
        )
        return sub
