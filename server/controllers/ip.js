const IpModel = require('../models/IpModel')

function addIP(iplist) {
  if(!(iplist instanceof Array)) iplist = [iplist]
  return new Promise((resolve, reject) => {
    function worker(ipac) {
      if(ipac == iplist.length) return;
      return IpModel.findOne({ ip: iplist[ipac].ip })
        .then(ip => {
          if(!ip) return IpModel.create(iplist[ipac])
          else console.log(ip.ip, '已经存在')
        })
        .then(res => {
          return worker(ipac + 1)
        })
        .catch(err => {
          reject('保存失败')
        })
    }
    worker(0).then(() => resolve('保存ip成功'))
  })
}

async function getIps(page = 0, size = 20) {
  let iplist = []
  try {
    let flag = false
    iplist = await IpModel.find().skip(page * size).limit(size)
    if(!iplist.length) {
      iplist = await IpModel.find().limit(size)
      flag = true
    }
    return { iplist, page: flag ? 0 : page }
  } catch (error) {
    console.log(error)
  }
}

async function deleteIp(ip) {
  try {
    await IpModel.deleteOne({ ip })
  } catch (error) {
    console.log(error)
  }
  return true
}

module.exports = {
  addIP,
  getIps,
  deleteIp
}