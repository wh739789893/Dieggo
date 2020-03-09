// 处理频道请求
import request from '@/utils/request'

// 要做一个能区分游客和用户  读取缓存不同
import store from '@/store'

const CACHE_CHANNEL_T = 'lxxd-110-t' // 游客
const CACHE_CHANNEL_U = 'lxxd-110-u' // 用户

/*
获取我的频道
**/
export function getMyChannels () {
  // return request({
  //   url: '/user/channels'
  // })

  // 缓存思想  如果缓存中有那么就先从缓存中读取  如果没有 那么走线上查询
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T // 缓存key
    // 开始读取数据
    const str = localStorage.getItem(key)
    if (str) {
      // 表示缓存中是有数据的
      resolve({ channels: JSON.parse(str) }) // 缓存中读取数据 发给下一个Promise
    } else {
      const data = await request({ url: '/user/channels' })
      localStorage.setItem(key, JSON.stringify(data.channels)) // 请求得到的数据写入缓存
      resolve(data)
    }
  })
}

/***
 * 获取所有频道
 * ***/
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}

/****
 *删除频道
 * ***/

// 还是缓存思想
// 1.设置key 来区分使用户还是游客登陆
// 2. 刚开始获取缓存数据是有的 得到缓存数据
// 3.利用findIndex 找到频道索引
// 4.如果索引存在那么就找见该频道 去删除 删除完了要重新写入缓存!释放Promise给下一个
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T // 缓存key
    const channels = JSON.parse(localStorage.getItem(key)) // 得到缓存数据
    const index = channels.findIndex(item => item.id === id) // 找到对应频道索引
    if (index > -1) {
      channels.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
      resolve() // 释放数据 执行连提供给下一个Promise
    } else {
      reject(new Error('找不到对应频道'))
    }
  })
}
