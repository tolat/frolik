const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  maxAttempts: 3,
  maxErrorRetry: 3,
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

  const signedURL = await getSignedUrl(s3Client, command, { expiresIn: 3600});

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

module.exports.deleteAllFromS3 = async (Bucket) => {
  try {
    const listObjectsResponse = await s3Client.send(
      new ListObjectsCommand({ Bucket })
    );

    if (listObjectsResponse.Contents.length === 0) {
      console.log("Bucket is already empty.");
      return;
    }

    const deleteObjectsCommand = new DeleteObjectsCommand({
      Bucket,
      Delete: {
        Objects: listObjectsResponse.Contents.map((obj) => ({ Key: obj.Key })),
      },
    });

    await s3Client.send(deleteObjectsCommand);
    console.log("All objects deleted successfully.");
  } catch (error) {
    console.error("Error deleting objects:", error);
  }
};
