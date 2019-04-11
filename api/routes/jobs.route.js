const express = require('express');
const jobsController = require('../controllers/jobs.controller')

const router = express.Router();

router.route('/').post(jobsController.create);

module.exports = router;