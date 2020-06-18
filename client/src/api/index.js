/*
  接口函数
*/
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

// 登录
export function reqLogin (data) {
  return ajax('/login', data, 'POST')
}
export const reqLogout = () => ajax('/logout')
// 验证码登录
export function loginByCaptcha(data) {
  return ajax('/loginByCaptcha', data, 'POST')
}
// 获取手机验证码
export function getCaptchaByPhone(phone) {
  return ajax('/getCaptchaByPhone', { phone }, 'GET')
}
//获取邮箱验证码
export function getCaptchaByEmail(email) {
  return ajax('/getCaptchaByEmail', { email }, 'GET')
}

// 添加用户
export function addUser (user) {
  return ajax('/addUser', user, 'POST')
}
// 查询用户
export function hasUser (username) {
  return ajax('/hasUser', { username }, 'GET')
}
// 用户注册
export function reqRegister(user) {
  return ajax('/register', user, 'POST')
}

// 添加/更新用户 
export const reqAddOrUpdateUser = (user) => 
  ajax((user._id ? '/updateUser' : '/addUser'), user, 'POST')
// 修改用户名
export const reqUpdateUserName = (data) => ajax('/updateUserName', data, 'POST')
// 修改手机号
export const reqUpdatePhone = (data) => ajax('/updatePhone', data, 'POST')
// 修改邮箱号
export const reqUpdateEmail = (data) => ajax('/updateEmail', data, 'POST')
// 修改密码
export const reqUpdatePassword = (data) => ajax('/updatePassword', data, 'POST')

// 获取简历列表
export const reqResumeList = (id) => ajax('/getResumeList', { userId: id }, 'GET')
// 添加/更新简历
export const reqAddOrUpdateResume = (data) => ajax(`/${data._id ? 'update' : 'add'}Resume`, data, 'POST')
// 删除简历
export const reqDeleteResume = (_id) => ajax('/deleteResume', { _id }, 'DELETE')
// 获取推荐简历
export const reqRecommendResume = (last_time) => ajax('/getRecommendResume', { last_time }, 'GET')

//获取用人单位认证
export const reqCertification = () => ajax('/getCertification')
// 添加用人单位认证
export const reqAddCertification = (data) => ajax('/addCertification', data, 'POST')

// 删除图片
export const reqDeleteImg = (filename) =>  ajax('/manage/img/delete', { filename }, 'DELETE')
//获取用户列表 
export const reqUsers = () => ajax('/getUserList')

//删除用户 
export const reqDeleteUser = (userId) => ajax('/deleteUser', {userId}, 'DELETE')

// 天气请求
export function reqWeather (city) {
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  return new Promise((resolve, reject) => {
    jsonp(url, {
      param: 'callback'
    }, (error, res) => {
      if (!error && res.status === 'success') {
        const { dayPictureUrl, weather } = res.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      }else {
        message.error('获取天气信息失败')
      }
    })
  })
}

//添加角色 
export const reqAddRole = (roleName) => ajax('/addRole', {roleName}, 'POST')

//获取角色列表
export const reqRoles = () => ajax('/getRoleList')

//更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax('/updateRole', role, 'POST')

// 删除角色
export const reqDeleteRole = (roleId) => ajax('/deleteRole', { roleId }, 'DELETE')

// 获取招聘信息
export const getJobs = (pageNum, pageSize) => ajax('/getJobs', { pageNum, pageSize }, 'GET')
// 根据positionname/city搜索招聘信息
export const getSearchJobs = (pageNum, pageSize, searchType, searchValue) => {
  return ajax('/getSearchJobs', { pageNum, pageSize, [searchType]: searchValue }, 'GET')
}
// 根据id获取招聘信息
export const getJobById = (id) => ajax('/getJobById', { id }, 'GET')
// 获取最近浏览招聘信息
export const getViewedJobs = (pageNum, pageSize) => ajax('/getViewedJobs', { pageNum, pageSize })

// 获取平均工资
export const getAverage = () => ajax('/getAverage')
// 获取职位数
export const getPositions = (searchValue) => ajax('/getPositions', { positionname: searchValue }, 'GET')
// 获取工作经历/学历与薪资关系
export const getRelationship = () => ajax('/getRelationship')

// 发布招聘信息
export const reqPublishJob = (job) => ajax('/addPublishJob', { job }, 'POST')
export const reqPublishJobs = () => ajax('/getPublishJobs')
export const reqDeleteJob = (_id) => ajax('/deleteJob', { _id }, 'DELETE')

// 获取推荐信息
export const getRecommendJobs = (last_time) => ajax('/getRecommendJobs', { last_time })