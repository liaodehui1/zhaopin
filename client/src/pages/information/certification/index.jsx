import React, { useState, useEffect } from 'react'
import { Card, Form, Input, Cascader, Button, message } from 'antd'
import Upload from '@/components/upload'
import { options } from '@/config/resumeConfig'
import { validateFields } from '@/utils/validateFields'
import { UploadOutlined } from '@ant-design/icons'
import { reqCertification, reqAddCertification } from '@/api'
import { useSelector } from 'react-redux'

const { Item } = Form

function Certification() {
  let userId = useSelector(state => state.user._id)
  let [form] = Form.useForm()
  let [data, setData] = useState(null)

  useEffect(() => {
    reqCertification()
      .then(res => setData(res.data))
      .catch(error => console.log(error))
  }, [])

  let handleSubmit = () => {
    validateFields(form, (values) => {
      const [province, city, district] = values.address
      let address = {
        province,
        city,
        district,
        bizArea: values.bizArea
      }
      delete values.bizArea
      delete values.address
      values.address = address
      values.img = data.company.img
      let res = Object.assign({}, data, {company: values})
      reqAddCertification(Object.assign({}, res, {userId}))
        .then(res => message.success('保存成功'))
        .catch(error => console.log(error))
    })
  }
  let handleChange = (img) => {
    validateFields(form, (values) => {
      const [province, city, district] = values.address
      let address = {
        province,
        city,
        district,
        bizArea: values.bizArea
      }
      delete values.bizArea
      delete values.address
      values.address = address
      values.img = img
      let res = Object.assign({}, data, {company: values})
      setData(res)
    })
  }

  return (
    <Card title="我的公司" extra={<Button onClick={handleSubmit} type="primary">保存</Button>}>
      <Form
        form={form}
        style={{ maxWidth: 600 }}
        fields={[
          { name: 'name', value: (data && data.company.name) || '' },
          { name: 'fourSquare', value: (data && data.company.fourSquare) || '' },
          { name: 'trend', value: (data && data.company.trend) || '' },
          { name: 'figure', value: (data && data.company.figure) || '' },
          { name: 'home', value: (data && data.company.home) || '' },
          { name: 'address', value: (data && data.company.address && [data.company.address.province, data.company.address.city, data.company.address.district]) || '' },
          { name: 'bizArea', value: (data && data.company.address && data.company.address.bizArea) || '' }
        ]}
      >
        <Item
          label="公司名称"
          name="name"
          rules={[
            { required: true, message: '公司名称必须填写！' }
          ]}
        >
          <Input placeholder="请输入公司名称" allowClear />
        </Item>
        <Item
          label="经营范围"
          name="fourSquare"
          rules={[
            { required: true, message: '经营范围必须填写！' }
          ]}
        >
          <Input placeholder="请输入经营范围" allowClear />
        </Item>
        <Item
          label="融资情况"
          name="trend"
          rules={[
            { required: true, message: '融资情况必须填写！' }
          ]}
        >
          <Input placeholder="请输入融资情况，例如：未融资、天使轮、A/B/C轮融资，上市公司等" allowClear />
        </Item>
        <Item
          label="人员数量"
          name="figure"
          rules={[
            { required: true, message: '人员数量必须填写！' }
          ]}
        >
          <Input placeholder="请输入公司人员数量，例如：15人以下/150-200人/200人以上" />
        </Item>
        <Item
          label="公司主页"
          name="home"
          rules={[
            { required: true, message: '公司主页必须填写' }
          ]}
        >
          <Input placeholder="请输入公司主页" allowClear />
        </Item>
        <Item
          label="公司地址"
          name="address"
          rules={[
            { required: true, message: '公司地址必须选择' }
          ]}
        >
          <Cascader options={options} placeholder="请选择公司地址" />
        </Item>
        <Item
          label="详细地址"
          name="bizArea"
          rules={[
            { required: true, message: '详细地址必须选择' }
          ]}
        >
          <Input placeholder="请输入公司详细地址" allowClear />
        </Item>
        <Item
          label="公司logo"
        >
          <Upload
            initUrl={data && data.company.img}
            Icon={<UploadOutlined />}
            onChange={handleChange}
          />
        </Item>
      </Form>
    </Card>
  )
}

export default Certification