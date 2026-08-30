// init/seedOfficial.js
// Manually creates a government-official account. Run this yourself whenever
// a new official needs access — there is NO public signup for this system.
//
// Usage: npx dotenvx run -- node init/seedOfficial.js
require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model.js");

const MONGO_URI = process.env.MONGO_URI;

// Edit these before running, then optionally delete/blank them out after.
const NEW_OFFICIAL = {
  username: "sc",
  email: "sc@gov.in",
  password: "sc",// plaintext here only — gets hashed below, never stored as-is
};

async function main() {
  try {
    // if (!MONGO_URL) throw new Error("MONGO_URL is undefined — check .env");

    await mongoose.connect(
      MONGO_URI,
    );
    console.log("Connected to DB");

    const existing = await userModel.findOne({
      $or: [{ username: NEW_OFFICIAL.username }, { email: NEW_OFFICIAL.email }],
    });

    if (existing) {
      console.log("An account with this username/email already exists — skipping.");
      return;
    }

    const hash = await bcrypt.hash(NEW_OFFICIAL.password, 10);

    const official = await userModel.create({
      username: NEW_OFFICIAL.username,
      email: NEW_OFFICIAL.email,
      password: hash,
    });

    console.log("Official account created:", {
      id: official._id,
      username: official.username,
      email: official.email,
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

main();