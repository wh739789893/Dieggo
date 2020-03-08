import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import plugin from '@/utils/plugin'
import '@/styles/index.less' // 引入全局的自定义样式  因为要覆盖vant的样式
import 'vant/lib/index.css'
import 'amfe-flexible'

Vue.config.productionTip = false

Vue.use(Vant)
Vue.use(plugin)
Vue.use(Lazyload)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
