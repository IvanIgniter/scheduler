import axios from 'axios'

export default (config = {}) => {
  let defaultConfig = {
    baseURL: process.env.BROWSER_API_URL
  }

  return axios.create(Object.assign(defaultConfig, config))
}

export const setHeaderToken = (token) => {
  return { headers: {Authorization: `Bearer ${token}`}}
}
