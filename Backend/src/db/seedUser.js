// init/seedOfficial.js
// Manually creates government-official accounts. Run this yourself whenever
// a new official needs access — there is NO public signup for this system.
//
// Usage: npx dotenvx run -- node init/seedOfficial.js

require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model.js");

const MONGO_URL = process.env.MONGO_URL;

// Add as many officials as you need here — each gets created if it doesn't
// already exist. Edit/extend this list before running.
const NEW_OFFICIALS = [
  {
    username: "chennai_official",
    email: "official@chennaicorp.gov.in",
    password: "chennai_official", // plaintext here only — gets hashed below, never stored as-is
  },
  {
    username: "test",
    email: "test@gmail.com",
    password: "test",
  },
];

async function seedOne(officialData) {
  const existing = await userModel.findOne({
    $or: [{ username: officialData.username }, { email: officialData.email }],
  });

  if (existing) {
    console.log(`Skipped — account already exists: ${officialData.username}`);
    return;
  }

  const hash = await bcrypt.hash(officialData.password, 10);

  const official = await userModel.create({
    username: officialData.username,
    email: officialData.email,
    password: hash,
  });

  console.log("Official account created:", {
    id: official._id,
    username: official.username,
    email: official.email,
  });
}

async function main() {
  try {
    if (!MONGO_URL) throw new Error("MONGO_URL is undefined — check .env");

    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    for (const officialData of NEW_OFFICIALS) {
      await seedOne(officialData);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

main();
