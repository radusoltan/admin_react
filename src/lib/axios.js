import Axios from "axios"

const axios = Axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': "application/json"
    },
    withCredentials: true,
})

export default axios

// window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// window.axios.defaults.headers.common['Accept'] = 'application/json'
// window.axios.defaults.baseURL = `${process.env.MIX_APP_URL}api/`
// window.axios.defaults.withCredentials = true;