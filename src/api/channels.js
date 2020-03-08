// 处理频道请求
import request from '@/utils/request'

/*
获取我的频道
**/
export function getMyChannels () {
  return request({
    url: '/user/channels'
  })
}
