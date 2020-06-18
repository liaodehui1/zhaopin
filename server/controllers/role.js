const RoleModel = require('../models/RoleModel')

// 添加角色
async function AddRole(ctx) {
  try {
    const { roleName } = ctx.request.body
    let role = await RoleModel.create({ name: roleName })
    ctx.body = { status: 0, data: role }
  } catch (error) {
    console.error('添加角色异常', error)
    ctx.body = { status: 1, msg: '添加角色异常, 请重新尝试' }
  }
}

// 获取角色列表
async function GetRoleList(ctx) {
  try {
    let roles = await RoleModel.find()
    ctx.body = { status: 0, data: roles }
  } catch (error) {
    console.error('获取角色列表异常', error)
    ctx.body = { status: 1, msg: '获取角色列表异常, 请重新尝试' }
  }
}

// 更新角色(设置权限)
async function UpdateRole(ctx) {
  try {
    const role = ctx.request.body
    role.auth_time = Date.now()
    let oldRole = await RoleModel.findOneAndUpdate({ _id: role._id }, role)
    ctx.body = { status: 0, data: { ...oldRole._doc, ...role } }
  } catch (error) {
    console.error('更新角色异常', error)
    ctx.body = { status: 1, msg: '更新角色异常, 请重新尝试' }
  }
}

// 删除角色
async function DeleteRole(ctx) {
  try {
    const { roleId } = ctx.request.body
    await RoleModel.deleteOne({ _id: roleId })
    ctx.body = { status: 0 }    
  } catch (error) {
    console.log('删除角色失败', error)
    ctx.body = { status: 1, msg: '删除角色异常' }
  }
}

module.exports = {
  AddRole,
  GetRoleList,
  UpdateRole,
  DeleteRole
}