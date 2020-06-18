const JobModel = require('../models/JobModel')
const EmployerModel = require('../models/EmployerModel')
const { GetUserRole } = require('./user')
const { getData } = require('../utils')
const { AddUserKe, GetUserKe, UpdateUserKe } = require('./userKe')
const { nlp } = require('../utils/nlp')
const _ = require('lodash')
const maxAge = 1000 * 60  * 60 * 3// 三小时

function AddJob(jobs) {
  if (!(jobs instanceof Array)) jobs = [jobs]
  return new Promise((resolve, reject) => {
    function worker(ipac) {
      if (ipac == jobs.length) return;
      return JobModel.findOne({ id: jobs[ipac].id })
        .then(res => {
          if (!res) return JobModel.create(jobs[ipac])
          else console.log(res.id, '已经存在')
        })
        .then(res => {
          return worker(ipac + 1)
        })
        .catch(err => {
          reject('保存失败')
        })
    }
    worker(0).then(resolve)
  })
}

async function GetJobs(ctx) {
  try {
    let { pageNum, pageSize } = ctx.query
    pageNum = parseInt(pageNum)
    pageSize = parseInt(pageSize)
    let jobs = await JobModel.find()
    let total = jobs.length
    jobs = getData(jobs, pageNum, pageSize)
    ctx.body = { status: 0, jobs, total }
  } catch (error) {
    console.log('GetJobs异常', error)
    ctx.body = { status: 1, msg: '获取招聘信息异常' }
  }
}

async function GetSearchJobs(ctx) {
  try {
    let userId = ctx.cookies.get('userid')
    let { pageNum, pageSize, positionname, city, company_name } = ctx.query
    pageNum = parseInt(pageNum)
    pageSize = parseInt(pageSize)
    let condition = {}
    if (positionname) {
      let role = await GetUserRole(userId)
      if(role && role.name !== '用人单位') await AddUserKe(userId, positionname)
      positionname = positionname === 'c++' || positionname === 'C++' ? 'c\\+\\+' : positionname
      condition = { positionname: new RegExp(`^.*${positionname}.*$`, 'gi') }
    }
    if (city) {
      condition = { [`address.city`]: new RegExp(`^.*${city}.*$`, 'gi') }
    }
    if(company_name) {
      condition = { [`company.name`]: new RegExp(`^.*${company_name}.*$`, 'gi') }
    }
    let jobs = await JobModel.find(condition)
    let total = jobs.length
    jobs = getData(jobs, pageNum, pageSize)
    ctx.body = { status: 0, jobs, total }
  } catch (error) {
    console.log('GetSearchJobs异常', error)
    ctx.body = { status: 1, msg: '搜索招聘信息异常' }
  }
}

async function GetJobById(ctx) {
  try {
    const { id } = ctx.query
    let userId = ctx.cookies.get('userid')
    let job = await JobModel.findOne({ id })
    if (job) {
      let role = await GetUserRole(userId)
      if(role.name !== '用人单位') {
        await AddUserKe(userId, [job.positionname, ...job.tags])
        let viewedList = JSON.parse(ctx.cookies.get(`viewed_${userId}`) || '[]')
        ctx.cookies.set(`viewed_${userId}`, JSON.stringify(_.uniq([...viewedList, `${job._id}`])), { maxAge: maxAge, domain: 'localhost', path: '/' })
      }
      ctx.body = { status: 0, data: job }
    } else {
      ctx.body = { status: 1, msg: '未找到此招聘信息' }
    }
  } catch (error) {
    console.log('GetJobById异常', error)
    ctx.body = { status: 1, msg: '获取该招聘信息异常' }
  }
}

async function GetViewedJobs(ctx) {
  try {
    let userId = ctx.cookies.get('userid')
    let viewedIds = JSON.parse(ctx.cookies.get(`viewed_${userId}`) || '[]')
    let { pageNum, pageSize } = ctx.query
    let histories = []
    let start = pageNum * pageSize, end = Math.min(pageNum * pageSize + pageSize, viewedIds.length)
    for(let i = start; i < end; i++) {
      let job = await JobModel.findById(viewedIds[i])
      histories.push(job)
    }
    ctx.body = { status: 0, data: { histories, totalPage: Math.ceil(viewedIds.length / pageSize) - 1 } }
  } catch (error) {
    console.log('GetViewedJobs异常', error)
    ctx.body = { status: 1, msg: '获取最近浏览数据异常' }
  }
}

async function GetAverage(ctx) {
  try {
    let res = await JobModel.aggregate([
      { $project: { city: "$address.city", salary: { $avg: "$salary" } } },
      { $group: { _id: '$city', averageSalary: { $avg: '$salary' } } },
      { $sort: { 'averageSalary': -1 } },
      { $limit: 10 },
      { $project: { _id: 0, city: '$_id', averageSalary: { $round: ["$averageSalary", 2] } } }
    ])
    ctx.body = { status: 0, list: res }
  } catch (error) {
    console.log('GetAverage异常', error)
    ctx.body = { status: 1, msg: '获取平均薪资异常' }
  }
}

