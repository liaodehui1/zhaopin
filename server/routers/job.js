const router = require('koa-router')()
const jobServer = require('../controllers/job')

router.get('/getJobs', jobServer.GetJobs)
router.post('/addPublishJob', jobServer.AddPublishJob)
router.get('/getSearchJobs', jobServer.GetSearchJobs)
router.get('/getJobById', jobServer.GetJobById)
router.get('/getViewedJobs', jobServer.GetViewedJobs)
router.get('/getAverage', jobServer.GetAverage)
router.get('/getRelationship', jobServer.GetRelationship)
router.get('/getPositions', jobServer.GetPositions)
router.get('/getRecommendJobs', jobServer.GetRecommendJobs)
router.get('/getPublishJobs', jobServer.GetPublishJobs)
router.delete('/deleteJob', jobServer.DeleteJob)

module.exports = router