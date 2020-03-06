
// 路由拦截 导航守卫

import router from '@/router'
import store from '@/store'

// 前置守卫 ----  路由发生改变之前触发

router.beforeEach(function (to, from, next) {
  if (to.path.startsWith('/user') && !store.state.user.token) {
    const toPath = {
      path: '/login',
      query: {
        redirectUrl: to.fullPath
      }
    }
    next(toPath)
  } else {
    next() // 直接放行
  }
})

// 后置守卫
export default router
