const router = require('koa-router')()
const roleServer = require('../controllers/role')

router.post('/addRole', roleServer.AddRole)
router.get('/getRoleList', roleServer.GetRoleList)
router.post('/updateRole', roleServer.UpdateRole)
router.delete('/deleteRole', roleServer.DeleteRole)
module.exports = router