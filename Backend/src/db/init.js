require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});
const mongoose = require("mongoose");
const initData = require("./seed.js");
const PotholeEvent = require("../models/potholeEvent.model.js");

const MONGO_URI = process.env.MONGO_URI;
async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    await PotholeEvent.deleteMany({});
    await PotholeEvent.insertMany(initData.data);

    console.log(`${initData.data.length} sample events inserted`);

    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
}

main();
