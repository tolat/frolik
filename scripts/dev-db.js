// Local MongoDB for development — no install needed.
// Runs a real mongod (downloaded once by mongodb-memory-server) with data
// persisted in ./.dev-db so it survives restarts.  Usage: npm run db
const path = require("path");
const fs = require("fs");
const { MongoMemoryServer } = require("mongodb-memory-server");

(async () => {
  const dbPath = path.join(__dirname, "..", ".dev-db");
  fs.mkdirSync(dbPath, { recursive: true });
  const server = await MongoMemoryServer.create({
    instance: { port: 27017, dbPath, storageEngine: "wiredTiger" },
  });
  console.log(`MongoDB running at ${server.getUri()} (data in .dev-db)`);
  const stop = async () => {
    await server.stop({ doCleanup: false });
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
})();
