const md5 = require('blueimp-md5')

const UserModel = require('../models/UserModel')
const RoleModel = require('../models/RoleModel')
const { send: sendByEmail, verify: verifyFormEmail } = require('../utils/mailer')
const { send: sendByPhone, verify: verifyFormPhone } = require('../utils/sms')
const memoryUtil = require('../utils/memeoryUtil')

// 指定需要过滤的属性
const filter = { password: 0, __v: 0 }
const maxAge = 1000 * 60  * 60 * 3// 三小时

// 登录
async function Login(ctx) {
  try {
    // const { username, password } = ctx.request.body
    ctx.request.body.password = md5(ctx.request.body.password)
    // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
    let user = await UserModel.findOne(ctx.request.body, filter)
    if (user) { // 登陆成功
      // 生成一个cookie(userid: user._id), 并交给浏览器保存
      ctx.cookies.set('userid', user._id, { maxAge: maxAge, domain: 'localhost', path: '/' })
      // 存个过期时间字段,便于前端判断身份是否过期
      user._doc.expires = Date.now() + maxAge
      if (user.role_id) {
        let role = await RoleModel.findOne({ _id: user.role_id })
        user._doc.role = role
        // console.log('role user', user)
        ctx.body = { status: 0, data: user }
      } else {
        user._doc.role = { menus: [] }
        // 返回登陆成功信息(包含user)
        ctx.body = { status: 0, data: user }
      }
    } else {// 登陆失败
      ctx.body = { status: 1, msg: '用户名或密码不正确!' }
    }
  } catch (error) {
    console.error('登陆异常', error)
    ctx.body = { status: 1, msg: '登陆异常, 请重新尝试' }
  }
}

// 注册
async function Register(ctx) {
  try {
    const { username, password, confirm, phone, captcha, role_id } = ctx.request.body
    // 校验验证码
    let isEqual = verifyFormPhone(phone, captcha)
    if (!isEqual) return ctx.body = { status: 1, msg: '验证码不正确!' }
    // 校验用户
    let user = await getUser({ username })
    if (user) return ctx.body = { status: 1, msg: '用户已存在!' }
    // 校验密码
    if (password !== confirm) return ctx.body = { status: 1, msg: '两次密码不一致!' }
    // 删除验证码
    delete memoryUtil.captchaList[phone]
    // 保存
    user = await UserModel.create({
      username,
      password: md5(password || '123456'),
      phone,
      role_id
    })
    // 生成一个cookie(userid: user._id), 并交给浏览器保存
    ctx.cookies.set('userid', user._id, { maxAge: maxAge, domain: 'localhost', path: '/' })
    user._doc.expires = Date.now() + maxAge
    if (user.role_id) {
      let role = await RoleModel.findOne({ _id: user.role_id })
      user._doc.role = role
      // console.log('role user', user)
      delete user.password
      ctx.body = { status: 0, data: user }
    } else {
      user._doc.role = { menus: [] }
      // 返回登陆成功信息(包含user)
      ctx.body = { status: 0, data: user }
    }
  } catch (error) {
    console.error('注册异常', error)
    ctx.body = { status: 1, msg: '注册异常, 请重新尝试' }
  }
}

// 退出
async function Logout(ctx) {
  ctx.cookies.set('userid', '', { maxAge: 0, domain: 'localhost', path: '/' })
  ctx.body = { status: 0 }
}

// 获取手机验证码
async function GetCaptchaByPhone(ctx) {
  try {
    let { phone } = ctx.query
    let result = await sendByPhone(phone)
    ctx.body = { status: 0, data: result.Message }
  } catch (error) {
    console.error('发送验证码异常', error)
    ctx.body = { status: 1 }
  }
}
// 获取邮箱验证码
async function GetCaptchaByEmail(ctx) {
  try {
    let { email } = ctx.query
    let result = await sendByEmail(email)
    ctx.body = { status: 0, data: result.Message }
  } catch (error) {
    console.error('发送验证码异常', error)
    ctx.body = { status: 1 }
  }
}

