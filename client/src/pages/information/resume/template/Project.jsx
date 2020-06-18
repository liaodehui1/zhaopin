import React, { useState, useEffect } from 'react'
import {
  Card,
  Modal,
  Descriptions,
  Form,
  Input,
  DatePicker,
  message
} from 'antd'
import LinkButton from '@/components/link-button'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_RESUME } from '@/redux/action-types'
import { validateFields } from '@/utils/validateFields'
import { monthFormat } from '@/config'
import locale from 'antd/es/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

const { Item } = Form
const { RangePicker } = DatePicker
const { TextArea } = Input

function ProjectForm(props) {
  let { project, getForm } = props
  let [form] = Form.useForm()
  useEffect(() => {
    getForm(form)
  }, [form])
  
  return (
    <Form
      form={form}
      fields={[
        { name: 'name', value: (project && project.name) || '' },
        { name: 'link', value: (project && project.link) || '' },
        { name: 'position', value: (project && project.position) || '' },
        { name: 'time', value: [
          moment(project.startTime || new Date(), monthFormat),
          moment(project.endTime  || new Date(), monthFormat)
        ] },
        { name: 'desc', value: (project && project.desc) || '' }
      ]}
    >
      <Item
        label="项目名称"
        name="name"
        rules={[
          { required: true, message: '项目名称必须填写' }
        ]}
      >
        <Input placeholder="请输入您的项目名称"></Input>
      </Item>
      <Item
        label="项目地址"
        name="link"
      >
        <Input placeholder="请输入您的项目地址"></Input>
      </Item>
      <Item
        label="职务"
        name="position"
      >
        <Input placeholder="请输入您所处的职务"></Input>
      </Item>
      <Item
        label="项目周期"
        name="time"
      >
        <RangePicker locale={locale} picker="month" />
      </Item>
      <Item
        label="项目描述"
        name="desc"
      >
        <TextArea
          placeholder={`请输入项目内容`}
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </Item>
    </Form>
  )
}

function Project() {
  let initProjects = useSelector(state => state.resume.projects)
  let [projects, setData] = useState(initProjects || [])
  let [isShow, setIsShow] = useState(false)
  let [form, setForm] = useState(null)
  let [cur, setCur] = useState(-1)
  let dispatch = useDispatch()

  let handleOk = () => {
    validateFields(form, (values) => {
      values.startTime = moment(values.time[0]._d).format(monthFormat)
      values.endTime = moment(values.time[1]._d).format(monthFormat)
      delete values.time
      let data = []
      if(cur === -1) {
        data = [...projects, values]
      }else {
        projects[cur] = values
        data = projects
      }
      setCur(-1)
      setData(data)
      setIsShow(false)
      form.resetFields()
      dispatch({ type: ADD_RESUME, data: { projects: data } })
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
    setCur(-1)
  }
  let handleEdit = (index) => {
    setIsShow(true)
    setCur(index)
  }
  let handleDelete = (index) => {
    let data = projects.slice(0)
    data.splice(index, 1)
    setData(data)
    dispatch({ type: ADD_RESUME, data: { projects: data } })
    message.success('删除成功')
  }

  return (
    <>
      <Card
        title={<span>项目经历</span>} 
        extra={<LinkButton onClick={handleClick}>添加</LinkButton>}
        style={{marginBottom: 10}}
      >
        {
          projects.map((project, index) => (
            <Descriptions key={index} column={4}>
              <Descriptions.Item span={1}>
                { project.link ? (
                  <a href={project.link} rel="noopener noreferrer">{project.name}</a>
                ) : project.name }
              </Descriptions.Item>
              <Descriptions.Item span={1}>{`${project.startTime}~${project.endTime}`}</Descriptions.Item>
              {
                project.position && <Descriptions.Item span={1}>{project.position}</Descriptions.Item>
              }
              <Descriptions.Item span={project.position ? 1 : 2} style={{textAlign: 'right'}}>
                <LinkButton onClick={() => { handleEdit(index) }}>编辑</LinkButton>
                <LinkButton onClick={() => { handleDelete(index) }}>删除</LinkButton>
              </Descriptions.Item>
              <Descriptions.Item span={4}>
                <p style={{whiteSpace: 'pre-wrap'}}>{project.desc}</p>
              </Descriptions.Item>
            </Descriptions>
          ))
        }
      </Card>
      <Modal
        title="项目经历"
        visible={isShow}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <ProjectForm project={cur !== -1 && projects[cur]} getForm={getForm}/>
      </Modal>
    </>
  )
}

export default React.memo(Project)