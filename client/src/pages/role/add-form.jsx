import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import  PropTypes from 'prop-types';

const { Item } = Form

function AddForm(props) {
  const [form] = Form.useForm()
  const { setForm }= props

  useEffect(() => {
    setForm(form)
  }, [form])
  const formItemLayout = {
    labelCol: { span: 4 }, // label所占格数
    wrapperCol: { span: 15 } // 包裹容器所占格数
  }
  return (
    <Form form={form}>
        <Item
          label="角色名称"
          name="roleName" 
          rules={[{ required: true, message: "角色名称必须输入" }]}
          {...formItemLayout}
        >
          <Input placeholder="请输入角色名称" />
        </Item>
      </Form>
  )
}

AddForm.propTypes = { 
  setForm: PropTypes.func.isRequired
}
export default AddForm