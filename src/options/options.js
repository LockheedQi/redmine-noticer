global.browser = require('webextension-polyfill')

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import '../popup/router/index.css'
import axios from 'axios'

Vue.use(ElementUI)
/* eslint-disable no-new */
Vue.prototype.$api = axios;

new Vue({
  el: '#app',
  render: h => h(App)
})
