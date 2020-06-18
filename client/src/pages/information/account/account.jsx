import React, { } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Form, Input } from 'antd';
import Captcha from '@/components/captcha';
import {
  username_reg,
  password_reg,
  phone_reg,
  email_reg
} from '@/utils/regular.js';
import {
  updateUserName,
  updatePhone,
  updateEmail,
  updatePassword
} from '@/redux/actions';
import './account.less';

const { Item } = Form;

function Account() {
  let user = useSelector(state => state.user)
  let dispatch = useDispatch()

  let saveUserName = (values) => {
    let { username, confirmPwd: password } = values
    dispatch(updateUserName(user._id, username, password))
  }
  let savePhone = (values) => {
    let { phone, phoneCaptcha: captcha } = values
    dispatch(updatePhone(user._id, phone, captcha))
  }
  let saveEmail = (values) => {
    let { email, emailCaptcha: captcha } = values
    dispatch(updateEmail(user._id, email, captcha))
  }
  let savePassword = (values) => {
    let { oldPassword, password } = values
    dispatch(updatePassword(user._id, oldPassword, password))
  }

  let [phoneForm] = Form.useForm()
  let [emailForm] = Form.useForm()

  return (
    <>
      <Card title="账号设置">
        <div className="card-content">
          <Form
            onFinish={saveUserName}
            fields={[
              { name: 'username', value: '' },
              { name: 'confirmPwd', value: '' }
            ]}
            className="card-content__form"
          >
            <Item label="用户名">
              <span>{user.username}</span>
            </Item>
            <Item
              label="新用户名"
              name="username"
              rules={[
                { required: true, whitespace: true, message: '账号必须输入' },
                { min: 5, message: '账号至少5位' },
                {
                  pattern: username_reg,
                  message: '账号格式不正确'
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || !user.username || (user.username && user.username !== value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject('用户名没有被修改');
                  },
                })
              ]}
            >
              <Input placeholder="请输入用户名" className="input" allowClear />
            </Item>
            <Item
              label="密码验证"
              name="confirmPwd"
              rules={[
                { required: true, whitespace: true, message: '密码必须输入' },
                { min: 5, message: '密码至少5位' },
                { max: 20, message: '密码最多20位' },
                {
                  pattern: password_reg,
                  message: '密码格式不正确'
                }
              ]}
            >
              <Input.Password placeholder="请输入密码" className="input" />
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="save-btn"
              >
                保存
            </Button>
            </Item>
          </Form>
        </div>
      </Card>
      <Card title="登录手机">
        <div className="card-content">
          <Form
            form={phoneForm}
            onFinish={savePhone}
            fields={[
              { name: 'phone', value: '' },
              { name: 'phoneCaptcha', value: '' }
            ]}
            className="card-content__form"
          >
            <Item label="原手机号">
              <span>
                {
                  user.phone ? user.phone.substring(0, 3) + '*****' + user.phone.substring(8, 11)
                    : '未绑定手机号'
                }
              </span>
            </Item>
            <Item
              label="新手机号"
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                {
                  pattern: phone_reg,
                  message: '手机号格式不正确'
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || !user.phone || (user.phone && user.phone !== value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject('手机号没有被修改');
                  },
                })
              ]}
            >
              <Input
                // addonBefore={prefixSelector}
                className="input"
                placeholder="请输入手机号"
                allowClear
              />
            </Item>
            <Item
              label="验证码"
              name="phoneCaptcha"
              rules={[
                { required: true, message: '请输入验证码' },
                { len: 6, message: '请输入有效验证码' }
              ]}
            >
              <Input
                className="input"
                suffix={<Captcha form={phoneForm} type="phone" />}
                placeholder="请输入验证码"
              />
            </Item>
            <Button
              type="primary"
              htmlType="submit"
              className="save-btn"
            >
              保存
            </Button>
          </Form>
        </div>
      </Card>
      <Card title="绑定邮箱">
        <div className="card-content">
          <Form
            className="card-content__form"
            form={emailForm}
            onFinish={saveEmail}
            fields={[
              { name: 'email', value: '' },
              { name: 'emailCaptcha', value: '' }
            ]}
          >
            <Item label="原邮箱号">
              <span>{user.email || '未绑定邮箱'}</span>
            </Item>
            <Item
              label="新邮箱号"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱号' },
                {
                  pattern: email_reg,
                  message: '邮箱号格式不正确'
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || !user.email || (user.email && user.email !== value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject('邮箱没有被修改');
                  },
                })
              ]}
            >
              <Input className="input" placeholder="请输入邮箱号" allowClear/>
            </Item>
            <Item
              label="验证码"
              name="emailCaptcha"
              rules={[
                { required: true, message: '请输入验证码' },
                { len: 6, message: '请输入有效验证码' }
              ]}
            >
              <Input
                className="input"
                suffix={<Captcha form={emailForm} type="email" />}
                placeholder="请输入验证码"
              />
            </Item>
            <Button
              type="primary"
              htmlType="submit"
              className="save-btn"
            >
              保存
            </Button>
          </Form>
        </div>
      </Card>
      <Card title="登录密码">
        <div className="card-content">
          <Form
            className="card-content__form"
            onFinish={savePassword}
            fields={[
              { name: 'oldPassword', value: '' },
              { name: 'password', value: '' },
              { name: 'confirm', value: '' },
            ]}
          >
            <Item
              label="原密码"
              name="oldPassword"
              rules={[
                { required: true, whitespace: true, message: '密码必须输入' },
                { min: 5, message: '密码至少5位' },
                { max: 20, message: '密码最多20位' },
                {
                  pattern: password_reg,
                  message: '密码格式不正确'
                }
              ]}
            >
              <Input.Password placeholder="请输入原密码" className="input" />
            </Item>
            <Item
              label="新密码"
              name="password"
              rules={[
                { required: true, whitespace: true, message: '密码必须输入' },
                { min: 5, message: '密码至少5位' },
                { max: 20, message: '密码最多20位' },
                {
                  pattern: password_reg,
                  message: '密码格式不正确'
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('oldPassword') !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('密码没有被修改');
                  },
                })
              ]}
            >
              <Input.Password placeholder="请输入新密码" className="input" />
            </Item>
            <Item
              label="确认密码"
              name="confirm"
              rules={[
                {
                  required: true,
                  message: '密码必须确认',
                },
                { min: 5, message: '密码至少5位' },
                { max: 20, message: '密码最多20位' },
                {
                  pattern: password_reg,
                  message: '密码格式不正确'
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两次密码不一致');
                  },
                })
              ]}
            >
              <Input.Password placeholder="请确认密码" className="input" />
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="save-btn"
              >
                保存
            </Button>
            </Item>
          </Form>
        </div>
      </Card>
    </>
  )
}

export default Account