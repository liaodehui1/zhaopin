import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import './index.less';

export default class TopNav extends Component {
  render() {
    return (
      <div className="top-nav">
        <h1>就业分析与推荐</h1>
        <Menu onClick={this.handleClick} mode="horizontal">
          <Menu.Item key="index">
            <Link to="/">
              <span>首页</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="login">
            <Link to="/login">
              <span>登录</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="register">
            <Link to="/register">
              <span>注册</span>
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
