// 处理用户信息的三个方法  存储  删除 获取  放置在LocalStorage

const USER_TOKEN = 'lxxd-mobile-110-token'

// 存储用户信息
export function setUser (user) {
  localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 获取用户信息
export function getUser () {
  return JSON.parse(localStorage.getItem(USER_TOKEN) || '{}')
}

// 删除用户信息
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
