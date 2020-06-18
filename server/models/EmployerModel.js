/*
能操作users集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const employerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  last_update_time: { type: Number, default: Date.now },
  company: { 
    name: String, 
    img: String, 
    fourSquare: String, 
    trend: String, 
    figure: String, 
    home: String,
    address: {
      province: String,
      city: String, 
      district: String, 
      bizArea: String 
    }
  }
})

// 3. 定义Model(与集合对应, 可以操作集合)
const EmployerModel = mongoose.model('employer', employerSchema)

// 4. 向外暴露Model
module.exports = EmployerModel