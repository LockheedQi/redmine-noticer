import Vue from 'vue'
import App from './App'
import store from '../store'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
