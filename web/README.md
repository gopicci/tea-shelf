# Tea Shelf UI


Tea Shelf is a **progressive web app** built with the intent to help users keep
track of their collection of teas. This documentation offers an overview on the
app frontend, written in **Typescript** with **React web framework**.

The UI is a one page app build with a mobile first approach and a lot of main
components translate well between platforms. There are however a few more
specific components to assure a proper user experience.

#### Routing
Routing is mostly taken care by the *App* component. It keeps a state with the
current route and optional payload (tea instance data needed by some
components).

In mobile mode, the tea input process requires a more specific router, handled
by the *MobileInput* component.

#### Global state
Global state is provided by reducers in components tagged *State container*.
This was a preferred approach over an overall state manager as it was easier
to break down state behavior into more specific and clear maintainers. 

#### Caching
Being a PWA, the app makes heavy usage of the browser caching capabilities to
support an offline experience and it adopts a cache first approach in most
cases.

When the user logs in for the first time, global state containers get filled
with data from the backend API, which is then saved on IndexedDB and kept in
sync on successive logins or manual user syncs.

The app then uses cached data to work, and only updates the backend when a
network connection is available. It does so, aside from saving all needed
user and public data on IndexedDB, also by saving new or modified instances
in an offline database called offline-teas, which it then empties gradually
when requests fulfill.

#### Structure
There are some main components and service files that take care of the more
generic operations, while the rest could be defined nested or more specific.

These components are:

| Component | Handles |
| ------------ |  -------------- |
| [App](App.html) | Main routing |
| [Editor](Editor.html) | Tea instance creation/modification backend |
| [MainLayout](MainLayout.html) | Layout of main landing page components |
| [Create](Create.html) | Tea creation experience |

And services:

| File | Contains |
| ------------ |  -------------- |
| [models.ts](services_models.ts.html) | All main interfaces |
| [auth-services.ts](services_auth-services.ts.html) | Authentication services for API requests |
| [sync-services.ts](services_sync-services.ts) | Offline behavior sync services |
| [parsing-services.ts](services_parsing-services.ts) | Parsers and translators |
