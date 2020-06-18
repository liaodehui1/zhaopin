import React, { useState, useEffect, useCallback } from "react";
import ReactEcharts from 'echarts-for-react'
import { getAverage } from '@/api';

function Average() {
  let [data, setData] = useState([])
  useEffect(() => {
    getAverage()
      .then(res => setData(res.list))
  }, [])
  let getOption = useCallback(() => {
    return {
      title: {
        text: '平均工资TOP10城市',
        left: 'center'
      },
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: data.map(item => item.city),
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value} k'
          }
        }
      ],
      series: [
        {
          name: '平均月薪',
          type: 'bar',
          barWidth: '60%',
          data: data.map(item => item.averageSalary)
        }
      ]
    };
  }, [data])
  return (
    <div style={{padding: 10}}>
      <ReactEcharts option={getOption()} style={{ height: 500 }} />
    </div>
  )
}

export default Average
