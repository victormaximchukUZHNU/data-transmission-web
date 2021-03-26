// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { BootstrapVue } from 'bootstrap-vue'
import VModal from 'vue-js-modal'
import VueSocketIO from 'vue-socket.io'
import VueResource from 'vue-resource'
import store from './store/index'
import apiURL from '../src/api/helpers/apiURL'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  debug: true,
  connection: apiURL(),
  withCredentials: true,
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  }
}))
Vue.use(BootstrapVue)
Vue.use(VModal)
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
