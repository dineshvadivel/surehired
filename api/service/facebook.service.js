const graph = require('fbgraph');

module.exports = {
    getPosts: function (accessToken, userId) {
        console.log(accessToken);
        graph.setAccessToken(accessToken);

        return new Promise((resolve, reject) => {
            graph.get(userId + "?fields=id,name,posts", (err, response) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                // console.log(response);
                resolve(response);
            })
        });
    }
}