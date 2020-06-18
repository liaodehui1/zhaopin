const { lgConfig } = require('./config')
const cheerio = require('cheerio')
var { getHtml } = require('./utils')
const { nlp } = require('../utils/nlp')
const _ = require('lodash')

async function fetchData(id, ip) {
  let url = lgConfig.getSecondUrl(id)
  return new Promise((resolve, reject) => {
    async function worker(url, id) {
      console.log('lh_spider_child使用ip:', ip)
      return getHtml(url, id, ip)
        .then(async res => {
          let data = await filterHtml(res, id)
          if(!data) reject(ip)
          resolve(data)
          console.log(`${id} 详情爬取完成`)
        }, id => {
          reject(ip)
        })
        .catch(err => {
          console.log('lg_spider_child', err)
        })
    }
    worker(url, id)
  })
}

async function filterHtml(html, id) {
  let data = { id, isCrawled: true }
  let $ = cheerio.load(html)
  data['positionname'] = $('.job-name').attr('title')
  data['keywords'] = []
  try {
    let keywords = await nlp(data['positionname'])
    data['keywords'] = keywords
  } catch (error) {
    console.log('采取关键词失败', error)
  }
  if(!data['positionname']) return false
  $('.job_request h3 span').each(function(i) {
    switch(i) {
      case 0:
        let r = (/^(\d+)k\-(\d+)k\s*$/.exec($(this).text()))
        data['salary'] = [parseInt(r[1]), parseInt(r[2])]
        break
      case 2:
        data['experience'] = $(this).text().replace(/[\s\/]/g, '')
        break
      case 3:
        data['education'] = $(this).text().replace(/[\s\/]/g, '')
        break
      case 4:
        data['type'] = $(this).text()
        break
      default:
        break
    }
  })
  data['tags'] = []
  $('.position-label').find('li').each(function(i) {
    data['tags'].push($(this).text())
  })
  data['keywords'] = _.union(data['keywords'], data['tags'])
  data['advantage'] = $('.job-advantage p').text()
  data['address'] = {}
  $('.work_addr a').each(function(i) {
    switch(i) {
      case 0:
        data['address']['city'] = $(this).text()
        break
      case 1:
        data['address']['district'] = $(this).text()
        break
      case 2:
        let bizArea = $(this).text().replace(/[\s\-]/g, '')
        if(bizArea.indexOf('地图') === -1) data['address']['bizArea'] = bizArea
        break
      default:
        break
    }
  })
  data['company'] = {}
  data['company']['img'] = $('.job_company').find('dt a img').attr('src')
  data['company']['name'] = $('.job_company').find('dt a img').attr('alt')
  $('.c_feature li').each(function(i) {
    let reg = /(\d+人)/g, item = $(this).find('.c_feature_name')
    let t = reg.test($(item).text())
    switch(i) {
      case 0:
        data['company']['fourSquare'] = $(item).text()
        break
      case 1:
        data['company']['trend'] = $(item).text()
        break
      case 2:
        if(t) data['company']['figure'] = $(item).text()
        break
      case 3:
        if(t) data['company']['figure'] = $(item).text()
        else data['company']['home'] = $(this).find('a').attr('title')
        break
      case 4:
        data['company']['home'] = $(this).find('a').attr('title')
        break
    }
  })
  data['detail'] = $('.job-detail').html()
  return data
}

process.on('message', async ({ id, ip }) => {
  console.log(id, 'process.pid', process.pid); // 子进程id
  fetchData(id, ip)
    .then(res => {
      process.send({ err: null, res, id, ip })
    })
    .catch(err => {
      console.log(ip, '失败')
      process.send({ err, res: null, id, ip })
    })
})