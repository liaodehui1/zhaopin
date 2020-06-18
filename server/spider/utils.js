const request = require('request')
const { getIps } = require('../controllers/ip.js')

function getProxy(url, ip) {
  return {
    url,
    proxy: `http://${ip}`,
    timeout: 1000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36'
    }
  }
}

function getHtml(url, page, ip = null, hasProxy = true) {
  let proxy = hasProxy ? getProxy(url, ip) : null
  return new Promise((resolve, reject) => {
    request(proxy || url, (err, res, body) => {
      if (err) {
        console.log('reject', err)
        reject(page)
      } else {
        resolve(body)
      }
    })
  })
}

function formTime(time) {
  if (typeof time == 'string') {
    let reg = /((\d+)天)?\s*((\d+)小时)?\s*((\d+)分钟)?\s*(\d+)秒/
    let res = reg.exec(time)
    let day = res[2] ? +res[2] : 0
    let hour = res[4] ? +res[4] : 0
    let minute = res[6] ? +res[6] : 0
    let second = res[7] ? +res[7] : 0
    return second + minute * 60 + hour * 60 * 60 + day * 24 * 60 * 60
  }
}

async function getIp() {
  try {
    var page = 0, size = 5, cur = 0, iplist = []
    let res = await getIplist(page, size)
    iplist = res.iplist
    page = res.page
    console.log(iplist)
    return async function () {
      if (cur >= iplist.length) {
        res = await getIplist(++page, size)
        if (res.page == 0) page = 0
        iplist = res.iplist
        cur = 0
      }
      return iplist[cur++]
    }
  } catch (error) {
    console.log('getIp', error)
  }
}

async function getIplist(page, size) {
  var res;
  try {
    res = await getIps(page, size)
    res.iplist = res.iplist.map(i => i.ip)
  } catch (error) {
    console.log('getIplist', error)
  }
  return res
}

module.exports = {
  getHtml,
  formTime,
  getIp
}