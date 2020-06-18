import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  // SHOW_ERROR_MSG,
  RESET_USER
} from './action-types'
import {
  reqLogout,
  reqLogin,
  loginByCaptcha,
  reqRegister,
  reqUpdateUserName,
  reqUpdatePhone,
  reqUpdateEmail,
  reqUpdatePassword
} from '@/api'
import storageUtils from '@/utils/storageUtils'
import { message } from 'antd'

// 设置头部标题
export const setHeaderTitle = (headerTitle) => ({ type: SET_HEAD_TITLE, data: headerTitle })

// 接收用户
export const receiveUser = (user) => ({ type: RECEIVE_USER, user })

// 显示错误信息
// export const showErrorMsg = (errorMsg) => ({ type: SHOW_ERROR_MSG, errorMsg })

// 退出登录
export const logout = ({ reason }) => {
  return async dispatch => {
    try {
      // 非主动退出,而是过期了,无需请求后台,否则
      reason !== 'expired' && await reqLogout()
      storageUtils.removeUser()
      dispatch({ type: RESET_USER, user: {} })
      dispatch(setHeaderTitle('首页'))
    } catch (error) {
      console.log(error)
    }
  }
}

// 用户登录
export const login = (name, password) => {
  return async dispatch => {
    try {
      let data = { password }
      if (/^1[3-9]\d{9}$/.test(name)) data['phone'] = name
      else if (/^(\w+)(\.\w+)*@(\w+)((\.\w+)+)$/.test(name)) data['email'] = name
      else data['username'] = name
      const result = await reqLogin(data)
      if (result.status === 0) {
        const user = result.data
        storageUtils.saveUser(user)
        dispatch(receiveUser(user))
      }
    } catch (error) {
      console.log(error)
    }
  }
}
//短信登录
export const loginBySms = (phone, captcha) => {
  return async dispatch => {
    try {
      const result = await loginByCaptcha({ phone, captcha })
      if (result.status === 0) {
        const user = result.data
        storageUtils.saveUser(user)
        dispatch(receiveUser(user))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

// 用户注册
export const register = (user) => {
  return async dispatch => {
    try {
      const result = await reqRegister(user)
      if (result.status === 0) {
        message.success('注册成功')
        const user = result.data
        storageUtils.saveUser(user)
        dispatch(receiveUser(user))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

// 修改用户名
export const updateUserName = (userId, username, password) => {
  return async (dispatch) => {
    try {
      const result = await reqUpdateUserName({ userId, username, password })
      if (result.status === 0) {
        message.success('用户名修改成功')
        const username = result.data
        let user = storageUtils.getUser()
        user.username = username
        storageUtils.saveUser(user)
        dispatch(receiveUser(user))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

// 修改用户手机号
export const updatePhone = (userId, phone, captcha) => {
  return async (dispatch) => {
    try {
      const result = await reqUpdatePhone({ userId, phone, captcha })
      if (result.status === 0) {
        message.success('手机号修改成功')
        const phone = result.data
        let user = storageUtils.getUser()
        user.phone = phone
        storageUtils.saveUser(user)
        dispatch(receiveUser(user))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

// 修改用户邮箱
export const updateEmail = (userId, email, captcha) => {
  return async (dispatch) => {
    try {
      const result = await reqUpdateEmail({ userId, email, captcha })
      if (result.status === 0) {
        message.success('邮箱修改成功')
        const email = result.data
        let user = storageUtils.getUser()
        user.email = email
        storageUtils.saveUser(user)
        dispatch(receiveUser(user))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

// 修改用户密码
export const updatePassword = (userId, oldPassword, password) => {
  return async (dispatch) => {
    try {
      const result = await reqUpdatePassword({ userId, oldPassword, password })
      if (result.status === 0) {
        message.success('密码修改成功')
        const password = result.data
        let user = storageUtils.getUser()
        user.password = password
        storageUtils.saveUser(user)
        dispatch(receiveUser(user))
      }
    } catch (error) {
      console.log(error)
    }
  }
}