import React, { useState, useEffect } from 'react'
import {
  Card,
  Modal,
  Descriptions,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col
} from 'antd'
import { UserOutlined } from '@ant-design/icons';
import LinkButton from '@/components/link-button'
import { useSelector, useDispatch } from 'react-redux'
import {
  sexConfig,
  educationConfig,
  identityConfig,
  political_status_config
} from '@/config/resumeConfig'
import { dateFormat, monthFormat } from '@/config'
import { phone_reg, email_reg, CHORUS_reg } from '@/utils/regular'
import { validateFields } from '@/utils/validateFields'
import { ADD_RESUME } from '@/redux/action-types'
import locale from 'antd/es/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import Upload from '@/components/upload'

const { Item } = Form
const { Option } = Select
const { MonthPicker } = DatePicker
const prefixSelector = (
  <Form.Item name="ID_type" noStyle>
    <Select style={{ width: 100 }}>
      {
        identityConfig.map((item, index) => (
          <Option key={index} value={index}>{item}</Option>
        ))
      }
    </Select>
  </Form.Item>
)

function BasicForm(props) {
  const { basic, getForm } = props
  let [form] = Form.useForm()
  let user = useSelector(state => state.user)

  useEffect(() => {
    getForm(form)
  }, [form])

  return (
    <Form
      form={form}
      fields={[
        { name: 'name', value: (basic && basic.name) || '' },
        { name: 'sex', value: (basic && basic.sex) || 0 },
        { name: 'birth', value: moment((basic && basic.birth) || new Date(), dateFormat) },
        { name: 'location', value: (basic && basic.location) || '' },
        { name: 'highest_education', value: (basic && basic.highest_education) || 3 },
        { name: 'graduation', value: moment((basic && basic.graduation) || new Date(), monthFormat) },
        { name: 'phone', value: (basic && basic.phone) || user.phone },
        { name: 'email', value: (basic && basic.email) || user.email },
        { name: 'wechart', value: (basic && basic.wechart) || user.wechart },
        { name: 'ID_type', value: (basic && basic.ID_type) || 0 },
        { name: 'identity', value: (basic && basic.identity) || '' },
        { name: 'hometown', value: (basic && basic.hometown) || '' },
        { name: 'political_status', value: (basic && basic.political_status) || 0 }
      ]}
    >
      <Item
        name="name"
        label="姓名"
        rules={[
          { required: true, message: '姓名必须输入' },
          { max: 20, message: '姓名最长为20字符' },
          { pattern: CHORUS_reg, message: '名字只能是中文或英文' }
        ]}
      >
        <Input placeholder="请输入您的姓名"></Input>
      </Item>
      <Item
        name="sex"
        label="性别"
        rules={[
          { required: true, message: '性别必须选择' }
        ]}
      >
        <Select>
          {
            sexConfig.map((item, index) => (
              <Option key={index} value={index}>{item}</Option>
            ))
          }
        </Select>
      </Item>
      <Item
        name="birth"
        label="出生日期"
        rules={[
          { required: true, message: '出生日期必须输选择' }
        ]}
      >
        <DatePicker locale={locale} format={dateFormat} />
      </Item>
      <Item
        name="location"
        label="目前所在地"
        rules={[
          { pattern: CHORUS_reg, message: '内容存在无效字符' }
        ]}
      >
        <Input placeholder="请输入您目前所在地"></Input>
      </Item>
      <Item
        name="highest_education"
        label="最高学历"
        rules={[
          { required: true, message: '最高学历必须选择' }
        ]}
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
        name="graduation"
        label="毕业时间"
        rules={[
          { required: true, message: '毕业时间必须选择' }
        ]}
      >
        <MonthPicker locale={locale} format={monthFormat} />
      </Item>
      <Item
        name="phone"
        label="手机号"
        rules={[
          { required: true, message: '手机号必须输入' },
          { pattern: phone_reg, message: '手机号格式不正确' }
        ]}
      >
        <Input placeholder="请输入您的手机号"></Input>
      </Item>
      <Item
        name="email"
        label="邮箱号"
        rules={[
          { required: true, message: '邮箱号必须输入' },
          { pattern: email_reg, message: '邮箱号格式不正确' }
        ]}
      >
        <Input placeholder="请输入您的邮箱"></Input>
      </Item>
      <Item
        name="wechart"
        label="微信号"
      >
        <Input placeholder="请输入您的微信号"></Input>
      </Item>
      <Item
        name="identity"
        label="证件号码"
      // rules={[
      //   { required: true, message: '证件号码必须输入' }
      // ]}
      >
        <Input addonBefore={prefixSelector} placeholder="请输入您的证件号码" />
      </Item>
      <Item
        name="hometown"
        label="籍贯"
      >
        <Input placeholder="请输入您的籍贯，如：浙江省杭州市" />
      </Item>
      <Item
        name="political_status"
        label="政治面貌"
      >
        <Select>
          {
            political_status_config.map((item, index) => (
              <Option key={index} value={index}>{item}</Option>
            ))
          }
        </Select>
      </Item>
    </Form>
  )
}

