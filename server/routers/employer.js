const router = require('koa-router')()
const employerServer = require('../controllers/employer')

router.get('/getCertification', employerServer.GetCertification)
router.post('/addCertification', employerServer.AddCertification)

module.exports = router