
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 引入中文的语言包
dayjs.extend(relativeTime)
export default {
  install (Vue) {
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params }) // 封装一个提示消息
    Vue.prototype.$sleep = sleep // 封装延迟处理函数
    Vue.filter('relTime', relTime) // 注册全局相对时间过滤器
  }
}

function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}

function relTime (value) {
  return dayjs().locale('zh-cn').from(value)
}
