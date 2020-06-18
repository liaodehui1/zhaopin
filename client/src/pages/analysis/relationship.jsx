import React, { useCallback, useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import { getRelationship } from '@/api'

function Relationship() {
  let [experienceList, setExperienceList] = useState([])
  let [educationList, setEducationList] = useState([])
  useEffect(() => {
    getRelationship()
      .then(res => {
        setExperienceList(res.experienceList)
        setEducationList(res.educationList)
      })
  }, [])
  let getOption1 = useCallback(function() {
    return {
      title: {
        text: '工作经验与薪资关系',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        left: 10,
        data: ['最低薪资', '最高薪资', '平均薪资']
      },
      xAxis: [
        {
          type: 'category',
          data: experienceList.map(item => item.experience),
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '薪资',
          min: 0,
          max: Math.max(...experienceList.map(item => item.maxSalary)) + 10,
          interval: 20,
          axisLabel: {
            formatter: '{value} k'
          }
        },
        {
          type: 'value',
          name: '平均薪资',
          min: 0,
          max: Math.ceil(Math.max(...experienceList.map(item => item.averageSalary))),
          interval: 10,
          axisLabel: {
            formatter: '{value} k'
          },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '最低薪资',
          type: 'bar',
          data: experienceList.map(item => item.minSalary)
        },
        {
          name: '最高薪资',
          type: 'bar',
          data: experienceList.map(item => item.maxSalary)
        },
        {
          name: '平均薪资',
          type: 'line',
          yAxisIndex: 1,
          data: experienceList.map(item => item.averageSalary)
        }
      ]
    };
  }, [experienceList])
  let getOption2 = useCallback(function() {
    return {
      title: {
        text: '学历与薪资关系',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        left: 10,
        data: ['最低薪资', '最高薪资', '平均薪资']
      },
      xAxis: [
        {
          type: 'category',
          data: educationList.map(item => item.education),
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '薪资',
          min: 0,
          max: Math.max(...educationList.map(item => item.maxSalary)) + 10,
          interval: 20,
          axisLabel: {
            formatter: '{value} k'
          }
        },
        {
          type: 'value',
          name: '平均薪资',
          min: 0,
          max: Math.ceil(Math.max(...educationList.map(item => item.averageSalary))),
          interval: 10,
          axisLabel: {
            formatter: '{value} k'
          },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '最低薪资',
          type: 'bar',
          data: educationList.map(item => item.minSalary)
        },
        {
          name: '最高薪资',
          type: 'bar',
          data: educationList.map(item => item.maxSalary)
        },
        {
          name: '平均薪资',
          type: 'line',
          yAxisIndex: 1,
          data: educationList.map(item => item.averageSalary)
        }
      ]
    };
  }, [educationList])
  return (
    <div style={{padding: 10}}>
      <ReactEcharts option={getOption1()} style={{ height: 500 }} />
      <ReactEcharts option={getOption2()} style={{ height: 500 }} />
    </div>
  );
}

export default Relationship