async function GetPositions(ctx) {
  try {
    let { positionname = '' } = ctx.query
    let positions = await JobModel.aggregate([
      { $match: { positionname: { $in: [new RegExp(`^.*${positionname}.*$`)] } } },
      { $group: { _id: '$address.city', positions: { $sum: 1 } } },
      { $sort: { 'positions': -1 } },
      { $limit: 10 },
      { $project: { _id: 0, city: '$_id', positions: '$positions' } },
    ])
    ctx.body = { status: 0, positions }
  } catch (error) {
    console.log('GetPositions异常', error)
    ctx.body = { status: 1, msg: '获取职位数异常' }
  }
}

async function GetRelationship(ctx) {
  try {
    let experienceList = await JobModel.aggregate([
      {
        $project: {
          experience: '$experience',
          averageSalary: { $avg: '$salary' },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' }
        }
      },
      {
        $group: {
          _id: '$experience',
          averageSalary: { $avg: '$averageSalary' },
          minSalary: { $min: '$minSalary' },
          maxSalary: { $max: '$maxSalary' }
        }
      },
      {
        $project: {
          _id: 0,
          experience: '$_id',
          averageSalary: { $round: ["$averageSalary", 2] },
          minSalary: '$minSalary',
          maxSalary: '$maxSalary'
        }
      }
    ])
    let educationList = await JobModel.aggregate([
      {
        $project: {
          education: '$education',
          averageSalary: { $avg: '$salary' },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' }
        }
      },
      {
        $group: {
          _id: '$education',
          averageSalary: { $avg: '$averageSalary' },
          minSalary: { $min: '$minSalary' },
          maxSalary: { $max: '$maxSalary' }
        }
      },
      {
        $project: {
          _id: 0,
          education: '$_id',
          averageSalary: { $round: ["$averageSalary", 2] },
          minSalary: '$minSalary',
          maxSalary: '$maxSalary'
        }
      }
    ])
    ctx.body = { status: 0, experienceList, educationList }
  } catch (error) {
    console.log('GetRelationship异常', error)
    ctx.body = { status: 1, msg: '获取数据异常' }
  }
}

async function GetRecommendJobs(ctx) {
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
      await UpdateUserKe(userId, keywords)
    }

    let res = await JobModel.aggregate([
      { $match: { create_time: { $lte: parseInt(last_time) } } },
      { $group: { _id: null, count: { $sum: 1 } } }
    ])

    let count = (res.length && res[0].count) || 0

    let recommendList = await JobModel.aggregate([
      { $skip: count },
      { $match: { keywords: { $in: keywords } } },
      { $limit: 5 }
    ])
    ctx.body = { status: 0, data: recommendList }
  } catch (error) {
    console.log('GetRecommendJobs异常', error)
    ctx.body = { status: 1, msg: '获取数据异常' }
  }
}

async function AddPublishJob(ctx) {
  try {
    let userId = ctx.cookies.get('userid')
    let { job } =  ctx.request.body
    let employer = await EmployerModel.findOne({ userId: job.userId })
    if(!employer) {
      return ctx.body = { status: 1, msg: '请先进行认证！' }
    }else {
      let { city, district, bizArea } = employer.company.address
      job.address = { city, district, bizArea }
      let { name, img, fourSquare, trend, figure, home } = employer.company
      job.company = { name, img, fourSquare, trend, figure, home }
    }
    let keywords = await nlp(job['positionname'])
    job['keywords'] = _.union(keywords, job['tags'])
    
    // 添加用户关键词
    await AddUserKe(userId, job['keywords'])

    if(!job._id) {
      while(true) {
        let publishJob = await JobModel.findOne({ id: job.id })
        if(publishJob) job.id = `${Date.now()}`.slice(-7) + parseInt(Math.random() * 1000)
        else break
      }
      await JobModel.create(job)
    }else {
      job.create_time = Date.now()
      await JobModel.findOneAndUpdate({ _id: job._id }, job)
    }
    ctx.body =  { status: 0, data: job }
  } catch (error) {
    console.log('AddPublishJob异常', error)
    ctx.body = { status: 1, msg: '发布异常' }
  }
}

async function GetPublishJobs(ctx) {
  try {
    let userId = ctx.cookies.get('userid')
    let jobs = await JobModel.find({ userId })
    let total = jobs.length
    ctx.body = { status: 0, jobs, total }
  } catch (error) {
    console.log('GetPublishJobs异常', error)
    ctx.body = { status: 1, msg: '获取数据异常' }
  }
}

async function DeleteJob(ctx) {
  try {
    let { _id } = ctx.request.body
    await JobModel.deleteOne({ _id })
    ctx.body = { status: 0 }
  } catch (error) {
    console.log('DeleteJob异常', error)
    ctx.body = { status: 1, msg: '删除数据异常' }
  }
}

module.exports = {
  AddJob,
  AddPublishJob,
  GetJobs,
  GetSearchJobs,
  GetJobById,
  GetViewedJobs,
  GetAverage,
  GetRelationship,
  GetPositions,
  GetRecommendJobs,
  GetPublishJobs,
  DeleteJob
}