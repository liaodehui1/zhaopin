import React, { useMemo } from 'react'
import {
  sexConfig,
  educationConfig
} from '@/config/resumeConfig'
import { getYear } from '@/utils/dateUtils'
import { BASE_IMG_URL } from '@/utils/constants'
import './index.less'

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

function Default(props) {
  const { resume } = props
  const {
    basic = {},
    educations = [],
    intention = {},
    skill = '',
    projects = [],
    avatar = ''
  } = resume

  let education = useMemo(() => {
    return getEduction(educations)
  }, [educations])

  return (
    <div className="template">
      <div id="resume">
        {/* 基本信息 */}
        <div className="resume_basic">
          <div className="resume_basic--detail">
            <h1 className="name">{basic.name}</h1>
            <p>{`${sexConfig[basic.sex]} / ${getYear(basic.birth)} / ${getYear(basic.graduation)}届`}</p>
            <p>{`${educationConfig[education.educ]} / ${education.school} / ${education.profession}`}</p>
            <p>{`期待职位：${intention.position}`}</p>
          </div>
          <div className="resume_basic--picture">
            {avatar && (<img src={`${BASE_IMG_URL}${avatar}`} alt={basic.name} />)}
          </div>
        </div>
        {/* 联系方式 */}
        <div className="module">
          <div className="tip">
            <h2>联系方式</h2>
            <div className="line">
              <span className="line--theme"></span>
              <span className="line--black"></span>
            </div>
          </div>
          <div className="resume_contact">
            <span className="resume_contact--phone">{`手机：${basic.phone}`}</span>
            <span className="resume_contact--email">{`邮箱：${basic.email}`}</span>
            {basic.wechart && (<span className="resume_contact--wechart">{`微信：${basic.wechart}`}</span>)}
          </div>
        </div>
        {/* 技能清单 */}
        {
          skill.length && (
            <div className="module">
              <div className="tip">
                <h2>技能清单</h2>
                <div className="line">
                  <span className="line--theme"></span>
                  <span className="line--black"></span>
                </div>
              </div>
              <div dangerouslySetInnerHTML={{ __html: skill }} className="resume_skill"></div>
            </div>
          )
        }
        {/* 项目经历 */}
        {
          projects.length && (
            <div className="module">
              <div className="tip">
                <h2>项目经历</h2>
                <div className="line">
                  <span className="line--theme"></span>
                  <span className="line--black"></span>
                </div>
              </div>
              {
                projects.map((item, index) => (
                  <div key={index} className="resume_project">
                    <div className="resume_project_title">
                      <span className="resume_project_title--time">{`${item.startTime}~${item.endTime}`}</span>
                      <span className="resume_project_title--position">{item.position}</span>
                      <span className="resume_project_title--name">
                        {item.link ? (<a href={item.link} rel="nooperer noreferrer">{item.name}</a>) : item.name}
                      </span>
                    </div>
                    <p className="resume_project_desc">{item.desc}</p>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Default