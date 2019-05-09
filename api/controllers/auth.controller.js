
const Promise = require('bluebird');
const authService = require('../service/auth.service');

const authController = {
    create: function (req, res, next) {
        authService.createUser(req.body).then(response => {
            res.send(response);
        }).catch(e => {
            res.send(e);
        })
    },

    get: function (req, res, next) {
        res.send("get detail")
    },

    patch: function (req, res, next) {

    },

    delete: function (req, res, next) {

    },

    register: function (req, res, next) {
        authService.createUser(req.body).then(response => {
            console.log(response);
            res.send(response);
        }).catch(e => {
            res.send(e);
        })
    },

    login: function (req, res, next) {
        authService.loginUser(req.body).then(response => {
            res.send(response);
        }).catch(e => {
            res.send(e);
        })
    },

    facebookLogin: function (req, res, next) {
        authService.facebookLogin(req.body).then(response => {
            res.send(response);
        }).catch(e => {
            res.send(e);
        });
    }
}

module.exports = authController;