import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  List,
  Avatar
} from 'antd'
import { getViewedJobs } from '@/api'
import { Link } from 'react-router-dom'
import LinkButtton from '@/components/link-button'
import { PAGE_SIZE } from '@/utils//constants'

function renderItem(item) {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={item.company.img} />}
        title={<Link to={`/admin/recruitment/search/${item.id}`}>{item.positionname}</Link>}
      />
    </List.Item>
  )
}

function ForSeeker() {
  let [histories, setHistories] = useState({
    data: [],
    totalPage: 0
  })
  let [pageNum, setPageNum] = useState(0)

  useEffect(() => {
    getViewedJobs(pageNum, 6)
      .then(res => setHistories(res.data))
      .catch(error => console.log(error))
  }, [pageNum])

  let handleChange = () => {
    setPageNum(pageNum + 1)
  }
  const header = (
    <span>
      最近浏览
      { pageNum < histories.totalPage && <LinkButtton onClick={handleChange}>换一批</LinkButtton>}
    </span>
  )
  return (
    <Row justify="space-between">
      <Col span={18}></Col>
      <Col span={5}>
        <List
          dataSource={histories.histories}
          header={header}
          bordered
          renderItem={renderItem}
        />
      </Col>
    </Row>
  )
}

export default ForSeeker