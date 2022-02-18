// const Cookies = require("universal-cookie/lib")
window._ = require('lodash')

// try {
//     window.Popper = require('popper.js').default
//     window.$ = window.jQuery = require('jquery')
//     require('bootstrap')
// } catch (e) {}


window.axios = require('axios')

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.headers.common['Accept'] = 'application/json'
window.axios.defaults.baseURL = `${process.env.MIX_APP_URL}api/`
window.axios.defaults.withCredentials = true;
// window.cookie = new Cookies()