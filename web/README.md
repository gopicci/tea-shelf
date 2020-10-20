Tea Shelf is a **progressive web app** built with the intent of helping users
manage their tea collection and brewing sessions. The documentation
[here](https://teashelf.app/docs/web/) offers an overview on the frontend,
a one page app written with a mobile first approach in **Typescript** with
**React web framework**.

#### Structure
###### Routing
Routing is mostly taken care of by the [App](https://teashelf.app/docs/web/App.html)
component, which keeps a state with the current route and optional payload data.

Certain sections require more specific routing which is usually managed by the
parent component. One exception is [MobileInput](https://teashelf.app/docs/web/MobileInput.html)
which has its own sub router given its fair complexity.

###### Global state
Global state is provided using React context with reducers in components
tagged *State container*. This was a preferred approach over an overall state
manager as it allowed a clearer way to break down state behavior into more
specific maintainers. 

###### Models
Models are structured to mimic API counterparts as much as possible, with
an offline ID field added to to facilitate offline operations.
Models related  to clocks, filters, settings and confirmations are meant for
local use only.


###### Caching
Being a PWA, the app makes heavy usage of the browser caching capabilities to
support an offline experience and it adopts a cache first approach in most
cases.

When the user logs in for the first time, global state containers get filled
with data from the backend API, which is then saved on *IndexedDB* and kept in
sync on successive logins or manual user refreshes.

The app uses mostly cached data to work, and only syncs with the backend when a
network connection is available. It does so, aside from saving all needed
user and public data locally, by saving new or modified instances in offline
database entries which it then empties gradually when requests fulfill.

The offline database is structure to mimic global state and API models as
follows:

| Name | Contains |
| ------------ |  -------------- |
| categories | [CategoryModel](https://teashelf.app/docs/web/CategoryModel.html) objects from API |
| teas | [TeaInstance](https://teashelf.app/docs/web/TeaInstance.html) objects from API |
| offline-teas | Locally modified [TeaInstance](https://teashelf.app/docs/web/TeaInstance.html) or new [TeaRequest](https://teashelf.app/docs/web/TeaRequest.html) objects |
| sessions | [SessionInstance](https://teashelf.app/docs/web/SessionInstance.html) objects from API |
| offline-sessions | Locally modified [SessionInstance](https://teashelf.app/docs/web/SessionInstance.html) or new [SessionModel](https://teashelf.app/docs/web/SessionModel.html) objects |
| subcategories | [SubcategoryInstance](https://teashelf.app/docs/web/SubcategoryInstance.html) objects from API |
| offline-subcategories | Locally created [SubcategoryModel](https://teashelf.app/docs/web/SubcategoryModel.html) objects |
| vendors | [VendorInstance](https://teashelf.app/docs/web/VendorInstance.html) objects from API |
| offline-vendors | Locally created [VendorModel](https://teashelf.app/docs/web/VendorModel.html) objects |
| clocks | Local [Clock](https://teashelf.app/docs/web/Clock.html) objects |
| settings | Local [Settings](https://teashelf.app/docs/web/Settings.html) object |

###### Styling

The interface has been built using [Material UI](https://material-ui.com).
Styling has mostly been kept in place, defining classes relevant to the component
in the same file. To favor readability the styles of certain nested components have
been grouped together and moved under the *styles* directory, which also contains
the main theme with base definitions.

###### Main files
There are some main components and service files that take care of the core
operations, while the rest could be defined more specific.

These components are:

| Component | Handles |
| ------------ |  -------------- |
| [App](https://teashelf.app/docs/web/App.html) | Handles base routing |
| [EditTea](https://teashelf.app/docs/web/EditTea.html) | Tea instance editing handler |
| [EditSession](https://teashelf.app/docs/web/EditSession.html) | Session instance editing handler |
| [MainLayout](https://teashelf.app/docs/web/MainLayout.html) | Main landing component |
| [CreateTea](https://teashelf.app/docs/web/CreateTea.html) | Handles tea creation process |

And services:

| File | Contains |
| ------------ |  -------------- |
| [models.ts](https://teashelf.app/docs/web/services_models.ts.html) | Main interfaces |
| [auth-services.ts](https://teashelf.app/docs/web/services_auth-services.ts.html) | Authentication services for API requests |
| [sync-services.ts](https://teashelf.app/docs/web/services_sync-services.ts.html) | Offline behavior sync services |
| [parsing-services.ts](https://teashelf.app/docs/web/services_parsing-services.ts.html) | Parsers and translators |
