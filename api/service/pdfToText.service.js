const fs = require('fs');
const pdf = require('pdf-parse');
const Promise = require('bluebird');
const request = require('request');
const crawler = require('crawler-request');

module.exports.convertToText = function (url) {
    return new Promise((resolve, reject) => {
        crawler(url).then(res => {
            resolve(res);
        }).catch(e => {
            reject(e);
        });
    })
}