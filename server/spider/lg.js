const { lgConfig } = require('./config')
const cheerio = require('cheerio')
const fork = require('child_process').fork;
const { AddJob } = require('../controllers/job.js')
const { deleteIp } = require('../controllers/ip.js')
let { getHtml, getIp } = require('./utils')
var fetchIp;

class LgSpider {
  constructor(num, pages) {
    this.num = num
    this.pages = pages
    this.result = []
  }

  async run() {
    fetchIp = await getIp()
    for(let i = 1; i <= this.pages; i++) {
      try {
        await this.lglg(i)
      } catch (error) {
        return console.log('未完成所有页爬取, 由于无ip退出')
      }
    }
    console.log('完成全部页面爬取')
  }

  async lglg (page) {
    let self = this
    console.log(`开始爬取${page}页`)
    let url = lgConfig.getFirstUrl(page)
    return new Promise((resolve, reject) => {
      async function worker(url, page, ipac = 0) {
        let ip = await fetchIp()
        if(!ip) return reject(false)
        console.log('lg使用ip:', ip)
        return getHtml(url, page, ip)
          .then(async res => {
            // console.log(res)
            let data = await self.firstFilter(page, res)
            if(!data) {
              if(await deleteIp(ip)) console.log(ip, '无效被删除')
              return worker(url, page, ipac + 1)
            }
            console.log(`lg完成第${page}页`)
            resolve()
          }, async page => {
            console.log(ip, '发送错误')
            if(await deleteIp(ip)) console.log(ip, '无效被删除')
            return worker(url, page, ipac + 1)
          })
          .catch(err => {
            console.log('lg', err)
          })
      }
      worker(url, page)
    })
  }

  async firstFilter(page, html) {
    // console.log(html)
    let ids = []
    let $ = cheerio.load(html)
    let len = $('.con_list_item').length
    if(!len) return false
    $('.con_list_item').each(function(i) { // 不能用箭头函数
      ids.push($(this).attr('data-positionid'))
    });
    try {
      await this.secondStep(page, ids)
    } catch (error) {
      return false
    }
    return true
  }

  secondStep(page, data) {
    let self = this, pendding = new Array(this.num).fill(false)
    console.log(data)
    try {
      return new Promise(async (resolve, reject) => {
        let cur = 0, children = []
        for (let i = 0; i < self.num; i++) {
          children.push(fork(lgConfig.childDir))
          children[i].on('message', async function ({ err, res, id, ip }) {
            pendding[i] = false
            if(res) {
              self.result.push(res)
            }
            if (cur < data.length) {
              pendding[i] = true
              if(!err) {
                this.send({ id: data[cur], ip })
                cur++
              }else {
                if(await deleteIp(ip)) console.log(ip, '无效被删除')
                ip = await fetchIp()
                if(!ip) {
                  children.forEach(child => child.kill())
                  return reject(false)
                }
                this.send({ id, ip })
              }
            }else {
              this.kill() && console.log(`${this.pid}进程被杀死`)
            }
            // 没有正在请求的进程了
            if (pendding.indexOf(true) == -1) {
              await self.save(page)
              resolve()
            }
          })
          if (cur < data.length) {
            pendding[i] = true
            let ip = await fetchIp()
            children[i].send({ id: data[cur], ip })
            cur++
          }
        }
      })
    } catch (error) {
      console.log('lg多进程运行失败', error)
    }
  }

  async save(page) {
    try {
      if(page <= this.pages) {
        await AddJob(this.result)
        this.result = []
      }
    } catch (error) {
      console.log('lg存储失败', error)
    }
  }
}

module.exports = LgSpider