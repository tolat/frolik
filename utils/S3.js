const {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
});

module.exports.uploadToS3 = async (Bucket, Key, Body) => {
  // Put an object into an Amazon S3 bucket.
  return await s3Client.send(
    new PutObjectCommand({
      Bucket,
      Key,
      Body,
    })
  );
};

module.exports.downloadFromS3 = async (Bucket, Key) => {
  // Read the object.
  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket,
      Key,
    })
  );

  return Body;
};

module.exports.getSignedURLFromS3 = async (Bucket, Key) => {
  // Read the object.
  const command = new GetObjectCommand({
    Bucket,
    Key,
  });

  const signedURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return signedURL;
};

module.exports.deleteFromS3 = async (Bucket, Key) => {
  // Read the object.
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket,
      Key,
    })
  );
};
