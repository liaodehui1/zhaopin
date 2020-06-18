import React, { useState, useEffect } from 'react';
import { getCaptchaByPhone, getCaptchaByEmail } from '@/api';
import './index.less';
import { message } from 'antd';
import { validatorPhone, validatorEmail } from '@/utils/regular.js';

function Captcha({ form, type }) {
  let [pendding, setPendding] = useState(false)
  let [countdown, setCountdown] = useState(0)

  let handleClick = async () => {
    let value = form.getFieldValue(type)
    if(!value) return message.error(`请先输入${type === 'phone' ? '手机号' : '邮箱号'}`)
    if(type === 'phone' && !validatorPhone(value)) return message.error('请正确输入手机号')
    if(type === 'email' && !validatorEmail(value)) return message.error('请输入正确的邮箱号')
    var res;
    if(type === 'phone') res = await getCaptchaByPhone(value)
    if(type === 'email') res = await getCaptchaByEmail(value)
    if(res.status === 0) {
      setCountdown(60)
      setPendding(true)
    }else {
      message.error('验证码发送失败')
    }
  }
  useEffect(() => {
    let id = setInterval(() => {
      // console.log(countdown)
      if (countdown === 0) {
        setPendding(false)
        return clearInterval(id)
      }
      setCountdown(countdown - 1)
    }, 1000)
    return () => {
      // console.log('卸载')
      // 每次countdown变化都会执行
      return clearInterval(id)
    }
  }, [countdown])
  return (
    <>
      {
        !pendding ? (
          <span
            className="send-msg-code"
            onClick={handleClick}
          >获取验证码</span>
        ) : (
            <span className="send-msg-code">
              {countdown}s后重试
            </span>
          )
      }
    </>
  )
}

export default Captcha