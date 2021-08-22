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
        return Promise.reject(`Ошибка ${res.status}: ${res.message}`);
      })
  }

  signUp({ email, password }) {
    return this._request({
      endpoint: '/signup',
      body: {
        email: email,
        password: password,
      }
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