const { MongoClient } = require("mongodb");

const _uri = process.env.MONGODB_URI;

const dbConnection = (collection, cb) => {
  MongoClient.connect(_uri)
    .then(async (client) => {
      const db = client.db("Final_Project").collection(collection);
      await cb(db);
      client.close();
    })
    .catch();
};

module.exports = dbConnection;
