export const getAccessToken = () => {
  /**
   * Get access token from local storage auth data.
   */
  const auth = JSON.parse(window.localStorage.getItem("user.auth"));
  if (auth) {
    return auth.access;
  }
  return undefined;
};

export const getRefreshToken = () => {
  /**
   * Get refresh token from local storage auth data.
   */
  const auth = JSON.parse(window.localStorage.getItem("user.auth"));
  if (auth) {
    return auth.refresh;
  }
  return undefined;
};

export const getUser = () => {
  /**
   * Get user info from local storage access token.
   */
  const auth = JSON.parse(window.localStorage.getItem("user.auth"));
  if (auth) {
    const [, payload] = auth.access.split(".");
    const decoded = window.atob(payload);
    return JSON.parse(decoded);
  }
  return undefined;
};

export const logout = () => {
  /**
   * Remove local storage auth data.
   */
  window.localStorage.removeItem("user.auth");
  window.location.reload(false);
};

export const fetchTimeout = async (
  endpoint,
  method,
  body = null,
  timeout = 5000,
  api_path
) => {
  /**
   * Race fetch and timeout, throw error if timeout responds first
   *
   * @param endpoint {string} API endpoint in "/endpoint/" format to be merged with base URL
   * @param method {string} Request method
   * @param body {string} Optional request body
   * @param timeout {int} Defines request timeout, default 5000ms
   * @param api_path {string} API base path
   */
  const token = getAccessToken();
  return Promise.race([
    // Race fetch and timeout, throw error if timeout responds first
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
      body: body,
    }),
  ]);
};

export const APIRequest = async (
  endpoint,
  method,
  body = null,
  timeout = 5000
) => {
  /**
   * Wrapper around fetch request to the API. Tries to refresh access token once if not valid.
   * If token refresh is successful it reruns the request, otherwise deletes the tokens.
   *
   * @param endpoint {string} API endpoint in "/endpoint/" format to be merged with base URL
   * @param method {string} Request method
   * @param body {string} Optional request body
   * @param timeout {int} Defines request timeout, default 5000ms
   */

  let api_path;
  if (process.env.REACT_APP_API)
    api_path = process.env.REACT_APP_API;
  else
    api_path = "/api";

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
};
