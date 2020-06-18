/*
能操作roles集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const resumeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  resume_name: { type: String, required: true },
  progress: { type: Number, required: true },
  last_update_time: { type: Number, default: Date.now },
  basic: {
    name: { type: String, required: true },
    sex: { type: Number, required: true },
    birth: { type: String, required: true },
    location: String,
    highest_education: { type: Number, required: true },
    graduation: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    wechart: { type: String },
    ID_type: Number,
    identity: String,
    hometown: String,
    political_status: Number
  },
  educations: { type: Array, required: true },
  intention: {
    city: String,
    position: { type: String, required: true }
  },
  projects: Array,
  skill: String,
  avatar: String,
  keywords: Array
})

// 3. 定义Model(与集合对应, 可以操作集合)
const ResumeModel = mongoose.model('resume', resumeSchema)

// 4. 向外暴露Model
module.exports = ResumeModel
