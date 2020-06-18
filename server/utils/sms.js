/**
 * sms.send(手机号) 发送短信验证码
 * sms.verify(手机号,验证码) 校验验证码是否正确
 **/

const Core = require('@alicloud/pop-core');
const _ = require('lodash');
const memoryUtil = require('./memeoryUtil')

// 阿里云控制台 - 短信服务 - 国内消息
const SignName = "就业分析与推荐系统";
const TemplateCode = "你的TemplateCode";

// https://usercenter.console.aliyun.com/
const accessKeyId = "你的accessKeyId";
const accessKeySecret = "你的accessKeySecret";

var client = new Core({
    accessKeyId,
    accessKeySecret,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
});

exports.send = function (phone) {
    // 生成验证码
    // 开头为0时发送的短信验证码只有5位
    var code = "" + _.random(1, 9) + _.random(9) + _.random(9) + _.random(9) + _.random(9) + _.random(9);
    return new Promise((resolve, reject) => {
        try {
            client.request('SendSms', {
                RegionId: "cn-hangzhou",
                PhoneNumbers: phone,
                SignName,
                TemplateCode,
                TemplateParam: "{code:" + code + "}"
            }, {
                method: 'POST'
            }).then((result) => {
                if (result.Message && result.Message == "OK" && result.Code && result.Code == "OK") { // 短信发送成功
                    // 保存验证码
                    if (memoryUtil.captchaList[phone]) {
                        memoryUtil.captchaList[phone].push(code);
                    } else {
                        memoryUtil.captchaList[phone] = [code];
                    }
                    // 5分钟后删除验证码
                    setTimeout(() => {
                        delete memoryUtil.captchaList[phone];
                    }, 5 * 60 * 1000)
                    resolve(result)
                } else {
                    reject(result)
                }
            }, (ex) => {
                reject(ex)
            })
        } catch (error) {
            reject(error)
        }
    })
}

exports.verify = function (phone, captcha) {
    return (memoryUtil.captchaList[phone] && memoryUtil.captchaList[phone].indexOf(captcha) > -1)
    // return true
}