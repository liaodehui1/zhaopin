import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Select, Input, Button } from 'antd'
import './login-form.less'
import { createFromIconfontCN } from '@ant-design/icons'
import { iconfontUrl } from '@/config'
import { login, loginBySms } from '@/redux/actions'
import Captcha from '@/components/captcha'
import { Link } from 'react-router-dom'
import {
  account_reg,
  password_reg,
  phone_reg
} from '@/utils/regular.js';

const { Item } = Form;
const { Option } = Select;
const IconFont = createFromIconfontCN({
  scriptUrl: iconfontUrl
});

function LoginForm() {
  // loginType: 0普通登录， 1验证码登录
  let [loginType, setType] = useState(0)
  let dispatch = useDispatch()
  let [form] = Form.useForm()

  let handleSubmit = (values) => {
    if (loginType === 0) {
      let { name, password } = values
      dispatch(login(name, password))
    } else {
      let { phone, captcha } = values
      dispatch(loginBySms(phone, captcha))
    }
  }
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 80, backgroundColor: '#fff' }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );
  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      className="login-form"
      size="large"
      initialValues={{
        prefix: '86'
      }}
    >
      {
        loginType === 0 ? (
          <>
            <Item
              name="name"
              rules={[
                { required: true, whitespace: true, message: '账号必须输入' },
                { min: 5, message: '账号至少5位' },
                {
                  pattern: account_reg,
                  message: '账号格式不正确'
                }
              ]}
            >
              <Input
                prefix={<IconFont type="icon-geren" className="pre-icon" />}
                type="name" placeholder="请输入用户名/手机号/邮箱"
              />
            </Item>
            <Item
              name="password"
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
              <Input.Password
                prefix={<IconFont type="icon-Password" className="pre-icon" />}
                placeholder="请输入密码"
              />
            </Item>
          </>
        ) : (
            <>
              <Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  {
                    pattern: phone_reg,
                    message: '手机号格式不正确'
                  }
                ]}
              >
                <Input
                  addonBefore={prefixSelector}
                  style={{ width: '100%' }}
                  placeholder="请输入手机号"
                />
              </Item>
              <Item
                name="captcha"
                rules={[
                  { required: true, message: '请输入验证码' },
                  { len: 6, message: '请输入有效验证码' }
                ]}
              >
                <Input
                  suffix={<Captcha form={form} type="phone"/>}
                  style={{ width: '100%' }}
                  placeholder="请输入验证码"
                />
              </Item>
            </>
          )
      }
      <Item>
        {
          loginType === 0 ? (
            <>
              <span className="switch" onClick={() => setType(1)}>手机验证码登录</span>
              <Link to="/forgot" className="forgot">忘记密码?</Link>
            </>
          ) : (<span className="switch" onClick={() => setType(0)}>密码登录</span>)
        }
      </Item>
      <Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
      </Item>
    </Form>
  )
}

export default LoginForm