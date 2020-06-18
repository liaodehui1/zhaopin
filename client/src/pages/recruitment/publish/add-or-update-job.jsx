import React, { useRef, useState, useEffect } from 'react'
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Radio,
  message
} from 'antd'
import {
  experienceConfig,
  educationConfig,
  typeConfig
} from '@/config/jobConfig'
import EditableTagGroup from '@/components/editable-tag-group'
import RichTextEditor from '@/components/rich-text-editor'
import { validateFields } from '@/utils/validateFields'
import { useSelector } from 'react-redux'
import { reqPublishJob, getJobById } from '@/api'
import { withRouter } from 'react-router-dom'

const { Item } = Form
const { Option } = Select
const { TextArea } = Input

function Publish(props) {
  let userId = useSelector(state => state.user._id)
  let [form] = Form.useForm()
  let tagRef = useRef()
  let editRef = useRef()
  let [loading, setLoading] = useState(true)
  let [job, setJob] = useState(null)

  useEffect(() => {
    if(props.location.search === '') {
      setLoading(false)
      setJob({})
      return;
    };
    let id = props.location.search.match(/^\?id=(\d+)$/)[1]
    getJobById(id)
      .then(res => {
        setJob(res.data)
        setLoading(false)
      })
      .catch(error => console.log(error))
  }, [])

  let saveJob = () => {
    validateFields(form, (values) => {
      values.experience = `经验${experienceConfig[values.experience]}`
      values.education = educationConfig[values.education]
      values.type = typeConfig[values.type]
      values.tags = tagRef.current.getTags()
      values.salary = [parseInt(values.min), parseInt(values.max)]
      delete values.min
      delete values.max
      values.isCrawled = false
      values.userId = userId
      values.id = `${Date.now()}`.slice(-7) + parseInt(Math.random() * 1000)
      if(values.tags.length === 0) return message.info('请编辑该岗位类型！')
      values.detail = editRef.current.getContent()
      if(!values.detail) return message.info('请输入该职位详情！')
      values = Object.assign({}, job, values)
      reqPublishJob(values)
        .then(res => {
          message.success('发布成功')
          props.history.go(-1)
        })
        .catch(error => console.log(error))
    })
  }

  return (
    <Card
      loading={loading}
      extra={<Button type="primary" onClick={saveJob}>保存并退出</Button>}>
      {
        job && (
          <Form
            form={form}
            style={{ maxWidth: 600 }}
            fields={[
              {name: 'positionname', value: job.positionname || ''},
              {name: 'min', value: (job.salary && job.salary[0]) || ''},
              {name: 'max', value: (job.salary && job.salary[1]) || ''},
              {name: 'experience', value: job.experience && experienceConfig.indexOf(job.experience.slice(2))},
              {name: 'education', value: job.education && educationConfig.indexOf(job.education)},
              {name: 'type', value: job.type && typeConfig.indexOf(job.type)},
              {name: 'advantage', value: job.advantage || ''}
            ]}
          >
            <Item
              label="岗位名称"
              name="positionname"
              rules={[
                {required: true, message: '岗位名称必须输入'}
              ]}
            >
              <Input placeholder="请输入岗位名称" allowClear></Input>
            </Item>
            <Item
              label="月薪范围"
            >
              <Input.Group compact>
                <Item
                  name="min"
                  style={{ marginBottom: 0 }}
                  rules={[
                    {pattern: /^\d+$/, message: '内容必须为数字'}
                  ]}
                >
                  <Input
                    style={{
                      width: 100,
                      textAlign: 'center',
                    }}
                    placeholder="最低"
                  />
                </Item>
                <Input
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: 'none',
                    backgroundColor: '#fff'
                  }}
                  placeholder="~"
                  disabled
                />
                <Item
                  name="max"
                  style={{ marginBottom: 0 }}
                  rules={[
                    {pattern: /^\d+$/, message: '内容必须为数字'}
                  ]}
                >
                  <Input
                    style={{
                      width: 100,
                      textAlign: 'center',
                      borderLeftWidth: 0
                    }}
                    placeholder="最高"
                  />
                </Item>
              </Input.Group>
            </Item>
            <Item
              label="工作经验"
              name="experience"
              rules={[
                {required: true, message: '工作经验必须选择'}
              ]}
            >
              <Select placeholder="请选择工作经验">
                {experienceConfig.map((item, index) => (
                  <Option key={index} value={index}>{item}</Option>
                ))}
              </Select>
            </Item>
            <Item
              label="教育水平"
              name="education"
              rules={[
                {required: true, message: '教育水平必须选择'}
              ]}
            >
              <Select placeholder="请选择教育水平">
                {educationConfig.map((item, index) => (
                  <Option key={index} value={index}>{item}</Option>
                ))}
              </Select>
            </Item>
            <Item
              label="工作类型"
              name="type"
              rules={[
                {required: true, message: '工作类型必须选择'}
              ]}
            >
              <Radio.Group>
                {typeConfig.map((item, index) => (
                  <Radio key={index} value={index}>{item}</Radio>
                ))}
              </Radio.Group>
            </Item>
            <Item
              label="岗位类型"
              name="tags"
            >
              <EditableTagGroup ref={tagRef} tags={job.tags}/>
            </Item>
            <Item
              label="职位福利"
              name="advantage"
              rules={[
                {required: true, message: '职位福利必须输入'}
              ]}
            >
              <TextArea placeholder="请输入该岗位福利，吸引更多人才！" />
            </Item>
            <Item
              label="职位详情"
              name="detail"
            >
              <RichTextEditor ref={editRef} detail={job.detail}/>
            </Item>
          </Form>
        )
      }
    </Card>
  )
}

export default withRouter(Publish)