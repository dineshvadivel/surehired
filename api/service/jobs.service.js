const Promise = require('bluebird');
const request = require('request');
const mongoose = require('mongoose');
const UserJob = mongoose.model('UserJob');

module.exports.createJob = function (data) {
    return new Promise((resolve, reject) => {
        var userJob = new UserJob(data);
        userJob.save().then(res => {
            console.log(res);
            resolve(res)
        }).catch(e => {
            reject(e)
        });
    });
}

module.exports.patch = function (jobId, data) {
    return new Promise(function (resolve, reject) {
        var query = { 'jobId': jobId };
        UserJob.updateDoc(query, data).then(updateResponse => {
            resolve(updateResponse)
        }).catch(e => {
            reject(e)
        })
    })
}

module.exports.get = function (query) {
    return new Promise((resolve, reject) => {
        UserJob.list(query).then(res => {
            console.log(res);
            resolve(res)
        }).catch(e => {
            reject(e)
        });
    });
}

module.exports.getJobs = function (query) {
    return new Promise((resolve, reject) => {
        UserJob.list(query).then(res => {
            console.log(res);
            resolve(res)
        }).catch(e => {
            reject(e)
        });
    });
}

module.exports.deleteData = function (query, data) {
    return new Promise(function (resolve, reject) {
        UserJob.remove(query).then(response => {
            resolve(response)
        }).catch(e => {
            reject(e)
        })
    })
}