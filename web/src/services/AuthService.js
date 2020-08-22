/**
 * Gets access token from local storage auth data.
 *
 * @returns {string|undefined}
 */
export function getAccessToken() {
  const auth = JSON.parse(window.localStorage.getItem("user.auth"));
  if (auth) {
    return auth.access;
  }
  return undefined;
}

/**
 * Gets refresh token from local storage auth data.
 *
 * @returns {string|undefined}
 */
export function getRefreshToken() {
  const auth = JSON.parse(window.localStorage.getItem("user.auth"));
  if (auth) {
    return auth.refresh;
  }
  return undefined;
}

/**
 * Gets user info from local storage access token.
 *
 * @returns {Object|undefined}
 */
export function getUser() {
  const auth = JSON.parse(window.localStorage.getItem("user.auth"));
  if (auth) {
    const [, payload] = auth.access.split(".");
    const decoded = window.atob(payload);
    return JSON.parse(decoded);
  }
  return undefined;
}

/**
 * Removes local storage auth data.
 */
export function logout() {
  window.localStorage.removeItem("user.auth");
  window.location.reload(false);
}

/**
 * Races fetch and timeout, throws error if timeout responds first
 *
 * @param endpoint {string} API endpoint in "/endpoint/" format to be merged with base URL
 * @param method {string} Request method
 * @param body {string} Optional request body
 * @param timeout {number} Defines request timeout, default 5000ms
 * @param api_path {string} API base path
 * @returns {Promise} Fetch/timeout race promise
 */
export async function fetchTimeout(
  endpoint,
  method,
  body = "",
  timeout = 5000,
  api_path
) {
  const token = getAccessToken();
  return Promise.race([
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
    fetch(`${api_path}${endpoint}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body ? body : null,
    }),
  ]);
}

/**
 * Wrapper around fetch request to the API. Tries to refresh access token once if not valid.
 * If token refresh is successful it reruns the request, otherwise deletes the tokens (logout).
 *
 * @param endpoint {string} API endpoint in "/endpoint/" format to be merged with base URL
 * @param method {string} Request method
 * @param body {string} Optional request body
 * @param timeout {number} Defines request timeout, default 5000ms
 * @returns {Promise<Response>|undefined}
 * @constructor
 */
export async function APIRequest(endpoint, method, body = "", timeout = 5000) {
  let api_path = process.env.REACT_APP_API;
  if (String(api_path) === "undefined") api_path = "/api";

  const res = await fetchTimeout(endpoint, method, body, timeout, api_path);

  if (res.ok) return res;
  else {
    // Response not ok, clone to extract body data
    const resClone = res.clone();
    const data = await resClone.json();
    // Check if token is not valid
    if (data.code === "token_not_valid") {
      const refreshToken = getRefreshToken();
      const refreshRes = await fetch(`${api_path}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (refreshRes.ok) {
        // Token has been refreshed, update auth storage data and rerun request
        const refreshData = await refreshRes.json();
        const updatedAuth = {
          refresh: refreshToken,
          access: refreshData["access"],
        };
        window.localStorage.setItem("user.auth", JSON.stringify(updatedAuth));
        return APIRequest(endpoint, method, body);
      } else {
        // Token refresh invalid, logout
        logout();
        throw Error(res.statusText);
      }
    } else {
      // Request not ok but not for invalid token
      console.log(await res.json());
      throw Error(res.statusText);
    }
  }
}
