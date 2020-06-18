import React, { Component } from 'react';
import './index.less';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import menuList from '@/config/menuConfig';
import { iconfontUrl } from '@/config';
// import memoryUtils from '@/utils/memoryUtils';
import { connect } from 'react-redux';
import { setHeaderTitle } from '@/redux/actions';
import { createFromIconfontCN } from '@ant-design/icons';

const { SubMenu } = Menu;
const IconFont = createFromIconfontCN({
  scriptUrl: iconfontUrl,
});

function getOpenKey(path) {
  let openKey = []
  const worker = (menuList) => {
    let len = menuList.length
    for (let i = 0; i < len; i++) {
      let item = menuList[i]
      if (item.key === path) {
        return true;
      }else if (item.children) {
        if (worker(item.children)) {
          openKey.push(item.key)
          return true;
        }
      }
    }
  }
  worker(menuList)
  return openKey
}

class LeftNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectKey: '',
      menuNodeList: this.getMenuNodes(menuList),
      openKey: []
    }
  }

  // 为第一次render准备数据
  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log('nextProps', nextProps)
    let path = nextProps.location.pathname
    if (path !== prevState.selectKey) {
      // 解决进入product下子路由界面时不选中和打开问题
      if (path.indexOf('/admin/information/resume') !== -1) { 
        path = '/admin/information/resume'
      }
      if (path.indexOf('/admin/recruitment/search') !== -1) { 
        path = '/admin/recruitment/search'
      }

      // if (path.lastIndexOf('/') !== 0)
      // 个人认为二级路由最好是 /一级路由/二级路由，当为无二级路由时省去获取openKey
      return {
        selectKey: path,
        openKey: getOpenKey(path)
      }
    }
    return null
  }

  // 获取菜单项
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname
    return menuList.reduce((pre, item) => {
      if (!this.hasAuth(item)) return pre;
      if (!item.children) {
        if (item.key === path || path.indexOf(item.key) !== -1) {
          this.props.setHeaderTitle(item.title)
        }
        pre.push((
          <Menu.Item key={item.key} onClick={() => this.props.setHeaderTitle(item.title)}>
            <Link to={item.key}>
              <IconFont type={`icon-${item.icon}`} style={{color: '#fff'}} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      } else {
        pre.push((
          <SubMenu
            key={item.key}
            title={
              <span>
                <IconFont type={`icon-${item.icon}`} style={{color: '#fff'}} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        ))
      }
      return pre
    }, [])
  }

  hasAuth = (item) => {
    const key = item.key
    const menus = this.props.user.role.menus
    // isPublic公开的；有权限；管理员admin
    if (item.isPublic || this.props.user.username === 'admin' || menus.includes(key)) {
      return true
    }
    // 子item有权限
    if (item.children) {
      return !!item.children.find(child => menus.includes(child.key))
    }
    return false
  }

  render() {
    const { selectKey, openKey, menuNodeList } = this.state
    // console.log(selectKey, openKey)

    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          {/* <img src={logo} alt="logo" /> */}
          <h1>就业分析与推荐</h1>
        </Link>
        <Menu
          selectedKeys={[selectKey]}
          defaultOpenKeys={openKey}
          mode="inline"
          theme="dark"
        >
          {menuNodeList}
        </Menu>
      </div>
    );
  }
}

// withRouter 高阶组件 传入location、history、match
export default connect(
  (state) => ({ user: state.user }), // mapStateToProps只能为函数
  { setHeaderTitle } // mapDispatchToProps 可以为对象或函数(dispatch) => ({})
)(withRouter(LeftNav))