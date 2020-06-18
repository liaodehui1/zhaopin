import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  message
} from 'antd';
import { PAGE_SIZE } from '@/utils/constants';
import { formateDate } from '@/utils/dateUtils';
import LinkButton from '@/components/link-button';
import { withRouter } from 'react-router-dom';
import { reqPublishJobs, reqDeleteJob } from '@/api';

function Home(props) {
  let [data, setData] = useState([])

  useEffect(() =>{
    reqPublishJobs()
      .then(res => setData(res.jobs))
      .catch(error => console.log(error))
  }, [])

  let toView = (job) => {
    props.history.push('/admin/recruitment/search/' + job.id)
  }
  let toEdit = (job) => {
    props.history.push('/admin/recruitment/publish/addorupdate?id=' + job.id)
  }
  let handleDelete = (job) => {
    Modal.confirm({
      title: `确定删除${job.positionname}吗?`,
      onOk: () => {
        reqDeleteJob(job._id)
          .then(res => {
            message.success('删除成功')
            let result = data.filter(item => item !== job)
            setData(result)
          })
          .catch(error => console.log(error))
      },
      okText: '确定',
      cancelText: '取消'
    })
  }
  let hanldePublish = () => {
    
    props.history.push('/admin/recruitment/publish/addorupdate')
  }
  const columns = [
    {
      title: '名称',
      dataIndex: 'positionname'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      sorter: {
        compare: (a, b) => a.create_time - b.create_time,
        multiple: 1,
      },
      render: formateDate
    },
    {
      title: '操作',
      render: (job) => (
        <span>
          <LinkButton 
            onClick={() => toView(job)}
          >查看</LinkButton>
          <LinkButton 
            onClick={() => toEdit(job)}
          >修改</LinkButton>
          <LinkButton
            onClick={() => handleDelete(job)}
          >删除</LinkButton>
        </span>
      )
    }
  ]
  return (
    <Card title="我的招聘" extra={<Button type="primary" onClick={hanldePublish}>发布</Button>}>
      <Table
        dataSource={data}
        columns={columns}
        bordered // 展示边框
        pagination={{ pageSize: PAGE_SIZE }}
        // 指定key
        rowKey="_id"
      ></Table>
    </Card>
  )
}

export default withRouter(Home)