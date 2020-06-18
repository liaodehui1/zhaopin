import React, { useEffect, useState } from 'react'
import { getRecommendJobs } from '@/api'
import storageUtils from '@/utils/storageUtils'
import { useSelector, useDispatch } from 'react-redux'
import InfoItem from '@/components/info-item'
import { Card, List, Button } from 'antd' 
import { UPDATE_RECOMMEND_STATUS } from '@/redux/action-types'

function ForSeeker() {
  let userId = useSelector(state => state.user._id)
  let initState = useSelector(state => state.recommendStatus)
  let [page, setPage] = useState(1)
  let [loading, setLoading] = useState(true)
  let [recommendList, setData] = useState([])
  let dispatch = useDispatch()

  useEffect(() => {
    let last_time = initState.page >= page ? initState.last_time : storageUtils.getLastTime(userId)
    getRecommendJobs(last_time)
      .then(res => {
        setData(res.data)
        setLoading(false)
        // 下次开始获取时间点
        let next_time = res.data.length ? res.data[res.data.length - 1].create_time : 0
        storageUtils.saveLastTime(userId, next_time)
        // 存储这次的时间点，下次可能还要看这页
        dispatch({ type: UPDATE_RECOMMEND_STATUS, data: { page, last_time } })
      })
      .catch(error => console.log(error))
  }, [page])

  let handleChange = () => {
    setPage(page + 1)
  }

  return (
    <Card extra={<Button type="primary" onClick={handleChange}>换一换</Button>}>
      <List
        loading={loading}
        dataSource={recommendList}
        renderItem={item => (<InfoItem {...item} />)}
      />
    </Card>
  )
}

export default ForSeeker