from binascii import a2b_base64
import difflib
from google.cloud import vision
import re
from .models import Subcategory, SubcategoryName, Vendor, VendorTrademark, Category


class VisionParser:
    """
    Vision API image text extractor and parser.
    """

    def __init__(self, data):
        """
        Declares vision client and image, empty tea data structure,
        load relevant objects.

        data : str - Base64 image data
        """
        self.client = vision.ImageAnnotatorClient()
        self.image = vision.types.Image(content=a2b_base64(data))
        self.tea_data = {
            "name": None,
            "category": None,
            "category_confidence": None,
            "subcategory": None,
            "subcategory_confidence": None,
            "vendor": None,
            "vendor_confidence": None,
            "year": None,
            "dtd": None,
        }
        self.categories = Category.objects.all()
        self.subcategories = Subcategory.objects.filter(is_public=True)
        self.subcategories_names = SubcategoryName.objects.all()
        self.vendors = Vendor.objects.filter(is_public=True)
        self.vendors_trademarks = VendorTrademark.objects.all()

    def get_tea_data(self):
        """
        Main method returning extracted tea data.
        """
        document = self.document_text_detection()
        self.tea_data["dtd"] = self.reduced_data_parser(document)

        # en_zh_ratio = get_en_zh_ratio(document)

        subcategory_names = self.get_subcategories_lookup()
        subcategory_match = self.find_match(document, subcategory_names)
        if subcategory_match:
            print(subcategory_match)
            subcategory = self.get_subcategory_from_match(subcategory_match)
            self.tea_data["subcategory"] = subcategory.name
            self.tea_data["subcategory_confidence"] = subcategory_match[1]
            self.tea_data["category"] = subcategory.category.name
        else:
            category_names = [c.name for c in self.categories]
            category_match = self.find_match(document, category_names)
            if category_match:
                self.tea_data["category"] = category_match[0]
                self.tea_data["category_confidence"] = category_match[1]

        vendor_names = [v.name for v in self.vendors]
        vendor_match = self.find_match(document, vendor_names)
        if vendor_match:
            self.tea_data["vendor"] = vendor_match[0]
            self.tea_data["vendor_confidence"] = vendor_match[1]

        year = self.find_year(document)
        if year:
            self.tea_data["year"] = year

        name = self.find_name(document)
        if name:
            self.tea_data["name"] = name

        print(self.tea_data)

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

    def combine_words_list_double(self, word_list):
        """
        Combines and return a word list in double words statements

        word_list : [str] - List of single words
        """
        double_words_list = []
        for i in range(len(word_list) - 1):
            double_words_list.append(word_list[i] + " " + word_list[i + 1])
        return double_words_list

    def combine_words_list_triple(self, word_list):
        """
        Combines and return a word list in triple words statements

        word_list : [str] - List of single words
        """
        triple_words_list = []
        for i in range(len(word_list) - 2):
            triple_words_list.append(
                word_list[i] + " " + word_list[i + 1] + " " + word_list[i + 2]
            )
        return triple_words_list

    def find_match(self, document, items):
        """
        Searches for any item of items in detected data response.
        Returns best match and score ratio if any

        document - document_text_detection response
        items : [str] - List of items to search for
        """
        single_words_list = self.get_text_detection_word_list(document)
        double_words_list = self.combine_words_list_double(single_words_list)
        triple_words_list = self.combine_words_list_triple(single_words_list)

        combined_words_list = single_words_list + double_words_list + triple_words_list
        no_spaces_text = "".join(single_words_list)

        # first search for a match in single, double or triple words combos
        highest_score = 0
        best_match = ""
        for name in combined_words_list:
            match = difflib.get_close_matches(name.lower(), items, cutoff=0.8)
            if match:
                score = difflib.SequenceMatcher(None, name.lower(), match[0]).ratio()
                if score > highest_score:
                    highest_score = score
                    best_match = match[0]

        # if no match then try with no spaces strings
        if highest_score == 0:
            for item in items:
                if item.replace(" ", "").lower() in no_spaces_text.lower():
                    best_match = item
                    highest_score = 1
                    break

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

        vendor_name = ""
        vendor = self.tea_data["vendor"]
        if vendor:
            vendor = str(vendor).lower()
            vendor_name = re.split(r"(\W)", vendor)
            vendor_name.append("".join(vendor_name))
            vendor_name.append(vendor)

        cleaned_blocks = []
        for block in data["blocks"]:
            cleaned_phrases = []
            for phrase in block["phrases"]:
                # drop phrase if confidence is below level
                if phrase["confidence"] < min_confidence:
                    continue

                cleaned_words = []
                for word in phrase["words"]:
                    if vendor:
                        match = difflib.get_close_matches(
                            word.lower(), vendor_name, cutoff=0.8
                        )
                        if match and match[0].lower() != "tea":  # mmmmh
                            continue
                    # drop word with unallowed symbols
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
                        # check if word is website or common word
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

        return " ".join(words).title()

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

        return name

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
        lookup_names = [s.name for s in self.subcategories]
        lookup_names += [s.translated_name for s in self.subcategories]
        lookup_names += [s.name for s in self.subcategories_names]
        return lookup_names

    def get_subcategory_from_match(self, match):
        """
        Returns a subcategory object from a match tuple (name, score)

        match : (str, float) - find_match result
        """
        sub = next(
            (s.subcategory for s in self.subcategories_names if s.name == match[0]),
            None,
        )
        if not sub:
            sub = next(
                (
                    s
                    for s in self.subcategories
                    if s.name == match[0] or s.translated_name == match[0]
                ),
                None,
            )
        return sub
