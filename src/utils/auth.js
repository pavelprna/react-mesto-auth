class Auth {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }
  _request({ endpoint, body }) {
    return fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: this.headers,
      body: body
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
      endpoint: '/signup',
      body: JSON.stringify(userData)
    })
  }

  signIn({ email, password }) {
    return this._request({
      endpoint: '/signin',
      body: {
        email: email,
        password: password,
      }
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
