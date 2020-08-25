/**
 * Gets access token from local storage auth data.
 *
 * @returns {string|undefined}
 * @category Services
 */
export function getAccessToken(): string | undefined {
  const auth = window.localStorage.getItem("user.auth");
  if (auth) {
    return JSON.parse(auth).access;
  }
  return undefined;
}

/**
 * Gets refresh token from local storage auth data.
 *
 * @returns {string|undefined}
 * @category Services
 */
export function getRefreshToken(): string | undefined {
  const auth = window.localStorage.getItem("user.auth");
  if (auth) {
    return JSON.parse(auth).refresh;
  }
  return undefined;
}

/**
 * Gets user info from local storage access token.
 *
 * @returns {object|undefined}
 * @category Services
 */
export function getUser(): object | undefined {
  const auth = window.localStorage.getItem("user.auth");
  if (auth) {
    const [, payload] = JSON.parse(auth).access.split(".");
    const decoded = window.atob(payload);
    return JSON.parse(decoded);
  }
  return undefined;
}

/**
 * Removes local storage auth data.
 * @returns {void}
 * @category Services
 */
export function logout(): void {
  window.localStorage.removeItem("user.auth");
  window.location.reload();
}

/**
 * Races fetch and timeout, throws error if timeout responds first
 *
 * @param {string} endpoint - API endpoint in "/endpoint/" format to be merged with base URL
 * @param {string} method - Request method
 * @param {string} body - Optional request body
 * @param {number} timeout - Defines request timeout, default 5000ms
 * @param {string} api_path - API base path
 * @returns {Promise} Fetch/timeout race promise
 * @category Services
 */
export async function fetchTimeout(
  endpoint: string,
  method: string,
  body: string = "",
  timeout: number = 5000,
  api_path: string
): Promise<any> {
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
 * If token refresh is successful it reruns the request, otherwise deletes the tokens from
 * local storage (logout).
 *
 * @param {string} endpoint - API endpoint in "/endpoint/" format to be merged with base URL
 * @param {string} method - Request method
 * @param {string} body - Optional request body
 * @param {number} timeout - Defines request timeout, default 5000ms
 * @returns {Promise<Response>}
 * @category Services
 */
export async function APIRequest(
  endpoint: string,
  method: string,
  body: string = "",
  timeout: number = 5000
): Promise<Response> {
  let api_path = process.env.REACT_APP_API;
  if (api_path === undefined) api_path = "/api";

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
