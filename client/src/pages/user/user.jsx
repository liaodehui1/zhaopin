import React, { Component } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  message
} from 'antd';
import LinkButton from '@/components/link-button';
import { reqUsers, reqAddOrUpdateUser, reqDeleteUser } from '@/api';
import { formateDate } from '@/utils/dateUtils';
import { PAGE_SIZE } from "@/utils/constants";
import UserForm from './user-form';
import { validateFields } from '@/utils/validateFields';

export default class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      roles: [],
      isShow: false
    }
    this.title = (
      <Button
        type="primary"
        onClick={this.showAdd}
      >创建用户</Button>
    )
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (roleId) => this.roleNames[roleId]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton
              onClick={() => this.showUpdate(user)}
            >修改</LinkButton>
            <LinkButton
              onClick={() => this.clickDelete(user)}
            >删除</LinkButton>
          </span>
        )
      }
    ]
  }

  componentDidMount() {
    this.getUsers()
  }

  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const { users, roles } = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  initRoleNames = (roles) => {
    this.roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
  }

  showAdd = () => {
    this.user = null // 取消update设置的user
    this.setState({ isShow: true })
  }

  showUpdate = (user) => {
    this.user = user
    this.setState({ isShow: true })
  }

  clickDelete = (user) => {
    Modal.confirm({
      title: `确定删除${user.username}吗?`,
      onOk: async () => {
        reqDeleteUser(user._id)
          .then(res => {
            message.success('删除用户成功')
            let data = this.state.users.filter(item => item !== user)
            this.setState({ users: data })
          })
          .catch(error => console.log(error))
      }
    })
  }

  handleCancel = () => {
    this.form.resetFields()
    this.setState({ isShow: false })
  }

  addOrUpdateUser = async () => {
    await validateFields(this.form, async (values) => {
      if (this.user) {
        values._id = this.user._id
      }
      const result = await reqAddOrUpdateUser(values)
      if (result.status === 0) {
        message.success(`${this.user ? '修改' : '添加'}用户成功`)
        this.handleCancel()
        this.getUsers()
      } else {
        message.error(`${this.user ? '修改' : '添加'}用户失败`)
      }
    })
  }

  render() {
    const { users, roles, isShow } = this.state
    const user = this.user || {}

    return (
      <Card title={this.title}>
        <Table dataSource={users}
          columns={this.columns}
          bordered
          pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }}
          rowKey="_id" />
        <Modal
          title={!user._id ? '添加用户' : '修改用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
        >
          <UserForm
            roles={roles}
            user={user}
            setForm={(form) => this.form = form}
          />
        </Modal>
      </Card>
    );
  }
}
