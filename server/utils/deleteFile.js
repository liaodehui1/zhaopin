const fs = require('fs')
const path = require('path')

module.exports = function deleteFile(filename) {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(__dirname, '..', 'public/upload/', filename), function (error) {
    if(error) {
      console.log('删除文件', error)
      reject(error)
    }else {
      resolve(true)
    }
  })
  })
}