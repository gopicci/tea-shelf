Tea Shelf is a **progressive web app** built with the intent of helping users
manage their tea collection. This documentation offers an overview
on the REST API that serves the backend, which is written in **Python** with
**Django REST framework**.

The API offers token authentication and revolves mostly around the central models of Tea and Session.
Tea contains personal data a user might want to keep about a tea as well as some inherited from entries of other types
(information on categories, origin, vendor, brewing). Session represents a brewing session with constructs to help the
user keep track of infusion times and brewing instructions.

On top of that, to help streamline the creation process, the **vision parser** service extracts text from an image with
the help of Google Vision API and uses it to pull out relevant tea data, such as category, subcategory and vendor,
and to build a name for the instance. Far from being exact the algorithm often saves the user a lot of time entering
form data and helps pointing to the right preexisting entries.

For more information the API documentation is available [here](https://teashelf.app/docs/api/).
