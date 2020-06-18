import React, { Component } from 'react';
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd';
import { PAGE_SIZE } from '@/utils/constants';
import { formateDate } from '@/utils/dateUtils';
import { reqRoles, reqAddRole, reqUpdateRole, reqDeleteRole } from '@/api';
import AddForm from './add-form';
import AuthForm from './auth-form';
import { connect } from 'react-redux';
import { logout } from '@/redux/actions';
import LinkButton from '@/components/link-button';
import { validateFields } from '@/utils/validateFields';

class Role extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roles: [],
      role: {},
      showAdd: false,
      showAuth: false
    }
    this.initColumn()
    this.auth = React.createRef()
    this.onSelect = this.onSelect.bind(this)
  }

  componentDidMount() {
    this.getRoles()
  }

  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }

  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            {/* <LinkButton 
              onClick={() => this.showUpdate(user)}
            >修改</LinkButton> */}
            <LinkButton
              onClick={() => this.clickDelete(user)}
            >删除</LinkButton>
          </span>
        )
      }
    ]
  }

  // onRow = (role) => {
  //   return {
  //     onClick: event => { // 点击行
  //       console.log(event.target)
  //       this.setState({
  //         role
  //       })
  //     },
  //   }
  // }

  clickDelete = (role) => {
    Modal.confirm({
      title: `确定删除${role.name}吗?`,
      onOk: async () => {
        reqDeleteRole(role._id)
          .then(res => {
            message.success('删除角色成功')
            let data = this.state.roles.filter(item => item !== role)
            this.setState({ roles: data })
          })
          .catch(error => console.log(error))
      },
      okText: '确定',
      cancelText: '取消'
    })
  }

  addRole = async () => {
    await validateFields(this.form, async (values) => {
      const { roleName } = values
      const result = await reqAddRole(roleName)
      console.log(result)
      if (result.status === 0) {
        this.setState({ showAdd: false })
        this.form.resetFields()
        message.success('添加角色成功')
        const role = result.data
        this.setState(state => ({
          roles: [...state.roles, role]
        }))

      } else {
        message.error('添加角色失败')
      }
    })
  }

  updateRole = async () => {
    const { role } = this.state // role 引用了state.roles中的一个role
    role.menus = this.auth.current.getMenus()
    role.auth_time = Date.now()
    role.auth_name = this.props.user.username
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      this.setState({ showAuth: false })
      message.success('更新角色成功')
      if (this.props.user.role_id === role._id) {
        // memoryUtils.user = {}
        // storageUtils.removeUser()
        // this.props.history.replace('/login')
        message.info('更改了当前用户角色权限，请重新登录')
        return this.props.logout()
      }
      // 无需setState也能实现更新
      // 但如果子组件有shouldComponentUpdate，由于role没变，子组件不会更新
      this.setState({
        roles: [...this.state.roles]
      })
    } else {
      message.error('更新角色失败')
    }
  }

  onSelect(role) {
    this.setState({ role })
  }

  render() {
    const { roles, role, showAdd, showAuth } = this.state
    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ showAdd: true })}
        >创建角色</Button>&nbsp;&nbsp;
        <Button
          type="primary"
          disabled={!role._id}
          onClick={() => this.setState({ showAuth: true })}
        >设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          dataSource={roles}
          columns={this.columns}
          bordered // 展示边框
          pagination={{ pageSize: PAGE_SIZE }}
          // 指定key
          rowKey="_id"
          rowSelection={{
            type: 'radio', // checkbox/radio
            selectedRowKeys: [role._id],
            onSelect: this.onSelect
          }}
        // onRow={this.onRow} // 处理点击事件
        />
        <Modal
          title="添加角色"
          visible={showAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ showAdd: false })
            // 清空表单
            this.form.resetFields()
          }}
          okText="确定"
          cancelText="取消"
        >
          <AddForm setForm={(form) => this.form = form} />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={showAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ showAuth: false })
          }}
          okText="确定"
          cancelText="取消"
        >
          <AuthForm ref={this.auth} role={role} />
        </Modal>
      </Card>
    );
  }
}

export default connect(
  (state) => ({ user: state.user }),
  { logout }
)(Role)