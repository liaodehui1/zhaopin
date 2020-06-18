import React, { useState, useEffect } from 'react'
import { withRouter } from "react-router-dom"
import LinkButton from '@/components/link-button'
import {
  Card,
  Button,
  Table,
  Space,
  Progress,
  message,
  Modal
} from 'antd'
import { reqResumeList, reqDeleteResume } from '@/api'
import { formateDate } from '@/utils/dateUtils'
import { useSelector, useDispatch } from 'react-redux'
import { TEMPORARY_RESUME } from '@/redux/action-types'
import storageUtils from '@/utils/storageUtils'
import { RESET_RESUME } from '@/redux/action-types'

function Resume(props) {
  let [resumes, setData] = useState([])
  let [loading, setLoading] = useState(true)
  let userId = useSelector(state => state.user._id)
  let dispatch = useDispatch()

  useEffect(() => {
    reqResumeList(userId)
      .then(res => setData(res.data))
      .catch(error => console.log(error))
      .finally(() => setLoading(false))
  }, [])

  let handleDelete = (resume) => {
    console.log(resume)
    Modal.confirm({
      title: `确定删除${resume.resume_name}吗?`,
      onOk: async () => {
        reqDeleteResume(resume._id)
          .then(res => {
            message.success('删除成功')
            let data = resumes.filter(item => item._id !== resume._id)
            setData(data)
          })
          .catch(error => console.log(error))
      },
      okText: '确定',
      cancelText: '取消'
    })
    
  }

  let toAdd = () => {
    dispatch({ type: RESET_RESUME })
    props.history.push('/admin/information/resume/addorupdate')
  }
  let toUpdate = (resume) => {
    dispatch({ type: TEMPORARY_RESUME, data: resume })
    storageUtils.saveResume(resume)
    props.history.push('/admin/information/resume/addorupdate')
  }
  let toView = (resume) => {
    dispatch({ type: TEMPORARY_RESUME, data: resume })
    storageUtils.saveResume(resume)
    props.history.push('/admin/information/resume/view')
  }

  const columns = [
    {
      title: '简历名称',
      dataIndex: 'resume_name'
    },
    {
      title: '进度',
      render: (resume) => {
        return (<Progress percent={resume.progress} size="small" />)
      }
    },
    {
      title: '更新时间',
      dataIndex: 'last_update_time',
      render: formateDate
    },
    {
      title: '操作',
      render: (resume) => (
        <Space size="middle">
          <LinkButton onClick={() => { toView(resume) }}>预览</LinkButton>
          <LinkButton onClick={() => { toUpdate(resume) }}>更新</LinkButton>
          <LinkButton onClick={() => { handleDelete(resume) }}>删除</LinkButton>
        </Space>
      )
    }
  ]

  return (
    <Card extra={<Button type="primary" onClick={toAdd}>添加</Button>}>
      <Table 
        columns={columns} 
        dataSource={resumes} 
        rowKey="_id"
        loading={loading}
      />
    </Card>
  )
}

export default withRouter(Resume)