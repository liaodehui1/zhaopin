/*
能操作roles集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const ipSchema = new mongoose.Schema({
  ip: String,
  create_time: {type: Number, default: Date.now}, // 创建时间,
  // max_age: Number
})

// 3. 定义Model(与集合对应, 可以操作集合)
const IpModel = mongoose.model('iplist', ipSchema)
// 4. 向外暴露Model
module.exports = IpModel
