// Require the demo configuration. This contains settings for this demo, including
// the AWS credentials and target queue settings.

// Require libraries.
var aws = require("aws-sdk");
var Q = require("q");
var chalk = require("chalk");

const analysisService = require('../service/analysis.service');

var Json = {
    "accessKeyId": process.env.AWS_ACCESS_KEY,
    "secretAccessKey": process.env.AWS_SECRET_KEY,
    "region": process.env.AWS_REGION,
    "queueUrl": process.env.AWS_QUEUEURL
}

aws.config.update(Json)
// Create an instance of our SQS Client.
var sqs = new aws.SQS({
    params: {
        QueueUrl: process.env.AWS_QUEUEURL
    }
});

// Proxy the appropriate SQS methods to ensure that they "unwrap" the common node.js
// error / callback pattern and return Promises. Promises are good and make it easier to
// handle sequential asynchronous data.
var receiveMessage = Q.nbind(sqs.receiveMessage, sqs);
var deleteMessage = Q.nbind(sqs.deleteMessage, sqs);

// ---------------------------------------------------------- //
// ---------------------------------------------------------- //

// When pulling messages from Amazon SQS, we can open up a long-poll which will hold open
// until a message is available, for up to 20-seconds. If no message is returned in that
// time period, the request will end "successfully", but without any Messages. At that
// time, we'll want to re-open the long-poll request to listen for more messages. To
// kick off this cycle, we can create a self-executing function that starts to invoke
// itself, recursively.
(function pollQueueForMessages() {

    //console.log( chalk.yellow( "Starting long-poll operation." ) );

    // Pull a message - we're going to keep the long-polling timeout short so as to
    // keep the demo a little bit more interesting.
    receiveMessage({
        WaitTimeSeconds: 3, // Enable long-polling (3-seconds).
        VisibilityTimeout: 10
    })
        .then(
            function handleMessageResolve(data) {

                // If there are no message, throw an error so that we can bypass the
                // subsequent resolution handler that is expecting to have a message
                // delete confirmation.
                if (!data.Messages) {
                    //
                    // throw(
                    //   workflowError(
                    //     "EmptyQueue",
                    //     new Error( "" )
                    //   )
                    // );
                    return null

                } else {
                    console.log(data.Messages)

                    if (data.Messages && data.Messages.length > 0) {
                        for (var i = 0; i < data.Messages.length; i++) {
                            var msg = data.Messages[i]
                            var payload = JSON.parse(msg.Body)

                            if (payload.type == "START") {
                                console.log(payload);
                                const jobId = payload.jobId;

                                analysisService.getJob(jobId);
                            }
                        }
                    }
                    // ---
                    // TODO: Actually process the message in some way :P
                    // ---
                    console.log(chalk.green("Deleting:", data.Messages[0].MessageId));

                    // Now that we've processed the message, we need to tell SQS to delete the
                    // message. Right now, the message is still in the queue, but it is marked
                    // as "invisible". If we don't tell SQS to delete the message, SQS will
                    // "re-queue" the message when the "VisibilityTimeout" expires such that it
                    // can be handled by another receiver.
                    return (
                        deleteMessage({
                            ReceiptHandle: data.Messages[0].ReceiptHandle
                        })
                    );
                }

            }
        )
        .then(
            function handleDeleteResolve(data) {

                if (data) {
                    console.log(chalk.green("Message Deleted!"));
                }

            }
        )

        // Catch any error (or rejection) that took place during processing.
        .catch(
            function handleError(error) {

                // The error could have occurred for both known (ex, business logic) and
                // unknown reasons (ex, HTTP error, AWS error). As such, we can treat these
                // errors differently based on their type (since I'm setting a custom type
                // for my business logic errors).
                switch (error.type) {
                    case "EmptyQueue":
                        console.log(chalk.cyan("Expected Error:", error.message));
                        break;
                    default:
                        console.log(chalk.red("Unexpected Error:", error.message));
                        break;
                }

            }
        )

        // When the promise chain completes, either in success of in error, let's kick the
        // long-poll operation back up and look for moar messages.
        .finally(pollQueueForMessages);

})();

// When processing the SQS message, we will use errors to help control the flow of the
// resolution and rejection. We can then use the error "type" to determine how to
// process the error object.
function workflowError(type, error) {

    error.type = type;

    return (error);

}