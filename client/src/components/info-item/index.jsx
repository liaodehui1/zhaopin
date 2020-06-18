import React from 'react';
import { Tag } from 'antd';
import './index.less';
import { Link } from 'react-router-dom';

function InfoItem(props) {
  function renderTags(tags) {
    return tags.map((tag, index) => (
      <Tag key={index}>{tag}</Tag>
    ))
  }
  return (
    <li>
      <div className="list_item_top">
        <div className="position">
          <div className="p_top">
            <Link to={`/admin/recruitment/search/${props.id}`}>
              <h3>{props.positionname}</h3>
              <span>[{props.address.city}·{props.address.district}]</span>
            </Link>
          </div>
          <div className="p_bot">
            <span className="money">{props.salary[0]}k-{props.salary[1]}k</span>
            {props.experience} / {props.education}
          </div>
        </div>
        <div className="company">
          <div className="company_desc">
            <div>
              <a href={props.company.home} target="_blank" rel="noopener noreferrer"><h3>{props.company.name}</h3></a>
            </div>
            <div>
              {props.company.fourSquare} / {props.company.trend} / {props.company.figure}
            </div>
          </div>
          <div className="logo">
            <a href={props.company.home} target="_blank" rel="noopener noreferrer">
              <img src={props.company.img} alt={props.company.name} />
            </a>
          </div>
        </div>
      </div>
      <div className="list_item_bot">
        <div>
          {renderTags(props.tags)}
        </div>
        <div>
          {props.advantage}
        </div>
      </div>
    </li>
  )
}

export default InfoItem