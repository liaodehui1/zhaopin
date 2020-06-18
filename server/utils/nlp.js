const request = require('request')
const md5 = require('blueimp-md5')

const params = 'eyJ0eXBlIjoiZGVwZW5kZW50In0='
const appID = '你的appID'
const appKey = '你的appKey'

function nlp(text) {
  return new Promise((resolve, reject) => {
    let curTime = `${Math.floor(Date.now() / 1000)}`

    let options = {
      url: 'https://ltpapi.xfyun.cn/v1/ke',
      headers: {
        'X-Appid': appID,
        'X-CurTime': curTime,
        'X-Param': params,
        'X-CheckSum': md5(appKey + curTime + params),
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      form: {
        text: text
      }
    }
    request.post(options, function (err, res, body) {
      if (err) {
        reject(err)
      } else {
        body = JSON.parse(body)
        if(body.data && body.data.ke) {
          let keywords = body.data.ke.map(item => item.word)
          resolve(keywords)
        }else {
          resolve([])
        }
      }
    })
  })
}

module.exports = {
  nlp
}