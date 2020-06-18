import React, { useState, useEffect } from 'react'
import {
  Card,
  Modal,
  Descriptions,
  Form,
  Input,
  Select,
  DatePicker,
  message
} from 'antd'
import LinkButton from '@/components/link-button'
import { ADD_RESUME } from '@/redux/action-types'
import { useDispatch, useSelector } from 'react-redux'
import { educationConfig } from '@/config/resumeConfig'
import { CHORUS_reg } from '@/utils/regular'
import { validateFields } from '@/utils/validateFields'
import { monthFormat } from '@/config'
import locale from 'antd/es/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

const { Item } = Form
const { Option } = Select
const { RangePicker } = DatePicker

function EducationForm(props) {
  let { education, getForm } = props
  let [form] = Form.useForm()
  useEffect(() => {
    getForm(form)
  }, [form])

  return (
    <Form
      form={form}
      fields={[
        { name: 'educ', value: (education && education.educ) || 3 },
        { name: 'school', value: (education && education.school) || '' },
        { name: 'profession', value: (education && education.profession) || '' },
        { name: 'time', value: [
          moment((education && education.startTime) || new Date(), monthFormat),
          moment((education && education.endTime)  || new Date(), monthFormat)
        ] }
      ]}
    >
      <Item
        name="educ"
        label="学历"
      >
        <Select>
          {
            educationConfig.map((item, index) => (
              <Option key={index} value={index}>{item}</Option>
            ))
          }
        </Select>
      </Item>
      <Item
        name="school"
        label="学校"
        rules={[
          { required: true, message: '学校必须填写' },
          { pattern: CHORUS_reg, message: '内容必须是中文或英文' }
        ]}
      >
        <Input placeholder="请输入学校"></Input>
      </Item>
      <Item
        name="profession"
        label="专业"
        rules={[
          { pattern: CHORUS_reg, message: '内容必须是中文或英文' }
        ]}
      >
        <Input placeholder="请输入专业,如:软件工程"></Input>
      </Item>
      <Item
        name="time"
        label="在校时间"
      >
        <RangePicker locale={locale} picker="month" />
      </Item>
    </Form>
  )
}

function Education() {
  let initEducations = useSelector(state => state.resume.educations)
  let [educations, setData] = useState(initEducations || [])
  let [curEduc, setCurEduc] = useState(-1)
  let [isShow, setIsShow] = useState(false)
  let [form, setForm] = useState(null)
  let dispatch = useDispatch()

  let handleOk = () => {
    validateFields(form, (values) => {
      values.startTime = moment(values.time[0]._d).format(monthFormat)
      values.endTime = moment(values.time[1]._d).format(monthFormat)
      delete values.time
      let data = []
      if(curEduc === -1) {
        data = [...educations, values]
      }else {
        educations[curEduc] = values
        data = educations
      }
      setCurEduc(-1)
      setData(data)
      setIsShow(false)
      form.resetFields()
      dispatch({ type: ADD_RESUME, data: { educations: data } })
    })
  }
  let handleCancel = () => {
    setIsShow(false)
    setCurEduc(-1)
  }
  let getForm = (form) => {
    setForm(form)
  }
  let handleAdd = () => {
    setIsShow(true)
  }
  let handleEdit = (index) => {
    setCurEduc(index)
    setIsShow(true)
  }
  let handleDelete = (index) => {
    let data = educations.slice(0)
    data.splice(index, 1)
    setData(data)
    dispatch({ type: ADD_RESUME, data: { educations: data } })
    message.success('删除成功')
  }

  return (
    <>
      <Card
        title={<span>教育经历</span>} 
        extra={<LinkButton onClick={handleAdd}>添加</LinkButton>}
        style={{marginBottom: 10}}
      >
        {
          educations.map((education, index) => (
            <Descriptions key={index} column={5}>
              <Descriptions.Item>{educationConfig[education.educ]}</Descriptions.Item>
              <Descriptions.Item>{education.school}</Descriptions.Item>
              <Descriptions.Item>{education.profession}</Descriptions.Item>
              <Descriptions.Item>
                {`${education.startTime}~${education.endTime}`}
              </Descriptions.Item>
              <Descriptions.Item style={{textAlign: 'right'}}>
                <LinkButton onClick={() => { handleEdit(index) }}>编辑</LinkButton>
                <LinkButton onClick={() => { handleDelete(index) }}>删除</LinkButton>
              </Descriptions.Item>
            </Descriptions>
          ))
        }
      </Card>
      <Modal
        title="教育经历"
        visible={isShow}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <EducationForm education={curEduc !== -1 && educations[curEduc]} getForm={getForm}/>
      </Modal>
    </>
  )
}

export default React.memo(Education)