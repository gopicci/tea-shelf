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


export const APIRequest = async (endpoint, method, body=null) => {
  /**
   * Wrapper around fetch request to the API. Tries to refresh access token once if not valid.
   * If token refresh is successful it reruns the request, otherwise deletes the tokens.
   * Returns response in any case.
   *
   * @param endpoint {string} API endpoint in "/endpoint/" format to be merged with base URL
   * @param method {string} Request method
   * @param body {string} Optional request body
   */
  const token = getAccessToken();

  return fetch(`${process.env.REACT_APP_API}${endpoint}`, {
    method: method,
    headers: {
      "Authorization": `Bearer ${token}`,
      Accept: "application/json, text/plain, */*",},
    body: body,
  })
    .then(res => {
      if (res.ok)
        return res
      else {
        // Response not ok, clone to extract body data
        const resClone = res.clone();
        return resClone.json().then(data => {
          // Check if token is not valid
          if (data.code === "token_not_valid") {
            const refresh_token = getRefreshToken()
            return fetch(
              `${process.env.REACT_APP_API}/token/refresh/`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({refresh: refresh_token}),
              })
              .then(res => {
                if (res.ok)
                  // Token has been refreshed, update auth storage data and rerun request
                  return res.json().then(data => {
                    const updated_auth = {
                      refresh: refresh_token,
                      access: data['access']
                    }
                    window.localStorage.setItem('user.auth', JSON.stringify(updated_auth));
                    return APIRequest(endpoint, method, body)
                  })
                else {
                  // Token refresh invalid, delete auth storage data (logout)
                  return res.json().then(data => {
                    window.localStorage.removeItem('user.auth');
                    return res
                  })

                }
              })
          } else
            // Request not ok but not for invalid token
            return res;
        })
      }
    })
    .catch((error) => {
      console.error(error);
    });
}