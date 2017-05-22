// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import VueSimplemde from 'vue-simplemde'
import 'element-ui/lib/theme-default/index.css'


Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(VueSimplemde)

Vue.config.productionTip = false

let bus = new Vue()
Vue.prototype.$bus = bus

Vue.prototype.$home = "http://localhost:1234"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})