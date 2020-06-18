import store from 'store'
/*
  原生做法
  local storage的工具函数模块
*/
const USER_KEY = 'user_key'
const RESUMR_KEY = 'resume_key'

function getKey(userId) {
  return `last_time_${userId}`
}

export default {
  saveUser(user) {
    // localStorage 只能保存string，如果传递的是对象则会自动调用toString()
    // localStorage.setItem(key, value) value必须是字符串
    store.set(USER_KEY, user)
  },
  getUser() {
    return store.get(USER_KEY) || {}
  },
  removeUser() {
    // localStorage.removeItem(USER_KEY)
    store.remove(USER_KEY)
  },
  saveLastTime(userId, last_time) {
    const key = getKey(userId)
    store.set(key, last_time)
  },
  getLastTime(userId) {
    const key = getKey(userId)
    return store.get(key) || 0
  },
  removeLastTime(userId) {
    const key = getKey(userId)
    store.remove(key)
  },
  saveResume(resume) {
    store.set(RESUMR_KEY, resume)
  },
  getResume() {
    return store.get(RESUMR_KEY) || {
      resume_name: '未命名简历',
      progress: 0
    }
  },
  removeResume() {
    store.remove(RESUMR_KEY)
  }
}