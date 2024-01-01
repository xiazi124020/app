// http.js

import axios from 'axios'

const apiUrl = process.env.REACT_APP_API_URL
const apiKey = process.env.REACT_APP_API_KEY;

export const post = (url, data, formData) => {
  return axios
    .post(`${apiUrl}${url}`, data, {
      headers: {
        'Content-Type': formData ? 'multipart/form-data' : 'application/json',
        'apiKey': apiKey
      }
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error
    })
}

export const get = (url, params) => {
  return axios
    .get(`${apiUrl}${url}`, {params})
    .then((response) => response.data)
    .catch((error) => {
      throw error
    })
}

export const put = (url, data) => {
  return axios
    .put(`${apiUrl}${url}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'apiKey': apiKey
      }
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error
    })
}

export const putFormData = (url, data) => {
  return axios
    .put(`${apiUrl}${url}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'apiKey': apiKey
      }
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error
    })
}

export const del = (url, data) => {
  return axios
    .delete(`${apiUrl}${url}`, {data, headers: {'apiKey': apiKey}})
    .then((response) => response.data)
    .catch((error) => {
      throw error
    })
}
