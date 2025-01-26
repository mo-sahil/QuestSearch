const { MongoClient } = require("mongodb");
const config = require("./config");

let clientDB;

async function connectDB() {
  try {
    clientDB = new MongoClient(config.mongoURI);
    await clientDB.connect();
    console.log("Connected to MongoDB Atlas successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err.message);
    process.exit(1);
  }
}

function getDB() {
  return clientDB.db();
}

module.exports = { connectDB, getDB };
