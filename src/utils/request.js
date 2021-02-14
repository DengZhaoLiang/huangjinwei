import axios from 'axios'

axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://localhost:9527'

axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error)
    return Promise.reject()
  }
)

axios.interceptors.response.use(
  response => {
    if (typeof response !== 'undefined' && response.status === 200) {
      return response.data
    } else {
      return Promise.reject()
    }
  },
  error => {
    return Promise.reject()
  }
)

// 请求工具类
const request = {

  get (url, params) {
    return new Promise((resolve) => {
      axios.get(url, {
        params: params
      }).then(response => {
        console.log(response)
        resolve(response)
      })
    })
  },

  post (url, data) {
    return new Promise((resolve) => {
      axios.post(url, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        resolve(response)
      })
    })
  },

  put (url, data) {
    return new Promise((resolve) => {
      axios.put(url, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        resolve(response)
      })
    })
  },

  delete (url, data) {
    return new Promise((resolve) => {
      axios.delete(url, {
        data: data
      }).then(response => {
        resolve(response)
      })
    })
  }
}

export default request
