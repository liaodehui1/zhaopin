/*
  能发送异步请求的函数
  封装axios
  函数返回Promise对象
*/

import axios from 'axios'
import { message } from 'antd'

// 使用了代理服务器，无需
axios.defaults.baseURL = 'http://localhost:4000'

export default function ajax(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    var options;
    if(method.toUpperCase() === 'GET') {
      options = {
        method: method.toUpperCase(),
        url,
        params: data,
        withCredentials: true
      }
    }else {
      options = {
        method: method.toUpperCase(),
        url,
        data,
        withCredentials: true
      }
    }
    let promise = axios(options)
    promise.then(response => {
      if(response.data.status === 0) {
        resolve(response.data)
      }else {
        message.error(response.data.msg)
        reject(response.data.msg)
      }
    }).catch(error => {
      message.error('请求错误' + error.message)
    })
  })
}