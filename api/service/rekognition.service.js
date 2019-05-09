var AWS = require('aws-sdk');
const image2base64 = require('image-to-base64');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "us-east-1"
});

var rekognition = new AWS.Rekognition();

module.exports = {
    getFacialAnalysis: function (userId, key) {
        console.log(key);
        return new Promise((resolve, reject) => {
            var params = {
                Image: {
                    S3Object: {
                        Bucket: "sure-hired",
                        Name: key
                    }
                },
                Attributes: [
                    'ALL',
                ]
            };
            rekognition.detectFaces(params, function (err, data) {
                if (err) reject(err);
                else {
                    console.log(data);
                    resolve(data);
                }
            })
        });
    }
}