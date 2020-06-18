const menuList = [
  {
    title: '首页', // 菜单标题名称
    key: '/admin/home', // 对应的path
    icon: 'home', // 图标名称
    isPublic: true, // 公开的
  },
  {
    title: '个人信息',
    key: '/admin/information',
    icon: 'information',
    children: [ // 子菜单列表
      {
        title: '我的账号',
        key: '/admin/information/account',
        icon: 'account'
      },
      {
        title: '我的简历',
        key: '/admin/information/resume',
        icon: 'resume'
      },
      {
        title: '我的认证',
        key: '/admin/information/certification',
        icon: 'certification'
      }
    ]
  },
  {
    title: '就业分析',
    key: '/admin/analysis',
    icon: 'analysis',
    children: [ // 子菜单列表
      {
        title: '平均工资',
        key: '/admin/analysis/average',
        icon: 'average'
      },
      {
        title: '职位数',
        key: '/admin/analysis/positions',
        icon: 'positions'
      },
      {
        title: '关系',
        key: '/admin/analysis/relationship',
        icon: 'relationship'
      },
    ]
  },

  {
    title: '用户管理',
    key: '/admin/user',
    icon: 'userset'
  },
  {
    title: '角色管理',
    key: '/admin/role',
    icon: 'role',
  },

  {
    title: '招聘管理',
    key: '/admin/recruitment',
    icon: 'recruitment',
    children: [
      {
        title: '查询招聘信息',
        key: '/admin/recruitment/search',
        icon: 'search'
      },
      {
        title: '发布招聘信息',
        key: '/admin/recruitment/publish',
        icon: 'publish'
      },
    ]
  },

  {
    title: '我的推荐',
    key: '/admin/recommend',
    icon: 'recommend',
  },
]

export default menuList