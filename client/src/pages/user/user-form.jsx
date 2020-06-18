import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';

const { Item } = Form
const { Option } = Select

function UserForm(props) {
  const [form] = Form.useForm()
  const { roles, user, setForm } = props

  useEffect(() => {
    setForm(form)
  }, [form])

  const formItemLayout = {
    labelCol: { span: 4 }, // label所占格数
    wrapperCol: { span: 16 } // 包裹容器所占格数
  }
  
  // fields从外部传来表单数据
  // initialValues表单初始值
  const fields = [
    { name: 'username', value: user.username },
    { name: 'password', value: '' },
    { name: 'phone', value: user.phone },
    { name: 'email', value: user.email },
    { name: 'role_id', value: user.role_id || roles[0]._id }
  ]
  return (
    <Form
      {...formItemLayout}
      form={form}
      fields={fields}
    >
      <Item
        label="用户名"
        name="username"
        rules={[
          { required: true, whitespace: true, message: '账号必须输入' },
          { min: 5, message: '账号至少5位' },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: '账号格式不正确'
          }
        ]}
      >
        <Input placeholder="请输入用户名"></Input>
      </Item>
      {
        !user._id ? (
          <Item
            label="密码"
            name="password"
            rules={[
              { required: true, whitespace: true, message: '密码必须输入' },
              { min: 5, message: '密码至少5位' },
              { max: 20, message: '密码最多20位' },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: '密码格式不正确'
              }
            ]}
          >
            <Input type="password" placeholder="请输入密码"></Input>
          </Item>
        ) : null
      }
      <Item
        label="手机号"
        name="phone"
        rules={[
          { required: true, message: '请输入手机号' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确'
          }
        ]}
      >
        <Input placeholder="请输入手机号"></Input>
      </Item>
      <Item
        label="邮箱"
        name="email"
        rules={[
          {
            pattern: /^(\w+)(\.\w+)*@(\w+)((\.\w+)+)$/,
            message: '邮箱格式不正确'
          }
        ]}
      >
        <Input placeholder="请输入邮箱"></Input>
      </Item>
      <Item
        label="角色"
        name="role_id"
      >
        <Select>
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
    </Form>
  )
}

UserForm.propTypes = {
  setForm: PropTypes.func.isRequired,
  roles: PropTypes.array,
  user: PropTypes.object
}

export default UserForm