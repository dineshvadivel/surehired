const mongoose = require('mongoose');

const util = require('util');
const path = require('path');
const glob = require('glob');

// make bluebird default Promise
mongoose.Promise = require('bluebird');

let url = process.env.MONGODB_URI || process.env.DB_URL;
// connect to mongo db
mongoose.connect(url, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${url}`);
});

const models = glob.sync(path.join(__dirname, "./api/models/*.js"));

models.forEach(function (model) {
  require(model);
});

module.exports = mongoose;