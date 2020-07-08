export const getAccessToken = () => {
  const auth = JSON.parse(window.localStorage.getItem("user.auth"));
  if (auth) {
    return auth.access;
  }
  return undefined;
};


export const getRefreshToken = () => {
  const auth = JSON.parse(window.localStorage.getItem("user.auth"));
  if (auth) {
    return auth.refresh;
  }
  return undefined;
};


export const getUser = () => {
  const auth = JSON.parse(window.localStorage.getItem('user.auth'));
  if (auth) {
    const [,payload,] = auth.access.split('.');
    const decoded = window.atob(payload);
    return JSON.parse(decoded);
  }
  return undefined;
};


export const APIRequest = (endpoint, method, body=null) => {
  /**
   * Wrapper around fetch request to the API. Tries to refresh access token once if not valid.
   * If token refresh is successful it reruns the request, otherwise deletes the tokens.
   *
   * @param endpoint {string} API endpoint in "/endpoint/" format to be merged with base URL
   * @param method {string} Request method
   * @param body {string} Optional request body
   */
  const token = getAccessToken();

  return fetch(`${process.env.REACT_APP_API}${endpoint}`, {
    method: method,
    headers: {"Authorization": `Bearer ${token}`,},
    body: body,
  }).then(res => res.json())
    .then(res => {
      if (res.code === "token_not_valid") {
        const refresh_token = getRefreshToken()
        return fetch(
          `${process.env.REACT_APP_API}/token/refresh/`, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({refresh: refresh_token}),
          })
          .then(res => res.json()
            .then(data => ({ok: res.ok, body: data}))
          )
          .then(res => {
            if (res.ok) {
              const updated_auth = {
                refresh: refresh_token,
                access: res.body['access']
              }
              window.localStorage.setItem('user.auth', JSON.stringify(updated_auth));
              return APIRequest(endpoint, method, body)
            } else {
              window.localStorage.removeItem('user.auth');
            }
          })
      } else {
        return res
      }
    })
    .catch((error) => {
      console.error(error);
    });
}