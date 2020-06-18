const UserKeModel = require('../models/UserKeModel')

async function AddUserKe(userId, keyword) {
  let userKe = await GetUserKe(userId)
  if(!userKe) {
    keywords = Array.isArray(keyword) ? keyword : [keyword]
    await UserKeModel.create({ userId, keywords })
  }else {
    let keywords = userKe.keywords.slice(0)
    keywords = keywords.concat(keyword)
    await UserKeModel.findOneAndUpdate({ userId }, { userId, keywords })
  } 
}

async function UpdateUserKe(userId, keywords) {
  await UserKeModel.findOneAndUpdate({ userId }, { userId, keywords })
}

async function GetUserKe(userId) {
  let userKe = await UserKeModel.findOne({ userId })
  return userKe
}

module.exports = {
  AddUserKe,
  GetUserKe,
  UpdateUserKe
}