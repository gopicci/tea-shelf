# Tea Shelf UI


Tea Shelf is a **progressive web app** built with the intent to help users keep
track of their collection of teas. This documentation offers an overview on the
app frontend, written in **Typescript** with **React web framework**.

## Structure
The UI is a one page app build with a mobile first approach and a lot of main
components translate well between platforms. There are however a few more
specific components to assure a proper user experience.

#### Caching
Being a PWA, the app makes heavy usage of the browser caching capabilities to
support an offline experience. When the user logs in the first time, global
state containers get filled with data from the backend API, which is then
saved on IndexedDB

#### Routing
Routing is mostly taken care by the *App* component. It keeps a state with the
current route and optional payload (tea instance data needed by some
components).

In mobile mode, the tea input process requires a closer router, handled by the
*MobileInput* component.


#### Global state
Global state is provided by reducers in components tagged *State container*.

