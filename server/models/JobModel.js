/*
能操作roles集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const jobSchema = new mongoose.Schema({
  id: String,
  isCrawled: Boolean,
  positionname: String,
  salary: Array,
  experience: String,
  education: String,
  type: String,
  tags: Array,
  advantage: String,
  address: { city: String, district: String, bizArea: String },
  company: { name: String, img: String, fourSquare: String, trend: String, figure: String, home: String },
  detail: String,
  keywords: Array,
  create_time: {type: Number, default: Date.now}, // 创建时间
  userId: { type: String, default: '' }
})

// 3. 定义Model(与集合对应, 可以操作集合)
const JobModel = mongoose.model('job', jobSchema)

// 4. 向外暴露Model
module.exports = JobModel