// 验证码登录
async function loginByCaptcha(ctx) {
  try {
    let { phone, captcha } = ctx.request.body
    let result = verifyFormPhone(phone, captcha)
    if (result) {
      delete memoryUtil.captchaList[phone]
      let user = await UserModel.findOne({ phone })
      if (user) { // 登陆成功
        // 生成一个cookie(userid: user._id), 并交给浏览器保存
        ctx.cookies.set('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 })
        if (user.role_id) {
          let role = await RoleModel.findOne({ _id: user.role_id })
          user._doc.role = role
          // console.log('role user', user)
          ctx.body = { status: 0, data: user }
        } else {
          user._doc.role = { menus: [] }
          // 返回登陆成功信息(包含user)
          ctx.body = { status: 0, data: user }
        }
      }
    } else {// 登陆失败
      ctx.body = { status: 1, msg: '验证码不正确!' }
    }
  } catch (error) {
    console.error('登陆异常', error)
    ctx.body = { status: 1, msg: '登陆异常, 请重新尝试' }
  }
}

// 添加用户
async function AddUser(ctx) {
  try {
    // 读取请求参数数据
    const { username, password } = ctx.request.body
    // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
    // 查询(根据username)
    let user = await UserModel.findOne({ username })
    // 如果user有值(已存在)
    if (user) {
      // 返回提示错误的信息
      return ctx.body = { status: 1, msg: '此用户已存在' }
    } else { // 没值(不存在)
      // 保存
      user = await UserModel.create({ ...ctx.request.body, password: md5(password || '123456') })
    }
    // 返回包含user的json数据
    ctx.body = { status: 0, data: user }
  } catch (error) {
    console.error('注册异常', error)
    ctx.body = { status: 1, msg: '添加用户异常, 请重新尝试' }
  }
}

// 获取用户
async function getUser(data) {
  let user = await UserModel.findOne(data, filter)
  return user
}

// 验证用户是否存在
async function HasUser(ctx) {
  try {
    const { username } = ctx.query
    let user = await getUser({ username })
    // 如果user有值(已存在)
    if (user) {
      // 返回提示错误的信息
      return ctx.body = { status: 1, msg: '此用户已存在' }
    } else {
      return ctx.body = { status: 0, msg: '用户不存在' }
    }
  } catch (error) {
    console.log('hasUser异常', error)
    ctx.body = { status: 1, msg: '校验用户异常' }
  }
}

// 更新用户
async function UpdateUser(ctx) {
  try {
    const user = ctx.request.body
    let oldUser = await UserModel.findOneAndUpdate({ _id: user._id }, user)
    const data = Object.assign(oldUser, user)
    // 返回
    ctx.body = { status: 0, data }
  } catch (error) {
    console.error('更新用户异常', error)
    ctx.body = { status: 1, msg: '更新用户异常, 请重新尝试' }
  }
}
// 更新用户名
async function UpdateUserName(ctx) {
  try {
    const { userId, username, password } = ctx.request.body
    let user = await getUser({ _id: userId, password: md5(password) })
    if(user) {
      await UserModel.where({ _id: userId }).updateOne({ username })
      ctx.body = { status: 0, data: username }
    }else {
      ctx.body = { status: 1, msg: '密码不正确！' }
    }
  } catch (error) {
    console.log('用户名更新异常', error)
    ctx.body = { status: 1, msg: '用户名更新异常' }
  }
}
// 更新手机号
async function UpdatePhone(ctx) {
  try {
    let { userId, phone, captcha } = ctx.request.body
    if(!verifyFormPhone(phone, captcha)) {
      ctx.body = { status: 1, msg: '验证码不正确' }
    }else {
      await UserModel.where({ _id: userId }).updateOne({ phone })
      delete memoryUtil.captchaList[phone]
      ctx.body = { status: 0, data: phone }
    }
  } catch (error) {
    console.log('手机号更新异常', error)
    ctx.body = { status: 1, msg: '手机号更新异常' }
  }
}
// 更新邮箱号
async function UpdateEmail(ctx) {
  try {
    let { userId, email, captcha } = ctx.request.body
    if(!verifyFormEmail(email, captcha)) {
      ctx.body = { status: 1, msg: '验证码不正确' }
    }else {
      await UserModel.where({ _id: userId }).updateOne({ email })
      delete memoryUtil.captchaList[email]
      ctx.body = { status: 0, data: email }
    }
  } catch (error) {
    console.log('邮箱更新异常', error)
    ctx.body = { status: 1, msg: '邮箱更新异常' }
  }
}
// 更新密码
async function UpdatePassword(ctx) {
  try {
    const { userId, oldPassword, password } = ctx.request.body
    let user = await getUser({ _id: userId, password: md5(oldPassword) })
    if(user) {
      await UserModel.where({ _id: userId }).updateOne({ password: md5(password) })
      ctx.body = { status: 0}
    }else {
      ctx.body = { status: 1, msg: '密码不正确！' }
    }
  } catch (error) {
    console.log('密码更新异常', error)
    ctx.body = { status: 1, msg: '密码更新异常' }
  }
}

// 删除用户
async function DeleteUser(ctx) {
  try {
    const { userId } = ctx.request.body
    await UserModel.deleteOne({ _id: userId })
    ctx.body = { status: 0 }
  } catch (error) {
    console.log('删除用户失败', error)
    ctx.body = { status: 1, msg: '删除用户失败' }
  }
}

// 获取所有用户列表
async function GetUserList(ctx) {
  try {
    let users = await UserModel.find({ username: { '$ne': 'admin' } })
    let roles = await RoleModel.find()
    ctx.body = { status: 0, data: { users, roles } }
  } catch (error) {
    console.error('获取用户列表异常', error)
    ctx.body = { status: 1, msg: '获取用户列表异常, 请重新尝试' }
  }
}

async function GetUserRole(_id) {
  let user = await UserModel.findOne({ _id })
  let role = await RoleModel.findOne({ _id: user.role_id })
  return role
}

module.exports = {
  Logout,
  Login,
  loginByCaptcha,
  GetCaptchaByPhone,
  GetCaptchaByEmail,
  GetUserList,
  AddUser,
  Register,
  HasUser,
  UpdateUser,
  UpdateUserName,
  UpdatePhone,
  UpdateEmail,
  UpdatePassword,
  DeleteUser,
  GetUserRole
}