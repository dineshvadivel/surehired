const Promise = require('bluebird');
const request = require('request');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.createUser = function (data) {
    return new Promise((resolve, reject) => {
        var user = new User(data);
        user.save().then(res => {
            // console.log(res);
            resolve(res)
        }).catch(e => {
            reject(e)
        });
    });
}

module.exports.loginUser = function (data) {
    return new Promise((resolve, reject) => {
        User.list({ email: data.email })
            .then(res => {
                if (res.length > 0) {
                    if (res[0].password == data.password) {
                        resolve({ msg: "Success", name: res[0].firstName, userId: res[0].userId })
                    } else {
                        resolve({ msg: "Password mismatch" })
                    }
                } else {
                    resolve({ msg: "Email not found" })
                }
            }).catch(e => {
                reject(e)
            });
    });
}

module.exports.facebookLogin = function (data) {
    return new Promise((resolve, reject) => {
        // store in db
    });
}
