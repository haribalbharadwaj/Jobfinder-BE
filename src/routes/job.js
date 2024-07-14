const express = require('express')
const router = express.Router()
const validateJob =require('../middleware/validateJob')
const verifyToken = require('../middleware/verifyToken')

const{
    getJobs,
    addJobs,
    editJobs,
    getFilteredJobs,
    deleteJob,
    allJobs
    }= require('../controller/job')

router.get('/',verifyToken,getFilteredJobs)

router.get('/jobs',allJobs)

router.get('/jobs/:id',getJobs)

router.post('/addjob',verifyToken,validateJob,addJobs)

router.put('/updateJob/:id',verifyToken,validateJob,editJobs)

router.delete('/delete/:id',verifyToken,deleteJob)

module.exports = router;