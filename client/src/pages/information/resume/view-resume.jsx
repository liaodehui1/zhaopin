import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Card, Button, Select } from 'antd'
import { withRouter } from 'react-router-dom'
import Default from '@/templates/default'
import { template_config } from '@/config/resumeConfig'
import { getCanvasByHtmlId, canvasToPdf, downPdf } from '@/utils/pdf'

const { Option } = Select

function getComponent(name, resume) {
  switch(name) {
    case 'Default':
      return <Default resume={resume}/>
    default:
      return <Default resume={resume}/>
  }
}

function ViewResume(props) {
  let resume = useSelector(state => state.resume)
  let [template, setTemplate] = useState('Default')

  let toEdit = () => {
    props.history.push('/admin/information/resume/addorupdate')
  }
  let download = async () => {
    let htmlCanvas = await getCanvasByHtmlId('resume')
    let pdfInstance = await canvasToPdf(htmlCanvas)
    await downPdf(pdfInstance, resume.resume_name)
  }

  const extra = (
    <span>
      <Button type="primary" onClick={toEdit} style={{marginRight: 10}}>编辑</Button>
      <Button type="primary" onClick={download}>下载</Button>
    </span>
  )
  const title = useMemo(() => (
    <Select defaultValue="Default" onChange={setTemplate} type="primary">
      {
        template_config.map(item => (
          <Option key={item.key} value={item.key}>{item.value}</Option>
        ))
      }
    </Select>
  ), [template_config])
  return (
    <Card title={title} extra={extra}>
      { getComponent(template, resume) }
    </Card>
  )
}

export default withRouter(ViewResume)