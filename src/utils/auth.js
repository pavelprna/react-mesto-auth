class Auth {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }
  _request({ endpoint, body, headers }) {
    return fetch(this.baseUrl + endpoint, {
      headers: { ...this.headers, ...headers },
      body
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        console.log(res)
        return Promise.reject(`Ошибка ${res.status}: ${res.error}`);
      })
  }

  signUp(userData) {
    return this._request({
      method: 'POST',
      endpoint: '/signup',
      body: JSON.stringify(userData)
    })
  }

  signIn(userData) {
    return this._request({
      method: 'POST',
      endpoint: '/signin',
      body: JSON.stringify(userData)
    })
  }

  checkToken(token) {
    return this._request({
      method: "GET",
      endpoint: '/users/me',
      headers: {"Authorization" : `Bearer ${token}`},
      body: ''
    })

  }
}

const auth = new Auth({
  baseUrl: 'https://auth.nomoreparties.co',
  headers: {
    'Content-Type': 'application/json',
  }
})

export default auth;
