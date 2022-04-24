import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_BASE_URL

export const Auth = {
  login: (data, successCb, errorCb) => {
    // console.log(data)
    axios.post(baseUrl + '/login', data)
    .then(response=>{
      localStorage.setItem('token', response.data.token)
      successCb(response.data)
    })
    .catch(e=>{
      errorCb(e.response.data)
    })
  },
  logout: (successCb, errorCb) => {
    axios.get(baseUrl+'/logout',{
      headers: {
        Authorization: 'Bearer '+localStorage.getItem('token')
      }
    }).then(r=>successCb(r.data)).catch(e=>errorCb(e.response.data))
  },
  checkAuth: (successCb, errorCb) => {
    axios.get(baseUrl + '/check-auth', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(r=>{
      successCb(r.data.state)
    }).catch(e=>{errorCb(e.response)})
  }
  
}