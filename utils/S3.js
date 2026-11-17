const fs = require("fs");
const path = require("path");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// ── Local storage fallback ───────────────────────────────────────────────────
// When STORAGE=local (or no real bucket is configured) images are written to
// ./local-storage and served by the /local-images route in server.js. This lets
// the app run end-to-end on a laptop with no AWS account.
const useLocal =
  process.env.STORAGE === "local" ||
  !process.env.AWS_BUCKET ||
  process.env.AWS_BUCKET === "your-s3-bucket-name";
const LOCAL_DIR = path.join(__dirname, "..", "local-storage");
const safeKey = (Key) => path.basename(String(Key));
if (useLocal) fs.mkdirSync(LOCAL_DIR, { recursive: true });
module.exports.useLocalStorage = useLocal;
module.exports.LOCAL_STORAGE_DIR = LOCAL_DIR;

const s3Client = useLocal
  ? null
  : new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
      maxAttempts: 3,
    });

module.exports.uploadToS3 = async (Bucket, Key, Body) => {
  if (useLocal) {
    await fs.promises.writeFile(path.join(LOCAL_DIR, safeKey(Key)), Body);
    return {};
  }
  return await s3Client.send(new PutObjectCommand({ Bucket, Key, Body }));
};

module.exports.downloadFromS3 = async (Bucket, Key) => {
  if (useLocal) {
    return fs.createReadStream(path.join(LOCAL_DIR, safeKey(Key)));
  }
  const { Body } = await s3Client.send(new GetObjectCommand({ Bucket, Key }));
  return Body;
};

module.exports.getSignedURLFromS3 = async (Bucket, Key) => {
  if (useLocal) {
    return `${process.env.SERVER || ""}/local-images/${encodeURIComponent(
      safeKey(Key)
    )}`;
  }
  const command = new GetObjectCommand({ Bucket, Key });
  return await getSignedUrl(s3Client, command, {
    expiresIn: process.env.SESSION_DURATION / 1000,
  });
};

module.exports.deleteFromS3 = async (Bucket, Key) => {
  if (useLocal) {
    await fs.promises.rm(path.join(LOCAL_DIR, safeKey(Key)), { force: true });
    return;
  }
  await s3Client.send(new DeleteObjectCommand({ Bucket, Key }));
};

module.exports.deleteAllFromS3 = async (Bucket) => {
  if (useLocal) {
    for (const f of await fs.promises.readdir(LOCAL_DIR)) {
      await fs.promises.rm(path.join(LOCAL_DIR, f), { force: true });
    }
    return;
  }
  try {
    const listObjectsResponse = await s3Client.send(
      new ListObjectsCommand({ Bucket })
    );

    if (!listObjectsResponse.Contents?.length) {
      console.log("Bucket is already empty.");
      return;
    }

    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket,
        Delete: {
          Objects: listObjectsResponse.Contents.map((obj) => ({ Key: obj.Key })),
        },
      })
    );
    console.log("All objects deleted successfully.");
  } catch (error) {
    console.error("Error deleting objects:", error);
  }
};
