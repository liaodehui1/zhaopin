const Koa = require('koa')
const app = new Koa()
const HttpSpider = require('./spider/https_spider')
const LgSpider = require('./spider/lg')
const { httpsConfig, lgConfig } = require('./spider/config')
const mongoose = require('mongoose')
const cors = require('koa2-cors')
const schedule = require('node-schedule')
const router = require('./routers/index')
const koaBody = require('koa-body')
let memoryUtil = require('./utils/memeoryUtil')
const static = require('koa-static')
const path = require('path')

app.use(koaBody({
  multipart: true,
  strict: false, // 如果启用，不解析 GET，HEAD，DELETE 请求，默认值true
  formidable: {
      uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
      keepExtensions: true,    // 保持文件的后缀
      maxFileSize: 2*1024*1024,	// 设置上传文件大小最大限制，默认2M
  }
}))
app.use(cors({
  origin: 'http://localhost:3000', // 请求源限制为localhost，不可为127.0.0.1
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-requested-with']
}))

app.use(static(
  path.join(__dirname, './public/upload')
))
app.use(router.routes(), router.allowedMethods())

// 通过mongoose连接数据库
mongoose.connect('mongodb://localhost/zhaopin', { useNewUrlParser: true })
  .then(() => {
    console.log('连接数据库成功!!!')
    // 只有当连接上数据库后才去启动服务器
    app.listen('4000', () => {
      console.log('服务器启动成功, 请访问: http://localhost:4000')
    })
    // 每5分钟爬取一次https代理
    var i = schedule.scheduleJob('0 */5 * * * *', () => {
      console.log('https schedule start')
      memoryUtil.page += 5
      if(memoryUtil.page > 30) memoryUtil.page = 1
      let https_spider = new HttpSpider(httpsConfig.num, httpsConfig.pages)
      https_spider.run()
    })
    // 每10分钟爬取一次招聘信息
    var j = schedule.scheduleJob('0 */15 * * * *', () => {
      console.log('job schedule start')
      let lg_spider = new LgSpider(lgConfig.num, lgConfig.pages)
      lg_spider.run()
    })
  })
  .catch(error => {
    console.error('连接数据库失败', error)
  })
