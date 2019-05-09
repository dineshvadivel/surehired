
const Promise = require('bluebird');
const analysisService = require('../service/analysis.service');
const jobsService = require('../service/jobs.service');

const analysisController = {
    processJob: function (req, res, next) {
        const jobId = req.params.jobId;

        jobsService.get({
            jobId
        }).then(result => {
            return analysisService.analysis(result)
        }).then(response => {
            res.send(response);
        }).catch(e => {
            res.send(e);
        });
    }
}

module.exports = analysisController;