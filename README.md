# 就业分析与推荐系统
## 起步
1. 开通阿里云短信服务，邮箱服务，科大讯飞关键词服务
2. 安装依赖
3. 进入client和server，npm start运行项目
## 技术栈
1. 前端：react + redux + antd + echarts + html2canvas + jspdf + jsonp + axios + less
2. 后端：koa + mongoose + multer + request + cheerio + node-schedule + nodemailer
## 实现功能
1. 登录（账号密码/手机号登录）、注册
2. 用户
- 管理员：用户管理，角色创建与权限分配
- 求职者：账号设置，简历管理（创建、修改、查看、下载），就业分析（平均工资、职位数、工作/学历与薪资关系），查询招聘职位，职位推荐（根据求职者喜好）
- 用人单位：账号设置，公司认证，就业分析，查询或发布招聘信息，简历推荐（根据用人单位发布招聘职位）
3. 后台功能
- 使用nodejs的`child_process`开启`多进程`爬取，使用代理IP进行爬取，爬取网站为拉钩招聘。
- 使用`阿里云短信服务`/`nodemailer`实现验证码功能
- 使用`科大讯飞关键词服务`实现用户关键词提取