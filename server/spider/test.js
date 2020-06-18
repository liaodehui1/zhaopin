const { getHtml } = require('./utils')
const cheerio = require('cheerio')
const { lgConfig } = require('./config')

function testIP(ip, page = 1) {
  return new Promise((resolve, reject) => {
    let url = lgConfig.getFirstUrl(page)
    // let url = lgConfig.getTestUrl()
    getHtml(url, page, ip)
      .then(res => {
        // console.log(res)
        let $ = cheerio.load(res)
        console.log($('title').text())
        if ($('title').text().indexOf('招聘') === -1) reject(false)
        resolve(true)
      })
      .catch(err => {
        reject(false)
      })
  })
}

process.on('message', ({ page, ip, index }) => {
  console.log(ip, 'process.pid', process.pid); // 子进程id
  testIP(ip, page)
    .then(flag => {
      process.send({ flag, index });
    })
    .catch(flag => {
      console.log(ip, '不可用')
      process.send({ flag, index });
    })
})