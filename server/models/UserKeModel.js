/*
  用户关键词表
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const userKeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  keywords: { type: Array, required: true }
})

// 3. 定义Model(与集合对应, 可以操作集合)
const UserKeModel = mongoose.model('userKe', userKeSchema)

// 4. 向外暴露Model
module.exports = UserKeModel