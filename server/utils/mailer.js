var _ = require('lodash');
var nodemailer = require('nodemailer');
const memoryUtil = require('./memeoryUtil')

var config = {
  host: 'smtp.163.com',
  port: 25,
  auth: {
    user: '你的邮箱',
    pass: '你的密码（非邮箱登录密码）'
  }
};

var transporter = nodemailer.createTransport(config);

function send(email) {
  // 应用默认配置
  var code = "" + _.random(1, 9) + _.random(9) + _.random(9) + _.random(9) + _.random(9) + _.random(9)

  var mail = {
    from: '你的邮箱',
    to: email,
    subject: '就业分析与推荐系统',
    text: `您的验证码是${code}, 5分钟内有效！`
  }

  // 发送邮件
  return new Promise((resolve, reject) => {
    transporter.sendMail(mail, function (error, info) {
      if (error) {
        console.log(error);
        reject(error)
      } else {
        // 保存验证码
        if (memoryUtil.captchaList[email]) {
          memoryUtil.captchaList[email].push(code);
        } else {
          memoryUtil.captchaList[email] = [code];
        }
        // 5分钟后删除验证码
        setTimeout(() => {
          delete memoryUtil.captchaList[email];
        }, 5 * 60 * 1000)
        resolve({ Message: `mail sent:${info.response}` })
      }
    });
  })
};

function verify(email, captcha) {
  return (memoryUtil.captchaList[email] && memoryUtil.captchaList[email].indexOf(captcha) > -1)
}

module.exports = {
  send,
  verify
}