if (typeof importScripts === 'function') {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded');
    workbox.core.skipWaiting();

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

    self.addEventListener('fetch', (event) => {
      if(event.request.method === "POST"){
        console.log(event.request)
      }
    })

    /* custom cache rules */
    workbox.routing.registerRoute(
      ({request}) => request.destination === 'image',
      new workbox.strategies.CacheFirst({
        cacheName: "image-cache",
        plugins: [
          new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [0, 200],
          })
    ]

      })
    );
  } else {
    // console.log('Workbox could not be loaded. No Offline support');
  }
}