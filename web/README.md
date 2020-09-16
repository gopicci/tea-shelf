Tea Shelf is a **progressive web app** built with the intent of helping users
keeping track of their collection of teas. The documentation [here](https://teashelf.app/docs/web/)
offers an overview on the app frontend, a one page app written with a mobile
first approach in **Typescript** with **React web framework**.

#### Structure
###### Routing
Routing is mostly taken care of by the [App](https://teashelf.app/docs/web/App.html)
component, which keeps a state with the current route and optional payload (tea
instance data needed by some components).

In mobile mode the tea input process requires a more specific sub router, which
is handled by the [MobileInput](https://teashelf.app/docs/web/MobileInput.html)
component.

###### Global state
Global state is provided using React context with reducers in components
tagged *State container*. This was a preferred approach over an overall state
manager as it allowed a clearer way to break down state behavior into more
specific maintainers. 

###### Caching
Being a PWA, the app makes heavy usage of the browser caching capabilities to
support an offline experience and it adopts a cache first approach in most
cases.

When the user logs in for the first time, global state containers get filled
with data from the backend API, which is then saved on *IndexedDB* and kept in
sync on successive logins or manual user refreshes.

The app uses mostly cached data to work, and only syncs with the backend when a
network connection is available. It does so, aside from saving all needed
user and public data locally, by saving new or modified instances in an
offline database called *offline-teas*, which it then empties gradually
when requests fulfill.

###### Styling

The interface has been built using [Material UI](https://material-ui.com).
Styling has mostly been kept in place, defining classes relevant to the component
in the same file. To favor readability the styles of certain nested components have
been grouped together and moved under the *styles* directory, which also contains
the main theme with base definitions.

###### Main files
There are some main components and service files that take care of the more
generic operations, while the rest could be defined more specific.

These components are:

| Component | Handles |
| ------------ |  -------------- |
| [App](https://teashelf.app/docs/web/App.html) | Handles base routing |
| [Editor](https://teashelf.app/docs/web/Editor.html) | Tea instance modification handler |
| [MainLayout](https://teashelf.app/docs/web/MainLayout.html) | Main landing component |
| [Create](https://teashelf.app/docs/web/Create.html) | Tea creation process |

And services:

| File | Contains |
| ------------ |  -------------- |
| [models.ts](https://teashelf.app/docs/web/services_models.ts.html) | Main interfaces |
| [auth-services.ts](https://teashelf.app/docs/web/services_auth-services.ts.html) | Authentication services for API requests |
| [sync-services.ts](https://teashelf.app/docs/web/services_sync-services.ts.html) | Offline behavior sync services |
| [parsing-services.ts](https://teashelf.app/docs/web/services_parsing-services.ts.html) | Parsers and translators |
