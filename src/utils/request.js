class Request {
  constructor() {
    this.credentials = 'include';
  }

  checkStatus = (response) => {
    const { status } = response;
    if (status >= 200 && status < 300) {
      return response;
    }
    const errorText = response.statusText;
    const error = new Error(errorText);
    error.name = response.status;
    error.response = response;
    throw error;
  }

  handleResult = (data) => {
    if (data.code === 0) {
      return data;
    }
    return Promise.reject(data.msg);
  }

  parseQuery = (obj) => {
    let str = '';
    for (let key in obj) {
      const value = typeof obj[key] !== 'string' ? JSON.stringify(obj[key]) : obj[key];
      str += '&' + key + '=' + value;
    }
    return str.substr(1);
  }

  parseJSON = (response) => response.json();

  get = async (url, params, headers) => {
    const options = {
      headers,
      method: 'GET'
    }
    return await this.request(url, params, options);
  }

  post = async (url, params, headers) => {
    const options = {
      headers,
      method: 'POST'
    }
    return await this.request(url, params, options);
  }

  checkIsLogin = (url) => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      return false
    }
  }

  request = (url, params, options) => {
    const that = this;
    const { method, headers } = options;
    const defaultOptions = {
      credentials: this.credentials,
      mode: 'cors'
    }
    const token = window.localStorage.getItem('token');
    options.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...headers
    }
    if (token) {
      options.headers.token = token;
    }
    if (method === 'GET' && params) {
      url += '?' + this.parseQuery(params);
    } else {
      options.body = JSON.stringify(params);
    }
    const newOptions = { ...defaultOptions, ...options };
    return fetch(url, newOptions)
      .then(that.checkStatus)
      .then(that.parseJSON)
      .then(that.handleResult)
      .catch((err) => {
        if (!window.navigator.onLine) {
          console.log('网络连接失败，请再试试吧。');
          return;
        }
        return Promise.reject(err);
      })
  }
}

export const request = new Request();