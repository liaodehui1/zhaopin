const ResumeModel = require('../models/ResumeModel')
const { AddUserKe, GetUserKe } = require('./userKe')
const deleteAvatar = require('../utils/deleteFile')
const { nlp } = require('../utils/nlp')

async function AddResume(ctx) {
  try {
    let userId = ctx.cookies.get('userid')
    let resume = ctx.request.body
    if(resume.intention.position) {
      let keywords = await nlp(resume.intention.position)
      resume.keywords = keywords
      await AddUserKe(userId, keywords)
    }
    let data = await ResumeModel.create(resume)
    ctx.body = { status: 0, data }
  } catch (error) {
    console.log('AddResume异常', error)
    ctx.body = { status: 1, msg: '添加简历异常' }
  }
}

async function UpdateResume(ctx) {
  try {
    let userId = ctx.cookies.get('userid')
    let resume = ctx.request.body
    if(resume.intention.position) {
      await AddUserKe(userId, resume.intention.position)
    }
    resume.last_update_time = Date.now()
    let oldResume = await ResumeModel.findOneAndUpdate({ _id: resume._id }, resume)
    let data = Object.assign(oldResume, resume)
    ctx.body = { status: 0, data }
  } catch (error) {
    console.log('UpdateResume异常', error)
    ctx.body = { status: 1, msg: '修改简历异常' }
  }
}

async function GetResumeList(ctx) {
  try {
    let { userId } = ctx.query
    let resumes = await ResumeModel.find({ userId })
    ctx.body = { status: 0, data: resumes }
  } catch (error) {
    console.log('GetResumeList异常', error)
    ctx.body = { status: 1, msg: '获取简历列表异常' }
  }
}

async function DeleteResume(ctx) {
  try {
    let { _id } = ctx.request.body
    let res = await ResumeModel.findByIdAndRemove({ _id })
    await deleteAvatar(res.avatar)
    ctx.body = { status: 0, data: 'ok' }
  } catch (error) {
    console.log('DeleteResume异常', error)
    ctx.body = { status: 1, msg: '删除简历异常' }
  }
}

async function GetRecommendResume(ctx) {
  try {
    let userId = ctx.cookies.get('userid')
    let { last_time } = ctx.query

    let userKe = await GetUserKe(userId)
    let keywords = []
    // nlp提取用户关键词
    if (userKe) {
      let text = userKe.keywords.join(',')
      keywords = await nlp(text)
      // 更新关键词
      await AddUserKe(userId, keywords)
    }
    // console.log(keywords)
    let res = await ResumeModel.aggregate([
      { $match: { last_update_time: { $lte: parseInt(last_time) } } },
      { $group: { _id: null, count: { $sum: 1 } } }
    ])

    let count = (res.length && res[0].count) || 0

    let recommendList = await ResumeModel.aggregate([
      { $skip: count },
      { $match: { keywords: { $in: keywords } } },
      { $limit: 5 }
    ])
    ctx.body = { status: 0, data: recommendList }
  } catch (error) {
    console.log('GetRecommendResume异常', error)
    ctx.body = { status: 1, msg: '获取数据异常' }
  }
}

module.exports = {
  AddResume,
  UpdateResume,
  GetResumeList,
  DeleteResume,
  GetRecommendResume
}