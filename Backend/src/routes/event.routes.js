// routes/events.route.js
const express = require("express");
const eventsRoute = express.Router();
const EventsController = require("../controller/event.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

/**
 * @route GET /api/events/public
 * @description Severity-only, unresolved events — for the public map
 * @access Public
 */
eventsRoute.get("/public", EventsController.getPublicEventsController);

/**
 * @route GET /api/events/stats
 * @description Total + severity breakdown — official dashboard only.
 * Public users only ever see a total count, derived client-side from the
 * /public endpoint's array length — never this breakdown.
 * @access Private
 */
eventsRoute.get(
  "/stats",
  authMiddleware.authUser,
  EventsController.getStatsController,
);

/**
 * @route GET /api/events
 * @description Full event data including resolved ones — official dashboard only
 * @access Private
 */
eventsRoute.get(
  "/",
  authMiddleware.authUser,
  EventsController.getAllEventsController,
);

/**
 * @route POST /api/events
 * @description Called by ESP32 when a pothole is confirmed
 * @access Public (trusted device)
 */
eventsRoute.post("/", EventsController.createEventController);

/**
 * @route PATCH /api/events/:id/resolve
 * @description Marks a pothole as repaired
 * @access Private
 */
eventsRoute.patch(
  "/:id/resolve",
  authMiddleware.authUser,
  EventsController.resolveEventController,
);

/**
 * @route GET /api/events/public/summary
 * @description Total detected vs total resolved counts, no breakdown
 * @access Public
 */
eventsRoute.get("/public/summary", EventsController.getPublicSummaryController);

/**
 * @route GET /api/events/resolved-log
 * @description Events resolved by the currently logged-in official
 * @access Private
 */
eventsRoute.get(
  "/resolved-log",
  authMiddleware.authUser,
  EventsController.getResolvedLogController,
);

module.exports = eventsRoute;
