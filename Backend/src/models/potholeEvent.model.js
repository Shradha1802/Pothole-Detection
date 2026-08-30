// models/potholeEvent.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const potholeEventSchema = new Schema({
  depthCm: Number,
  latitude: Number,
  longitude: Number,
  x: Number,
  y: Number,
  z: Number,
  time: Number, // epoch ms

  // Resolution tracking — soft-delete, not a hard DELETE, so there's always
  // an audit trail of who marked a pothole repaired and when.
  resolved: { type: Boolean, default: false },
  resolvedBy: String,  // official's username
  resolvedAt: Number,  // epoch ms
});

const PotholeEvent = mongoose.model("PotholeEvent", potholeEventSchema);

module.exports = PotholeEvent;