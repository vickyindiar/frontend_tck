import axios from "axios"

//const token = localStorage.getItem('_aat');
var axiosConfig  = {};
var axiosHeader = {};
// console.log(token)
// if(token){
//   axiosConfig = { withCredentials: true }
//   axiosHeader = {
//     'x-api-version': '1.0',
//     Authorization: `Bearer ${token}`
//   }
// }
// else{
//   axiosConfig = { }
//   axiosHeader = { 'x-api-version': '1.0' }
// }

axios.interceptors.response.use(
  response => response,
  error =>  Promise.reject(error)
)

export async function get(url, config = {}, header={}) {
  const token = localStorage.getItem('_aat') ? localStorage.getItem('_aat') : localStorage.getItem('_cat');
  const db = sessionStorage.getItem('_db') ? sessionStorage.getItem('_db') :'';
  if(token){
    axiosConfig = { withCredentials: true }
    axiosHeader = {
      'x-api-version': '1.0',
      Authorization: `Bearer ${token}`,
      'db': db
    }
  }
  else{
    axiosConfig = { }
    axiosHeader = { 'x-api-version': '1.0', 'db': db }
  }

  return await axios.get(url, { ...axiosConfig, ...config, headers:{...axiosHeader, ...header} }).then(response => response.data)
}

export async function post(url, data, config = {}, header={}) {
  const token = localStorage.getItem('_aat') ? localStorage.getItem('_aat') : localStorage.getItem('_cat');
  const db = sessionStorage.getItem('_db') ? sessionStorage.getItem('_db') :'';
  if(token){
    axiosConfig = { withCredentials: true }
    axiosHeader = {
      'x-api-version': '1.0',
      Authorization: `Bearer ${token}`,
      'db': db
    }
  }
  else{
    axiosConfig = { }
    axiosHeader = { 'x-api-version': '1.0', 'db': db }
  }
  return axios
    .post(url, data,  { ...axiosConfig, ...config, headers:{...axiosHeader, ...header} })
    .then(response => response.data)
}

export async function postForm(url, data, config = {}, header={}) {
  const token = localStorage.getItem('_aat') ? localStorage.getItem('_aat') : localStorage.getItem('_cat');
  const db = sessionStorage.getItem('_db') ? sessionStorage.getItem('_db') :'';
  if(token){
    axiosConfig = { withCredentials: true }
    axiosHeader = {
      'x-api-version': '1.0',
      Authorization: `Bearer ${token}`,
      'db': db
    }
  }
  else{
    axiosConfig = { }
    axiosHeader = { 'x-api-version': '1.0', 'db': db }
  }
  return axios
    .post(url, data, { ...axiosConfig, ...config, headers:{...axiosHeader, ...header, 'Content-Type':'multipart/form-data'} })
    .then(response => response.data)
}


export async function put(url, data, config = {}, header={}) {
  const token = localStorage.getItem('_aat') ? localStorage.getItem('_aat') : localStorage.getItem('_cat');
  const db = sessionStorage.getItem('_db') ? sessionStorage.getItem('_db') :'';
  if(token){
    axiosConfig = { withCredentials: true }
    axiosHeader = {
      'x-api-version': '1.0',
      Authorization: `Bearer ${token}`,
      'db': db
    }
  }
  else{
    axiosConfig = { }
    axiosHeader = { 'x-api-version': '1.0', 'db': db }
  }
  return axios
    .put(url, { ...data },  { ...axiosConfig, ...config, headers:{...axiosHeader, ...header} })
    .then(response => response.data)
}

export async function del(url, config = {}, header={}) {
  const token = localStorage.getItem('_aat') ? localStorage.getItem('_aat') : localStorage.getItem('_cat');
  const db = sessionStorage.getItem('_db') ? sessionStorage.getItem('_db') :'';
  if(token){
    axiosConfig = { withCredentials: true }
    axiosHeader = {
      'x-api-version': '1.0',
      Authorization: `Bearer ${token}`,
      'db': db
    }
  }
  else{
    axiosConfig = { }
    axiosHeader = { 'x-api-version': '1.0', 'db': db }
  }
  return await axios
    .delete(url,  { ...axiosConfig, ...config, headers:{...axiosHeader, ...header}})
    .then(response => response.data)
}
