var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "ap-southeast-1"
});

var comprehend = new AWS.Comprehend();

module.exports = {
    getSentiment: function (text) {
        return new Promise((resolve, reject) => {
            var params = {
                LanguageCode: 'en', /* required */
                Text: text /* required */
            };

            console.log(params)

            comprehend.detectSentiment(params, function (err, data) {
                if (err) reject(err); // an error occurred
                else resolve(data);           // successful response
            });
        });
    }
}