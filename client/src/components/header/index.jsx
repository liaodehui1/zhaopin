import React, { Component } from 'react';
import './index.less';
import { formateDate } from '@/utils/dateUtils';
import { reqWeather } from '@/api/index';
import { withRouter } from 'react-router-dom';
import { Modal } from 'antd';
import LinkButton from '../link-button/index';
import { connect } from 'react-redux';
import { logout } from '@/redux/actions';
import { ExclamationCircleOutlined } from '@ant-design/icons';

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sysTime: formateDate(Date.now()),
      dayPictureUrl: '',
      weather: '',
      pathname: ''
    }
  }

  getWeather = async () => {
    const { dayPictureUrl, weather } = await reqWeather('北京')
    console.log(dayPictureUrl, weather)
    this.setState({
      dayPictureUrl,
      weather
    })
  }

  getSysTime = () => {
    this.intervalId = setInterval(() => {
      this.setState({
        sysTime: formateDate(Date.now())
      })
    }, 1000)
  }

  logout = (e) => {
    e.preventDefault()
    Modal.confirm({
      content: '确定退出吗？',
      cancelText: '取消',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        // 移除登录状态
        // memoryUtils.user = {}
        this.props.logout({ reason: 'self' }) // 退出后admin拦截自动跳转
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  componentDidMount () {
    this.getWeather()
    this.getSysTime()
  }

  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  render() {
    const { sysTime, dayPictureUrl, weather } = this.state
    // const title = this.getTitle()
    const title = this.props.headerTitle
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{this.props.username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{sysTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

// withRouter 给不是通过路由切换过来的组件传入location、history、match属性
export default connect(
  (state) => ({ headerTitle: state.headerTitle, username: state.user.username }),
  { logout }
)(withRouter(Header))
