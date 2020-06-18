const router = require('koa-router')()
const user = require('./user')
const role = require('./role')
const job = require('./job')
const resume = require('./resume')
const employer = require('./employer')
const fileUpload = require('./file-upload')

// cookie校验
router.use(async (ctx, next) => {
  // 不存在cookie
  if(
    ctx.request.url.indexOf('/logout') === -1 && // 是logout跳过
     // 无cookie且不是登录
    (!ctx.cookies.get('userid') && (
      ctx.request.url.indexOf('/login') === -1 &&
      ctx.request.url.indexOf('/register') === -1 &&
      ctx.request.url.indexOf('/getCaptchaByPhone') === -1 &&
      ctx.request.url.indexOf('/loginByCaptcha') === -1 &&
      ctx.request.url.indexOf('/hasUser') === -1 &&
      ctx.request.url.indexOf('/getRoleList') === -1
    ))
  ) {
    return ctx.body = { status: 2, msg: '身份过期,请重新登录!' }
  }
  await next()
})
// require('../utils/file-upload')(router)
router.stack = router.stack.concat(
  user.stack, 
  role.stack, 
  job.stack, 
  resume.stack, 
  fileUpload.stack,
  employer.stack  
)

module.exports = router