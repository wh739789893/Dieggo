import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser(),
    photo: null // 用户头像
  },
  mutations: {
    updateUser (state, payload) {
      state.user = payload.user // 更新数据
      auth.setUser(payload.user) // 数据同步设置到本地存储
    },

    // 清空user
    clearUser (state) {
      state.user = {}
      auth.delUser() // 缓存数据清空
    },

    // 更新用户头像方法  载荷携带参数
    updatePhoto (state, payload) {
      state.photo = payload.photo
    }
  },
  actions: {
  },
  modules: {
  }
})
