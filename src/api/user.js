
// 用户相关请求
import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/authorizations',
    data,
    method: 'post'
  }) // 返回一个Promise对象
}
