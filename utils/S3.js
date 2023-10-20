var AWS = require("aws-sdk");

module.exports.uploadToBucket = async (bucketName, fileName, dataBuffer) => {
  AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccesskey: process.env.S3_SECRET_ACCESS_KEY,
    //region: process.env.S3_REGION, //"us-east-1"
  });

  const s3 = new AWS.S3();

  // Setting up S3 upload parameters
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: dataBuffer,
  };

  // Uploading files to the bucket
  return await s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    return data;
  });
};
