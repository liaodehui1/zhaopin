const cheerio = require('cheerio')
const fork = require('child_process').fork;
const { httpsConfig } = require('./config')
const fs = require('fs')
const { getHtml, formTime } = require('./utils')
const { addIP } = require('../controllers/ip.js')
let memoryUtil = require('../utils/memeoryUtil')

class HttpSpider {
  constructor(num, pages) {
    this.num = num // 爬虫数
    this.pages = pages // 爬取页数
    this.result = [] // 结果
  }

  async run() {
    console.log(memoryUtil.page)
    for (let i = memoryUtil.page; i <= this.pages + memoryUtil.page; i++) {
      await this.gethttps(i, 0)
      console.log(`完成第${i}页`)
    }
    console.log('完成所有页爬取')

  }
  async gethttps(page) {
    let self = this
    let url = httpsConfig.getUrl(page)
    console.log(`开始爬取${page}页`)
    return new Promise((resolve, reject) => {
      function worker(url, page) {
        return getHtml(url, page, null, false)
          .then(async res => {
            // console.log('解析', res)
            let flag = await self.filterHtml(res)
            if(!flag) return worker(url, page)
            else resolve()
          }, page => {
            console.log('发送错误')
            return worker(url, page)
          })
          .catch(err => {
            console.log('https_sipder', err)
          })
      }
      worker(url, page)
    })
  }

  async filterHtml(html) {
    let res = []
    let $ = cheerio.load(html)
    // console.log($('.odd').length)
    // $('.odd').each(function (i) {
    //   let ip = $(this).find('td').eq(1).text() + ':' + $(this).find('td').eq(2).text()
    //   res.push({ ip })
    // })

    // // 西拉免费代理IP
    $('tbody tr').each(function(i) { // 不能用箭头函数
      // console.log($(this.children()))
      let ipo = {}
      ipo['ip'] = $(this).find('td').eq(0).text()
      // ipo['max_age'] = formTime($(this).find('td').eq(5).text())
      res.push(ipo)
    });
    if(!res.length) return false
    await this.test(res)
    return true
  }

  test(data) {
    let self = this, pendding = new Array(this.num).fill(false)
    console.log(data)
    try {
      return new Promise((resolve, reject) => {
        let cur = 0, children = []
        for (let i = 0; i < Math.min(self.num, data.length); i++) {
          children.push(fork(httpsConfig.testDir))
          children[i].on('message', async function ({ flag, index }) {
            pendding[i] = false
            if (!flag) { // 没用
              data[index] = null
            }
            if (cur < data.length) {
              pendding[i] = true
              this.send({ page: 1, ip: data[cur].ip, index: cur })
              cur++
            }else {
              this.kill() && console.log(`${this.pid}进程被杀死`)
            }
            // 没有正在请求的进程了
            if (pendding.indexOf(true) == -1) {
              data = data.filter(val => val !== null)
              console.log('可用', data)
              await self.save(data)
              resolve()
            }
          })
          if (cur < data.length) {
            pendding[i] = true
            children[i].send({ page: 1, ip: data[cur].ip, index: cur })
            cur++
          }
        }
      })
    } catch (error) {
      console.log('https_spider运行多进程失败', error)
    }
  }

  async save(data) {
    // return new Promise((resolve, reject) => {
    //   fs.readFile(httpsConfig.output, httpsConfig.charset, async function(err, file) {
    //     if(err) reject(err)
    //     file = file ? JSON.parse(file) : []
    //     data = data.concat(file)
    //     console.log(data.length)
    //     let ws = fs.createWriteStream(httpsConfig.output, httpsConfig.charset)
    //     await ws.write(JSON.stringify(data))
    //     resolve()
    //   })
    // })
    if(data.length) return await addIP(data)
    else return true
  }
}

module.exports = HttpSpider