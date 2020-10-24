/**
 * Applies custom behavior on browser history pop event.
 * Returns cleanup function, to be used with useEffect hook.
 *
 * @category Services
 * @param {function} reroute - Routing function
 * @returns {function}
 */
export function backButton(reroute: () => void) {
  function onBackButtonEvent(event: PopStateEvent): void {
    event.preventDefault();
    reroute();
  }

  window.history.pushState(null, "", window.location.pathname);
  window.addEventListener("popstate", onBackButtonEvent);

  return () => {
    window.removeEventListener("popstate", onBackButtonEvent);
  };
}
