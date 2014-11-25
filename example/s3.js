var AWS = require('aws-sdk');
AWS.config={
    accessKeyId: "F-A-GL21Y4UIQLUYGEFY",
    secretAccessKey: "***********==",
	httpOptions:{proxy:'http://cs1-bj.incloud.org.cn:80'}
}
var s3 = new AWS.S3();
s3.listBuckets(function(err, data) {
  for (var index in data.Buckets) {
    var bucket = data.Buckets[index];
    console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
  }
});