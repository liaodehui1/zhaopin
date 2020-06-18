import React from 'react';
import { Tabs } from 'antd';
import './index.less';
import LoginForm from './login-form';
import RegisterForm from './register-form';

const { TabPane } = Tabs;

function MyForm() {
  return (
    <div className="form">
      <Tabs defaultActiveKey="1">
        <TabPane tab="登录" key="1">
          <LoginForm />
        </TabPane>
        <TabPane tab="注册" key="2">
          <RegisterForm />
        </TabPane>
      </Tabs>
    </div>
  )
};

export default MyForm