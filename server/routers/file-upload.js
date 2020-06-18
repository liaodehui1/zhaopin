const router = require('koa-router')()
const path = require('path')
const deleteAvatar = require('../utils/deleteFile')

router.post('/manage/img/upload', async (ctx, next) => {
  try {
    if(ctx.request.files) {
      let { base: url } = path.parse(ctx.request.files.avatar.path)
      ctx.body = { status: 0, filename: url }
      await next()
    }else {
      ctx.body = { status: 1, msg: '上传图片失败' }
    }
  } catch (error) {
    console.log('上传图片', error)
    ctx.body = { status: 1, msg: '上传图片失败' }
  }
})

router.delete('/manage/img/delete', async (ctx, next) => {
  try {
    const { filename } = ctx.request.body
    await deleteAvatar(filename)
    ctx.body = { status: 0 }
  } catch (error) {
    console.log('删除图片异常', error)
    ctx.body = { status: 1, msg: '删除图片失败' }
  }
  await next()
})

module.exports = router