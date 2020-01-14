import Vue from 'vue'
import App from './App'
import store from '../store'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../popup/router/index.css'
import axios from 'axios'

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser
Vue.use(ElementUI)

Vue.prototype.$api = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
