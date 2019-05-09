const express = require('express');
const analysisController = require('../controllers/analysis.controller');

const router = express.Router();

router.route('/job/:jobId').get(analysisController.processJob);
// router.route('/sentiment').post(comprehendController.getSentiment);
// router.route('/facial').post(rekognitionController.getFacialAnalysis);

module.exports = router;