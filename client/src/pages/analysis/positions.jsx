import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, Input, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'
import { getPositions } from '@/api'

function Positions() {
  let [searchValue, setSearchValue] = useState('')
  let [data, setData] = useState([])

  useEffect(() => {
    getPositions()
      .then(res => setData(res.positions))
  }, [])

  let handleChange = (e) => {
    setSearchValue(e.target.value)
  }

  let handleClick = useCallback(() => {
    getPositions(searchValue)
      .then(res => setData(res.positions))
  }, [searchValue])

  let getOption = useCallback(() => ({
    title: {
      text: '招聘职位数TOP10城市',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.city)
    },
    series: [
      {
        name: '职位数',
        type: 'bar',
        data: data.map(item => item.positions).reverse()
      }
    ]
  }), [data])

  let title = useMemo(() => (
    <span>
      <Input
        value={searchValue}
        onChange={handleChange}
        placeholder="请输入职业名称"
        style={{ width: 150, margin: '0 10px' }}
      />
      <Button type="primary" onClick={handleClick}>搜索</Button>
    </span>
  ), [searchValue, handleClick])

  return (
    <div>
      <Card title={title}>
        <ReactEcharts option={getOption()} style={{ height: 500 }} />
      </Card>
    </div>
  );
}

export default Positions