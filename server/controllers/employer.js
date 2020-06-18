const EmployerModel = require('../models/EmployerModel')

async function AddCertification(ctx) {
  try {
    const employer = ctx.request.body
    if(!employer._id) {
      await EmployerModel.create(employer)
      ctx.body = { status: 0 }
    }else {
      await EmployerModel.findOneAndUpdate({ _id: employer._id }, employer)
      ctx.body = { status: 0 }
    }
  } catch (error) {
    console.log('AddCertification异常', error)
    ctx.body = { status: 1, msg: '认证异常' }
  }
}

async function GetCertification(ctx) {
  try {
    let userId = ctx.cookies.get('userid')
    let employer = await EmployerModel.findOne({ userId })
    ctx.body = { status: 0, data: employer }
  } catch (error) {
    console.log('GetCertification异常', error)
    ctx.body = { status: 1, msg: '获取数据异常' }
  }
}

module.exports = {
  AddCertification,
  GetCertification
}