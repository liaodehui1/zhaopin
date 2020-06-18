const httpsConfig = {
  num: 3,
  pages: 5,
  getUrl: function(page) {
    // return `https://www.xicidaili.com/wn/${page}`
    return `http://www.xiladaili.com/https/${page}`
  },
  testDir: './spider/test.js',
  output: 'F:\\软件项目实训\\data\\ip_https.json',
  charset: 'utf-8'
}

const lgConfig = {
  num: 3,
  pages: 10,
  getFirstUrl: function(page) {
    return `https://www.lagou.com/zhaopin/${page}/?filterOption=3&sid=8ca773217f7f4f868cf0ad36171ca2c6`
  },
  getSecondUrl: function(id) {
    return `https://www.lagou.com/jobs/${id}.html?show=3eb94db2daa541c1818c2165ca338b35`
  },
  getTestUrl: function() {
    return `https://m.lagou.com/search.json?city=%E5%85%A8%E5%9B%BD&positionName=%E5%89%8D%E7%AB%AF&pageNo=1&pageSize=15`
  },
  childDir: './spider/lg_spider_child.js',
  output: 'F:\\软件项目实训\\data\\lg.json',
  charset: 'utf-8'
}

module.exports = {
  httpsConfig,
  lgConfig
}