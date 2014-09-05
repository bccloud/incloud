var redis = require("redis"),
        client = redis.createClient();

    // if you'd like to select database 3, instead of 0 (default), call
    // client.select(3, function() { /* ... */ });

    client.on("error", function (err) {
        console.log("Error " + err);
    });
    client.set("string key", "string val", redis.print);
    client.mset("hash", "hashtest 1", "test keys 2", {user:'wangjh',shop:{期限:[{'max':'6'},{'min':'3'}]}}, redis.print);
    client.mget("hash", function (err, replies) {
        console.log(replies);
    });