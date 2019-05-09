const Promise = require('bluebird');
const jobService = require('../service/jobs.service');
const queueService = require('../service/queue.service');

const jobsController = {
    create: function (req, res, next) {
        jobService.createJob(req.body).then(response => {
            res.send(response);
        }).catch(e => {
            res.send(e);
        })
    },

    get: function (req, res, next) {
        jobService.getJobs(req.query).then(response => {
            res.send(response);
        }).catch(e => {
            res.send(e);
        })
    },

    patch: function (req, res, next) {
        const jobId = req.params.jobId
        var payload;
        if ('socialMedia' in req.body) {
            payload = {
                $push: {
                    socialMedia: req.body.socialMedia
                }
            };
        } else {
            payload = req.body;
        }

        jobService.patch(jobId, payload).then(response => {
            res.send(response);
        }).catch(e => {
            res.send(e);
        })
    },

    delete: function (req, res, next) {
        jobService.deleteData({
            jobId: req.params.jobId
        }).then(response => {
            res.send(response);
        }).catch(e => {
            res.send(e);
        })
    },

    startAnalytics: function (req, res, next) {
        const payload = req.body;
        payload.type = "START"
        queueService.sendMsg(JSON.stringify(payload)).then(response => {
            res.send(response);
        }).catch(e => {
            res.send(e);
        })
    },
}

module.exports = jobsController;