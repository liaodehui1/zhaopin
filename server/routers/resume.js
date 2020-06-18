const router = require('koa-router')()
const resumeServer = require('../controllers/resume')

router.post('/addResume', resumeServer.AddResume)
router.post('/updateResume', resumeServer.UpdateResume)
router.get('/getResumeList', resumeServer.GetResumeList)
router.delete('/deleteResume', resumeServer.DeleteResume)
router.get('/getRecommendResume', resumeServer.GetRecommendResume)

module.exports = router