import React, { PureComponent } from 'react';
import { Form, Input, Tree } from 'antd';
import menuList from '@/config/menuConfig';

const { Item } = Form;

// getDerivedStateFromProps控制了state是否更新，但shouldComponentUpdate默认返回true
// PureComponent实现了shouldComponentUpdate浅比较state和props的功能
export default class AuthForm extends PureComponent {
  constructor(props) {
    super(props)
    this.formItemLayout = {
      labelCol: { span: 4 }, // label所占格数
      wrapperCol: { span: 15 } // 包裹容器所占格数
    }
    this.state = {
      role: props.role,
      checkedKeys: props.role.menus // 只在第一次组件创建时赋值
    }
    this.initTreeData()
  }

  // 父组件render/传入新的props/自身更新
  static getDerivedStateFromProps(nextProps, prevState) {
    const { _id } = nextProps.role
    if(_id !== prevState.role._id) { // _id作为标识
      return {
        role: nextProps.role,
        checkedKeys: nextProps.role.menus
      }
    }
    return null // 不更新state
  }

  initTreeData = () => {
    this.menuList = [
      {
        title: '平台权限',
        key: 'all',
        children: menuList
      }
    ]
  }

  onCheck = checkedKeys => {
    this.setState({
      checkedKeys
    })
  };

  getMenus = () => this.state.checkedKeys

  render() {
    const { role, checkedKeys } = this.state

    return (
      <div>
        <Item label="角色名称" {...this.formItemLayout}>
          <Input value={role.name} disabled></Input>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          treeData={this.menuList}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        />
      </div>
    );
  }
}