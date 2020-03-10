// 用户相关的请求模块
import request from '@/utils/request' // 引入封装的模块
// 登录方法
export function login (data) {
  return request({
    url: '/authorizations',
    data,
    method: 'post'
  }) //  得到一个promise对象  返回
}

/** *关注用户***/
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}
/** *取消关注***/
export function unFollowUser (target) {
  return request({
    method: 'delete',
    url: `/user/followings/${target}`
  })
}

/** **获取用户个人信息*****/
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
