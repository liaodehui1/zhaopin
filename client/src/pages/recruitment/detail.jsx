import React, { useState, useEffect } from 'react';
import { getJobById } from '@/api';
import { Tag, Spin } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { iconfontUrl } from '@/config';
import { BASE_IMG_URL } from '@/utils/constants';
import './detail.less';

const Iconfont = createFromIconfontCN({
  scriptUrl: iconfontUrl
})

function Detail(props) {
  let [data, setData] = useState(null)
  const { id } = props.match.params

  useEffect(() => {
    getJobById(id)
      .then(res => {
        if (res.status === 0) setData(res.data)
      })
      .catch(error => console.log(error))
  }, [id])

  return (
    <>
      {
        data ? (
          <div className="job">
            <section className="job_detail">
              <header>
                <h1 className="job_detail--positionname">
                  {data.positionname}
                  {
                    data.isCrawled && (
                      <a
                        target="_blank"
                        rel="noopener noreferrer" 
                        href={`https://www.lagou.com/jobs/${data.id}.html`}
                        className="origin"
                      >
                        信息来源于拉钩招聘
                      </a>
                    )
                  }
                </h1>
                <p>
                  <span className="job_detail--salary">
                    {`${data.salary[0]}k-${data.salary[1]}k`}
                  </span>
                  <span className="job_detail--experience">{data.experience}</span>
                  <span className="job_detail--education">{data.education}</span>
                  <span className="job_detail--type">{data.type}</span>
                </p>
                <p className="job_detail--tags">
                  {data.tags.map((tag, index) => (<Tag key={index}>{tag}</Tag>))}
                </p>
              </header>
              <main>
                <div>
                  <h2 className="job_detail--advantage">职位福利</h2>
                  <p>{data.advantage}</p>
                </div>
                <div>
                  <h2 className="job_detail--content">职位详情</h2>
                  <div dangerouslySetInnerHTML={{ __html: data.detail }}></div>
                </div>
              </main>
            </section>
            <aside className="job_company">
              <dl>
                <dt>
                  <img
                    src={data.isCrawled ? data.company.img : BASE_IMG_URL + data.company.img}
                    alt={data.company.name} 
                    className="job_company--logo"
                  />
                  <h1 className="job_company--name">{data.company.name}</h1>
                </dt>
                <dd>
                  <Iconfont type="icon-fourSquare" />
                  <span>{data.company.fourSquare}</span>
                </dd>
                <dd>
                  <Iconfont type="icon-trend" />
                  <span>{data.company.trend}</span>
                </dd>
                <dd>
                  <Iconfont type="icon-figure" />
                  <span>{data.company.figure}</span>
                </dd>
                <dd>
                  <Iconfont type="icon-homePage" />
                  <a href={data.company.home} rel="noopener noreferrer">
                    {data.company.home}
                  </a>
                </dd>
                <dd>
                  <Iconfont type="icon-address" />
                  <span>{`${data.address.city}${data.address.district}${data.address.bizArea ? data.address.bizArea : ''}`}</span>
                </dd>
              </dl>
            </aside>
          </div>
        ) : (
            <div className="loading">
              <Spin />
            </div>
          )
      }
    </>
  )
}

export default Detail