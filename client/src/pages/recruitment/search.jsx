import React, { useState, useEffect } from 'react';
import {
  Card,
  Select,
  Input,
  Button,
  List
} from 'antd';
import { getJobs, getSearchJobs } from '@/api';
import { PAGE_SIZE } from '@/utils/constants';
import InfoItem from '@/components/info-item';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_SEARCH_STATUS } from '@/redux/action-types'

const { Option } = Select

function Search() {
  let dispatch = useDispatch()
  let status = useSelector(state => state.searchStatus)
  let [ searchType, setSearchType ] = useState(status.searchType)
  let [ searchValue, setSearchValue ] = useState(status.searchValue)
  let [ pageNum, setPageNum ] = useState(status.pageNum)
  let [ jobs, setJobs ] = useState(status.jobs)
  let [ total, setTotal ] = useState(status.total)
  let [loading, setLoading] = useState(true)
  
  async function fetchData() {
    let res
    if(!!searchValue && !!searchType) {
      res = await getSearchJobs(pageNum, PAGE_SIZE, searchType, searchValue)
    }else {
      res = await getJobs(pageNum, PAGE_SIZE)
    }
    // console.log(res)
    setJobs(res.jobs)
    setTotal(res.total)
    setLoading(false)
    dispatch({ type: UPDATE_SEARCH_STATUS, data: {
      searchType,
      searchValue,
      pageNum,
      jobs: res.jobs,
      total: res.total
    } })
  }

  useEffect(() => {
    fetchData()
    // 什么时候清除？
    // return () => {
    //   dispatch({ type: UPDATE_SEARCH_STATUS, data: initStatus })
    // }
  }, [pageNum])

  function handleSelect(value) {
    setSearchType(value)
  }
  function handleInput(e) {
    setSearchValue(e.target.value)
  }
  function handleClick() {
    if(pageNum === 1) fetchData()
    setPageNum(1)
  }
  function handleNext(page) {
    setPageNum(page)
  }
  const title = (
    <span>
        <Select
          value={searchType}
          onChange={handleSelect}
          style={{width: 150}}
        >
          <Option value="positionname">按名称搜索</Option>
          <Option value="city">按城市搜索</Option>
          <Option value="company_name">按公司搜索</Option>
        </Select>
        <Input
          value={searchValue}
          placeholder="输入关键词"
          style={{width: 150, margin: '0 10px'}}
          onChange={handleInput}
          onPressEnter={handleClick}
        />
        <Button type="primary" onClick={handleClick}>搜索</Button>
      </span>
  )

  return (
    <Card title={title}>
      <List
        loading={loading}
        dataSource={jobs}
        pagination={{
          showSizeChanger: false,
          onChange: handleNext,
          pageSize: PAGE_SIZE,
          total,
          current: pageNum
        }}
        renderItem={item => (<InfoItem {...item} />)}
      />
    </Card>
  )
}

export default Search