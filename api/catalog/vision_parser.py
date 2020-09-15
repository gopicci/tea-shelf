from binascii import a2b_base64
import difflib
from google.cloud import vision
import re
from .models import (
    Subcategory,
    SubcategoryName,
    Vendor,
    VendorTrademark,
    Category,
    CategoryName,
)


class VisionParser:
    """
    Vision API image text extractor and parser.
    """

    def __init__(self, data):
        """
        Declares vision client, image and response tea data,
        loads relevant objects lists.

        data : str - Base64 image data
        """
        self.client = vision.ImageAnnotatorClient()
        self.image = vision.types.Image(content=a2b_base64(data))

        self.tea_data = {}

        self.category = None
        self.subcategory = None
        self.vendor = None
        self.categories = Category.objects.all()
        self.categories_names = CategoryName.objects.all()
        self.subcategories = Subcategory.objects.filter(is_public=True)
        self.subcategories_names = SubcategoryName.objects.all()
        self.vendors = Vendor.objects.filter(is_public=True)

    def get_tea_data(self):
        """
        Main method returning extracted tea data.
        """
        document = self.document_text_detection()
        self.tea_data["dtd"] = self.reduced_data_parser(document)

        # Disabling as Chinese text recognition isn't quite good yet
        # en_zh_ratio = get_en_zh_ratio(document)

        subcategory_names = self.get_subcategories_lookup()
        subcategory_match = self.find_match(document, subcategory_names)
        if subcategory_match:
            self.subcategory = self.get_subcategory_from_name(subcategory_match[0])
            self.tea_data["subcategory"] = self.subcategory.id
            self.tea_data["subcategory_confidence"] = subcategory_match[1]
            if self.subcategory.category:
                self.tea_data["category"] = self.subcategory.category.id
        else:
            category_names = self.get_categories_lookup()
            category_match = self.find_match(document, category_names)
            if category_match:
                self.category = self.get_category_from_name(category_match[0])
                if self.category:
                    self.tea_data["category"] = self.category.id
                    self.tea_data["category_confidence"] = category_match[1]

        vendor_names = [v.name.lower() for v in self.vendors]
        vendor_match = self.find_match(document, vendor_names)
        if vendor_match:
            self.vendor = self.get_vendor_from_name(vendor_match[0])
            if self.vendor:
                self.tea_data["vendor"] = self.vendor.id
                self.tea_data["vendor_confidence"] = vendor_match[1]

        year = self.find_year(document)
        if year:
            self.tea_data["year"] = year

        name = self.find_name(document)
        if name:
            self.tea_data["name"] = name

        return self.tea_data

    def document_text_detection(self):
        """
        Runs document_text_detection through vision API,
        returns full_text_annotation.

        image : vision.type.Image - Input file
        """
        response = self.client.document_text_detection(image=self.image)
        return response.full_text_annotation

    def get_text_detection_word_list(self, document):
        """
        Returns a list of all words from detected text

        document - document_text_detection response
        """
        word_list = []
        for page in document.pages:
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
        Combines a word list in statements of defined length

        word_list : [str] - List of words
        length : int - Statements length
        """
        statements_list = []
        for i in range(len(word_list) - length + 1):
            statement = " ".join([word_list[i + j] for j in range(length)])
            statements_list.append(statement)
        return statements_list

    def find_match(self, document, items):
        """
        Searches for any item of items in detected data response.
        Returns best match and score ratio if any

        document - document_text_detection response
        items : [str] - List of items to search for
        """
        single_words_list = self.get_text_detection_word_list(document)
        combined_words_list = (
            single_words_list
            + self.combine_words_list(single_words_list, 2)
            + self.combine_words_list(single_words_list, 3)
            + self.combine_words_list(single_words_list, 4)
        )
        no_spaces_text = "".join(single_words_list)

        # First search for a match in single, double, triple or quadruple words combos
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

    def find_year(self, document):
        """
        Searches and returns year from detected text

        document - document_text_detection response
        """
        # need to cover '90 cases
        words_list = self.get_text_detection_word_list(document)
        base_year = 1900
        for word in words_list:
            if word.startswith(("19", "20")) and word[0:4].isdigit():
                potential_year = int(word[0:4])
                if potential_year > base_year:
                    base_year = potential_year
        if base_year > 1900:
            return base_year

    def get_area_from_bounding_box(self, bounding_box):
        """
        Returns area from a list of vertices

        bonding_box.vertices : [{x: float, y: float}] - List of vertices
        """
        vertices = [vertex for vertex in bounding_box.vertices if vertex.x and vertex.y]
        area_sum = 0
        for i in range(len(vertices) - 1):
            area_sum += (
                vertices[i].x * vertices[i + 1].y - vertices[i].y * vertices[i + 1].x
            )
        area_sum += vertices[-1].x * vertices[0].y - vertices[-1].y * vertices[0].x

        # cutoff for now
        if len(vertices) < 4:
            return 0

        return abs(area_sum) / 2

    def reduced_data_parser(self, document):
        """
        Returns a reduced version of text_detection response data structure to help processing name.
        Determines phrases as chunks with an end of line and drops paragraphs/pages

        reduced_data = {
            'blocks': [{
                'phrases': [{
                    'words': [],
                    'font_size': float,
                    'confidence': float,
                }]
            }]
        }

        document - document_text_detection response
        """
        blocks = []
        for page in document.pages:
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
        Grabs text_detection response data reduced by reduced_data_parser and cleans it up
        based on defined restrictions

        data : {} - reduced_data_parser data
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
                # drop phrase if confidence is below level
                if phrase["confidence"] < min_confidence:
                    continue

                cleaned_words = []
                for word in phrase["words"]:
                    # Drop single characters
                    if len(word) < 2:
                        continue

                    # Drop vendor name and trademarks
                    if self.vendor:
                        match = difflib.get_close_matches(
                            word.lower(), vendor_name, cutoff=0.8
                        )
                        if match and match[0].lower() != "tea":  # mmmmh
                            continue
                        if word.lower() in trademark_words:
                            continue

                    # Drop word with unallowed symbols
                    if allowed_characters.match(word):
                        # check if word is year
                        if any(char.isdigit() for char in word):
                            if word.startswith(("19", "20")) and word[0:4].isdigit():
                                if len(word) == 5 and (
                                    word[4] == "5" or word[4].lower() == "s"
                                ):
                                    cleaned_words.append(word[0:4] + "s")
                                elif len(word) >= 4:
                                    cleaned_words.append(word[0:4])
                        # Check if word is website or common word
                        elif (
                            not any(w in word for w in web_words.split(" "))
                            and word.lower() not in drop_common_words
                        ):
                            cleaned_words.append(word)
                if cleaned_words:
                    if (
                        len(cleaned_words) == 1 and cleaned_words[0].lower() == "tea"
                    ):  # mmmmh 2
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
        Returns a properly formatted string out of a words and punctuation list

        data : [str] - Words list
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
        Using re.sub for capitalizing as string.title() doesn't count for numbers
        """
        return re.sub(
            r"[A-Za-z0-9]+('[A-Za-z0-9]+)?",
            lambda mo: mo.group(0)[0].upper() + mo.group(0)[1:].lower(),
            name,
        )

    def find_name(self, document):
        """
        Guesses tea name, based on biggest elements remaining
        after eliminating other known data with a certain
        ratio

        document - document_text_detection response
        """
        reduced_data = self.reduced_data_parser(document)
        cleaned_data = self.cleaned_data_parser(reduced_data)

        # blocks not a driven event, could use in certain occasions

        # case 1: grab biggest elements after cleanup within a certain ratio
        keep_ratio = 0.4  # 0.35 ?

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

    def get_en_zh_ratio(self, document):
        """
        Returns ratio between english and chinese characters

        document - document_text_detection response
        """
        word_list = self.get_text_detection_word_list(document)
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
        Builds list of subcategory names to use in match lookup
        """
        lookup_names = [s.name.lower() for s in self.subcategories]
        lookup_names += [s.translated_name.lower() for s in self.subcategories]
        lookup_names += [s.name.lower() for s in self.subcategories_names]
        return lookup_names

    def get_categories_lookup(self):
        """
        Builds list of category names to use in match lookup
        """
        lookup_names = [c.name.lower() for c in self.categories]
        lookup_names += [c.name.lower() for c in self.categories_names]
        return lookup_names

    def get_subcategory_from_name(self, name):
        """
        Returns a subcategory object from its name
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
        Returns a category object from its name
        """
        sub = next((c.category for c in self.categories_names if c.name.lower() == name), None,)
        if not sub:
            sub = next((c for c in self.categories if c.name.lower() == name), None,)
        return sub

    def get_vendor_from_name(self, name):
        """
        Returns a vendor object from its name
        """
        sub = next((v for v in self.vendors if v.name.lower() == name), None,)
        return sub
