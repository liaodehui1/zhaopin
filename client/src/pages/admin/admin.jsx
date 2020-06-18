import React, { Component } from 'react';
// import memoryUtils from '@/utils/memoryUtils';
import { Redirect, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import LeftNav from '@/components/left-nav';
import Header from '@/components/header';
import Home from '../home/home';
import Account from '../information/account/account';
import Resume from '../information/resume/index';
import Certification from '../information/certification'
import Average from '../analysis/average';
import Positions from '../analysis/positions';
import Relationship from '../analysis/relationship';
import Role from '../role/role';
import User from '../user/user';
import Search from '../recruitment/search';
import Detail from '../recruitment/detail';
import Publish from '../recruitment/publish/index';
import Recommend from '../recommend/index';
import NotFound from '../not-found/not-found';
import { useSelector } from 'react-redux';
import Auth from '@/components/auth';

const { Footer, Sider, Content } = Layout;

/**
 * 管理的路由组件
 */
function Admin() {
  let id = useSelector(state => state.user._id)
  if (!id) return <Redirect to="/" />
  else return (
    <Auth>
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header></Header>
          <Content style={{ backgroundColor: '#fff', margin: 20 }}>
            {/* 二级路由 */}
            <Switch>
              <Redirect exact from="/admin" to="/admin/home" />
              <Route path='/admin/home' component={Home} />
              <Route path='/admin/information/account' component={Account} />
              <Route path='/admin/information/resume' component={Resume} />
              <Route path='/admin/information/certification' component={Certification} />
              <Route path='/admin/analysis/average' component={Average} />
              <Route path='/admin/analysis/positions' component={Positions} />
              <Route path='/admin/analysis/relationship' component={Relationship} />
              <Route path='/admin/role' component={Role} />
              <Route path='/admin/user' component={User} />
              <Route exact path='/admin/recruitment/search' component={Search} />
              <Route exact path='/admin/recruitment/search/:id' component={Detail} />
              <Route path='/admin/recruitment/publish' component={Publish} />
              <Route path='/admin/recommend' component={Recommend} />
              <Route path="*" component={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#ccc' }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    </Auth>
  )
}

export default Admin