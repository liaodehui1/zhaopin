import React, { useState, useEffect, useCallback } from 'react'
import { Form, Input, Select, Button, Steps, message } from 'antd'
import { reqRoles, hasUser } from '@/api'
import './register-form.less'
import Captcha from '@/components/captcha'
import { createFromIconfontCN } from '@ant-design/icons'
import { iconfontUrl } from '@/config'
import { validateFields } from '@/utils/validateFields'
import { useDispatch } from 'react-redux'
import { register } from '@/redux/actions'
import { 
  username_reg,
  password_reg
} from '@/utils/regular.js';

const { Item } = Form;
const { Option } = Select;
const { Step } = Steps;
const IconFont = createFromIconfontCN({
  scriptUrl: iconfontUrl
});

function Step1() {
  return (
    <>
      <Item
        name="username"
        rules={[
          { required: true, whitespace: true, message: '账号必须输入' },
          { min: 5, message: '账号至少5位' },
          {
            pattern: username_reg,
            message: '账号格式不正确'
          }
        ]}
      >
        <Input
          prefix={<IconFont type="icon-geren" className="pre-icon" />}
          placeholder="请输入用户名"
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
      <Item
        name="confirm"
        dependencies={['password']}
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
          }),
        ]}
      >
        <Input.Password 
          prefix={<IconFont type="icon-querenmima" className="pre-icon" />}
          placeholder="请确认密码"
        />
      </Item>
    </>
  )
}

function Step2(props) {
  const { roles, form } = props
  const prefixSelector = (
    <Item name="prefix" noStyle>
      <Select style={{ width: 80, backgroundColor: '#fff' }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Item>
  );
  return (
    <>
      <Item
        name="phone"
        rules={[
          { required: true, message: '请输入手机号' },
          {
            pattern: /^1[3-9]\d{9}$/,
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
      <Item
        name="role_id"
      >
        <Select placeholder="请选择您所属对象">
          {
            roles.map(role => (
              <Option
                key={role._id}
                value={role._id}
              >{role.name}</Option>
            ))
          }
        </Select>
      </Item>
    </>
  )
}

function RegisterForm() {
  let [roles, setRoles] = useState([])
  let [current, setCurrent] = useState(0)
  let [form] = Form.useForm()
  let [user, setUser] = useState({})
  let dispatch = useDispatch()

  let handleSubmit = (values) => {
    let userInfo = Object.assign({}, user, values)
    dispatch(register(userInfo))
  }

  async function getRoles() {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      setRoles(roles)
    }
  }
  useEffect(() => {
    getRoles()
  }, [])

  const steps = [
    {
      title: '注册账号',
      content: <Step1 />,
    },
    {
      title: '绑定手机号',
      content: <Step2 roles={roles} form={form}/>,
    },
  ];

  let next = useCallback(async () => {
    await validateFields(form, async (values) => {
      // 校验用户是否存在
      let result = await hasUser(values.username)
      if (result.status === 0) {
        setCurrent(current + 1);
        setUser(Object.assign({}, user, values))
      } else {
        message.error(result.msg)
      }
    })
  }, [current])

  let prev = useCallback(() => {
    setCurrent(current - 1);
  }, [current])

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      className="register-form"
      size="large"
      initialValues={{
        prefix: '86'
      }}
    >
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next} className="next-btn">
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            htmlType="submit"
            className="register-form-button"
          >
            注册
          </Button>
        )}
        {current > 0 && (
          <Button className="prev-btn" onClick={prev}>
            上一步
          </Button>
        )}
      </div>
    </Form>
  )
}

export default RegisterForm