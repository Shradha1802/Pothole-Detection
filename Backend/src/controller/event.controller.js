// controllers/events.controller.js
const PotholeEvent = require("../models/potholeEvent.model.js");

function getSeverity(depthCm) {
  if (depthCm <= 5) return "Minor";
  if (depthCm <= 10) return "Moderate";
  return "Severe";
}

/**
 * @name getPublicEventsController
 * @description Returns only latitude, longitude, and computed severity —
 * never exact depthCm, x/y/z, or timestamp. No auth required.
 * @access Public
 */
async function getPublicEventsController(req, res) {
  try {
    const events = await PotholeEvent.find(
      { resolved: { $ne: true } },
      "latitude longitude depthCm",
    );
    const restricted = events.map((e) => ({
      latitude: e.latitude,
      longitude: e.longitude,
      severity: getSeverity(e.depthCm),
    }));
    res.status(200).json(restricted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch public events" });
  }
}

/**
 * @name getAllEventsController
 * @description Returns full event documents, including resolved ones, for
 * the official dashboard.
 * @access Private (requires authMiddleware.authUser)
 */
async function getAllEventsController(req, res) {
  try {
    const events = await PotholeEvent.find({}).sort({ time: -1 });
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
}

/**
 * @name getStatsController
 * @description Total + severity breakdown, counted from unresolved events.
 * @access Public
 */
async function getStatsController(req, res) {
  try {
    const events = await PotholeEvent.find(
      { resolved: { $ne: true } },
      "depthCm",
    );
    const counts = { Minor: 0, Moderate: 0, Severe: 0 };
    events.forEach((e) => counts[getSeverity(e.depthCm)]++);
    res.status(200).json({ total: events.length, ...counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
}

/**
 * @name createEventController
 * @description Called by ESP32 when Conditions A + B + C are all satisfied.
 * @access Public (trusted device, not a public user action)
 */
async function createEventController(req, res) {
  try {
    const { latitude, longitude, x, y, z, depthCm } = req.body;

    if (
      latitude === undefined ||
      longitude === undefined ||
      x === undefined ||
      y === undefined ||
      z === undefined ||
      depthCm === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (depthCm < 0 || depthCm > 50) {
      return res.status(400).json({ message: "Implausible depth value" });
    }

    const newEvent = await PotholeEvent.create({
      latitude,
      longitude,
      x,
      y,
      z,
      depthCm,
      time: Date.now(),
    });
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save event" });
  }
}

/**
 * @name resolveEventController
 * @description Marks a pothole as repaired. Soft-delete only — the document
 * stays, tagged with who resolved it and when, for audit purposes.
 * @access Private (requires authMiddleware.authUser)
 */
async function resolveEventController(req, res) {
  try {
    const { id } = req.params;

    const event = await PotholeEvent.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.resolved = true;
    event.resolvedBy = req.user?.username || req.user?.id || "unknown";
    event.resolvedAt = Date.now();
    await event.save();

    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to resolve event" });
  }
}

/**
 * @name getPublicSummaryController
 * @description Total detected vs total resolved counts only — no severity
 * breakdown, matching the decision to keep that breakdown official-only.
 * @access Public
 */
async function getPublicSummaryController(req, res) {
  try {
    const totalDetected = await PotholeEvent.countDocuments({});
    const totalResolved = await PotholeEvent.countDocuments({ resolved: true });
    res.status(200).json({ totalDetected, totalResolved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
}

/**
 * @name getResolvedLogController
 * @description Events resolved BY the currently logged-in official —
 * used for their Profile page's activity log.
 * @access Private (requires authMiddleware.authUser)
 */
async function getResolvedLogController(req, res) {
  try {
    const username = req.user?.username;
    if (!username) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const resolvedEvents = await PotholeEvent.find({
      resolved: true,
      resolvedBy: username,
    }).sort({ resolvedAt: -1 });

    res.status(200).json(resolvedEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch resolved log" });
  }
}

module.exports = {
  getPublicEventsController,
  getAllEventsController,
  getStatsController,
  createEventController,
  resolveEventController,
  getPublicSummaryController,
  getResolvedLogController,
};
