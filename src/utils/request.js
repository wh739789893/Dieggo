// 封装request模块
// 因为要在拦截器里处理 TOKEN统一注入  响应数据的统一处理返回  处理大数字 js当数字超过一定范围,计算就会不准确

import axios from 'axios'
import JSONBig from 'json-bigint' // 处理大数字插件
import store from '@/store' // 引入vuex的store实例
import router from '@/router' // 路由对象实例

// 创建一个新的axios实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data) // 字符串=>对象 json.parse() =>JSONBig.parse(data) 大数字类型
    } catch (error) {
      return data
    }
  }]
})

// 创建一个axios请求工具
// 创建一个拦截器
// 请求拦截器 ---------  发起请求之前需要做什么----- 统一注入token
instance.interceptors.request.use(function (config) {
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}` // 统一注入token
  }

  // 返回配置信息
  return config
}, function (error) {
  return Promise.reject(error) // 直接返回Promise错误
})

// 响应拦截器
instance.interceptors.response.use(function (response) {
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, async function (error) {
  // 处理token失效问题
  if (error.response && error.response.status === 401) {
    const toPath = { path: '/login', query: { redirectUrl: router.currentRoute.fullPath } }

    // 先判断有无refresh_token
    if (store.state.user.refresh_token) {
      try {
        const result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          }
        })
        store.commit('updateUser', {
          user: {
            token: result.data.data.token,
            refresh_token: store.state.user.refresh_token
          }
        })
        return instance(error.config)
      } catch (error) {
        store.commit('clearUser')
        router.push(toPath)
      }
    } else {
      router.push(toPath)
    }
  }
  return Promise.reject(error)
})

export default instance
