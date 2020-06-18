import React, { useState, useEffect } from 'react'
import { Descriptions, Form, Input, Progress, Modal } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import LinkButton from '@/components/link-button'
import { validateFields } from '@/utils/validateFields'
import { ADD_RESUME } from '@/redux/action-types'

const { Item } = Form

function HeaderForm(props) {
  let { resume_name, getForm } = props
  let [form] = Form.useForm()

  useEffect(() => {
    getForm(form)
  }, [])

  return (
    <Form
      form={form}
      fields={[
        {name: 'resume_name', value: resume_name}
      ]}
    >
      <Item
        label="简历名称"
        name="resume_name"
        rules={[
          { required: true, message: '简历名称不能为空' },
          { max: 20, message: '简历名称最长为20字符' }
        ]}
      >
        <Input allowClear placeholder="请输入简历名称"></Input>
      </Item>
    </Form>
  )
}

function Header() {
  let resume_name = useSelector(state => state.resume.resume_name)
  let progress = useSelector(state => state.resume.progress)
  let [isShow, setIsShow] = useState(false)
  let [form, setForm] = useState(null)
  let dispatch = useDispatch()
  
  let handleCancel = () => {
    setIsShow(false)
  }
  let getForm = (form) => {
    setForm(form)
  }
  let handleOk = () => {
    validateFields(form, (values) => {
      // 放在后面视图没更新
      dispatch({ type: ADD_RESUME, data: values })
      setIsShow(false)
      form.resetFields()
    })
  }
  let handleEdit = () => {
    setIsShow(true)
  }

  return (
    <>
      <Descriptions column={1} bordered style={{marginBottom: 10}}>
        <Descriptions.Item span={1} label="简历名称">
          <span>{resume_name}</span>
          <LinkButton onClick={handleEdit}>编辑</LinkButton>
        </Descriptions.Item>
        <Descriptions.Item span={1} label="完整度">
          <Progress percent={progress} size="middle"/>
        </Descriptions.Item>
      </Descriptions>
      <Modal
        title="简历名称"
        visible={isShow}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <HeaderForm resume_name={resume_name} getForm={getForm}/>
      </Modal>
    </>
  )
}

export default Header