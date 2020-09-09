Tea Shelf is a **progressive web app** built with the intent to help users
keep track of their collection of teas. This documentation offers an overview
on the REST API that serves the backend, which is written in **Python** with
**Django REST framework**.

The API offers token authentication and mostly CRUD operations revolving around
the central model of Tea, which contains personal data a user might want to
keep about a tea as well as some inherited from entries of other types
(information on categories, origin, vendor, brewing). On top of that, to help
streamline the creation process, the **vision parser** service gets text from
an image with the help of Google Vision API and extracts relevant tea data
from it, comparing it with existing category, subcategory, vendor entries and
building a name. Far from being exact the algorithm often saves the user a lot
of time entering form data and helps pointing to the right preexisting entries.

For more information the API documentation is available [here](https://teashelf.app/docs/api/).
