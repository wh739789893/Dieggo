
export default {
  install (Vue) {
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params }) // 封装一个提示消息
    Vue.prototype.$sleep = sleep // 封装延迟处理函数
  }
}

function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
