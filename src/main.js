import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import plugin from '@/utils/plugin'
import 'vant/lib/index.css'
import 'amfe-flexible'

Vue.config.productionTip = false

Vue.use(Vant)
Vue.use(plugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
