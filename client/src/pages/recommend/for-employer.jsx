import React, { useEffect, useState } from 'react'
import { reqRecommendResume } from '@/api'
import storageUtils from '@/utils/storageUtils'
import { useSelector } from 'react-redux'
import { Card, Table, Button, Modal } from 'antd'
import { getYear } from '@/utils/dateUtils'
import LinkButton from '@/components/link-button'
import { educationConfig } from '@/config/resumeConfig'
import Default from '@/templates/default'

function getEduction(educations) {
  let year = getYear(educations[0].endTime), cur = 0
  for (let i = 1; i < educations.length; i++) {
    let thisYear = getYear(educations[i].endTime)
    if (thisYear > year) {
      year = thisYear
      cur = i
    }
  }
  return educations[cur]
}


function ForEmployer(props) {
  let userId = useSelector(state => state.user._id)
  let [page, setPage] = useState(1)
  let [loading, setLoading] = useState(true)
  let [recommendList, setData] = useState([])
  let [resume, setResume] = useState(null)
  let [isShow, setIsShow] = useState(false)

  useEffect(() => {
    reqRecommendResume(storageUtils.getLastTime(userId))
      .then(res => {
        setData(res.data)
        setLoading(false)
        storageUtils.saveLastTime(userId, (res.data.length ? res.data[res.data.length - 1].create_time : 0))
      })
      .catch(error => console.log(error))
  }, [page])

  let handleChange = () => {
    setPage(page + 1)
  }

  const columns = [
    {
      title: '姓名',
      render: (resume) => resume.basic.name
    },
    {
      title: '求职意向',
      render: (resume) => resume.intention.position
    },
    {
      title: '最高教育',
      render: (resume) => {
        let { school, profession, educ, endTime } = getEduction(resume.educations)
        return `${school} / ${profession} / ${educationConfig[educ]} / ${getYear(endTime)}届`
      }
    },
    {
      title: '操作',
      render: (resume) => (
        <span>
          <LinkButton
            onClick={() => {
              setResume(resume)
              setIsShow(true)
            }}
          >查看</LinkButton>
        </span>
      )
    }
  ]

  return (
    <>
      <Card
        loading={loading}
        extra={<Button type="primary" onClick={handleChange}>换一换</Button>}
      >
        <Table
          dataSource={recommendList}
          columns={columns}
          bordered // 展示边框
          // 指定key
          rowKey="_id"
        />
      </Card>
      <Modal
        style={{minWidth: 800}}
        title="查看简历"
        visible={isShow}
        onOk={() => setIsShow(false)}
        onCancel={() => {
          setIsShow(false)
        }}
        okText="确定"
        cancelText="取消"
      >
        <Default resume={resume} />
      </Modal>
    </>
  )
}

export default ForEmployer