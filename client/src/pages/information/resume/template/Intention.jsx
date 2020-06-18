import React, { useState, useEffect } from 'react'
import {
  Card,
  Modal,
  Descriptions,
  Form,
  Input
} from 'antd'
import LinkButton from '@/components/link-button'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_RESUME } from '@/redux/action-types'
import { CHORUS_reg } from '@/utils/regular'
import { validateFields } from '@/utils/validateFields'

const { Item } = Form

function IntentionForm(props) {
  let { intention, getForm } = props
  let [form] = Form.useForm()
  useEffect(() => {
    getForm(form)
  }, [form])

  return (
    <Form
      form={form}
      fields={[
        { name: 'position', value: (intention && intention.position) || '' },
        { name: 'city', value: (intention && intention.city) || '' }
      ]}
    >
      <Item
        label="意向职位"
        name="position"
        rules={[
          { required: true, message: '意向职位必须填写' }
        ]}
      >
        <Input placeholder="请输入您的意向职位"></Input>
      </Item>
      <Item
        label="期望城市"
        name="city"
        rules={[
          { pattern: CHORUS_reg, message: '内容必须是中文或英文' }
        ]}
      >
        <Input placeholder="请输入您的期望城市"></Input>
      </Item>
    </Form>
  )
}

function Intention() {
  let initIntention = useSelector(state => state.resume.intention)
  let [intention, setData] = useState(initIntention)
  let [isShow, setIsShow] = useState(false)
  let [form, setForm] = useState(null)
  let dispatch = useDispatch()

  let handleOk = () => {
    validateFields(form, (values) => {
      setData(values)
      setIsShow(false)
      form.resetFields()
      dispatch({ type: ADD_RESUME, data: { intention: values } })
    })
  }
  let handleCancel = () => {
    setIsShow(false)
  }
  let getForm = (form) => {
    setForm(form)
  }
  let handleClick = () => {
    setIsShow(true)
  }

  return (
    <>
      <Card
        title={<span>求职意向</span>} 
        extra={<LinkButton onClick={handleClick}>{intention ? '编辑' : '添加'}</LinkButton>}
        style={{marginBottom: 10}}
      >
        {
          intention && (
            <Descriptions>
              <Descriptions.Item>{intention.position}</Descriptions.Item>
              <Descriptions.Item>{intention.city}</Descriptions.Item>
            </Descriptions>
          )
        }
      </Card>
      <Modal
        title="求职意向"
        visible={isShow}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <IntentionForm intention={intention} getForm={getForm}/>
      </Modal>
    </>
  )
}

export default React.memo(Intention)