function Basic() {
  let avatar = useSelector(state => state.resume.avatar)
  let initBasic = useSelector(state => state.resume.basic)
  let dispatch = useDispatch()
  let [basic, setData] = useState(initBasic)
  let [isShow, setIsShow] = useState(false)
  let [form, setForm] = useState(null)

  let handleOk = () => {
    validateFields(form, (values) => {
      values.birth = moment(values.birth._d).format(dateFormat)
      values.graduation = moment(values.graduation._d).format(monthFormat)
      setData(values)
      setIsShow(false)
      form.resetFields()
      dispatch({ type: ADD_RESUME, data: { basic: values } })
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
  let handleChange = (avatar) => {
    dispatch({ type: ADD_RESUME, data: { avatar } })
  }

  return (
    <>
      <Card
        title={<span>基本资料</span>}
        extra={<LinkButton onClick={handleClick}>{basic ? '编辑' : '添加'}</LinkButton>}
        style={{ marginBottom: 10 }}
      >
        {
          basic && (
            <Row>
              <Col span={20}>
                <Descriptions column={4}>
                  <Descriptions.Item span={4}>{basic.name}</Descriptions.Item>
                  <Descriptions.Item span={1}>{sexConfig[basic.sex]}</Descriptions.Item>
                  <Descriptions.Item span={1}>{basic.birth}</Descriptions.Item>
                  {
                    basic.location && (
                      <Descriptions.Item span={1}>{basic.location}</Descriptions.Item>
                    )
                  }
                  <Descriptions.Item span={basic.location ? 1 : 2}>
                    {`${educationConfig[basic.highest_education]}|${basic.graduation.split('/')[0]}届`}
                  </Descriptions.Item>
                  <Descriptions.Item span={1}>{basic.phone}</Descriptions.Item>
                  <Descriptions.Item span={2}>{basic.email}</Descriptions.Item>
                  <Descriptions.Item span={1}>{basic.wechart}</Descriptions.Item>
                  {
                    basic.identity && (
                      <Descriptions.Item span={4}>
                        {`${identityConfig[basic.ID_type]}：${basic.identity}`}
                      </Descriptions.Item>
                    )
                  }
                  {
                    basic.hometown && (
                      <Descriptions.Item span={2}>{`籍贯：${basic.hometown}`}</Descriptions.Item>
                    )
                  }
                  <Descriptions.Item span={2}>
                    {`政治面貌：${political_status_config[basic.political_status]}`}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={4}>
                <Upload 
                  initUrl={avatar}
                  onChange={handleChange}
                  Icon={<UserOutlined style={{fontSize: 32}}/>}
                />
              </Col>
            </Row>
          )
        }
      </Card>
      <Modal
        title="基本资料"
        visible={isShow}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <BasicForm basic={basic} getForm={getForm} />
      </Modal>
    </>
  )
}

export default React.memo(Basic)