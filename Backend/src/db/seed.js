// data.js
// Sample PotholeGuard event data, spread across several distinct Chennai road
// stretches (not one single route) so points look like real varied detections
// across the city rather than one clustered line.

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function jitter(value, amount) {
  return value + (Math.random() - 0.5) * amount;
}

// Several real, distinct road stretches across Chennai, each with a few waypoints.
// Using multiple routes (not one) is what actually spreads the pins across the map.
const ROUTES = [
  // OMR - Thoraipakkam to Siruseri
  [
    { lat: 12.9410, lng: 80.1673 },
    { lat: 12.9190, lng: 80.1768 },
    { lat: 12.8950, lng: 80.1900 },
    { lat: 12.8770, lng: 80.2005 },
  ],
  // ECR - Neelankarai to Injambakkam
  [
    { lat: 12.9520, lng: 80.2540 },
    { lat: 12.9350, lng: 80.2490 },
    { lat: 12.9150, lng: 80.2430 },
    { lat: 12.8980, lng: 80.2390 },
  ],
  // GST Road - Guindy to Tambaram
  [
    { lat: 13.0100, lng: 80.2100 },
    { lat: 12.9850, lng: 80.1950 },
    { lat: 12.9600, lng: 80.1800 },
    { lat: 12.9250, lng: 80.1270 },
  ],
  // Anna Salai - Teynampet to Guindy
  [
    { lat: 13.0450, lng: 80.2500 },
    { lat: 13.0300, lng: 80.2400 },
    { lat: 13.0150, lng: 80.2280 },
    { lat: 13.0080, lng: 80.2150 },
  ],
  // Poonamallee High Road - Kilpauk to Poonamallee
  [
    { lat: 13.0820, lng: 80.2400 },
    { lat: 13.0700, lng: 80.2100 },
    { lat: 13.0550, lng: 80.1750 },
    { lat: 13.0400, lng: 80.1350 },
  ],
];

function pointAlongRoute(route, t) {
  const segCount = route.length - 1;
  const segFloat = t * segCount;
  const segIndex = Math.min(Math.floor(segFloat), segCount - 1);
  const segT = segFloat - segIndex;
  const p1 = route[segIndex];
  const p2 = route[segIndex + 1];
  return {
    lat: lerp(p1.lat, p2.lat, segT),
    lng: lerp(p1.lng, p2.lng, segT),
  };
}

function randomDepth() {
  const r = Math.random();
  if (r < 0.49) return +jitter(3.2, 3.0).toFixed(1);   // ~2-5cm (Minor)
  if (r < 0.83) return +jitter(7.3, 4.0).toFixed(1);   // ~5-10cm (Moderate)
  return +jitter(13.5, 6.0).toFixed(1);                // >10cm (Severe)
}

function accelForDepth(depthCm) {
  const targetMagnitude = 1.8 + depthCm * 0.09 + (Math.random() - 0.5) * 0.4;
  const extra = Math.max(0.1, targetMagnitude - 1.0);
  return {
    x: +jitter(extra * 0.4, extra * 0.3).toFixed(3),
    y: +jitter(extra * 0.4, extra * 0.3).toFixed(3),
    z: +jitter(1.0 + extra * 0.2, 0.15).toFixed(3),
  };
}

function randomTimeWithinLastDays(days) {
  const now = Date.now();
  return Math.round(now - Math.random() * days * 24 * 60 * 60 * 1000);
}

const NUM_EVENTS = 85;
const samplePotholeEvents = [];

for (let i = 0; i < NUM_EVENTS; i++) {
  // Pick a random route each time, so events distribute across all 5 roads
  // roughly evenly instead of all landing on one corridor.
  const route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
  const t = Math.random();
  const { lat, lng } = pointAlongRoute(route, t);
  const depthCm = Math.max(2.0, randomDepth());
  const { x, y, z } = accelForDepth(depthCm);

  samplePotholeEvents.push({
    depthCm,
    latitude: +jitter(lat, 0.003).toFixed(6),  // wider jitter (~150-200m) so points don't sit exactly on the line
    longitude: +jitter(lng, 0.003).toFixed(6),
    x,
    y,
    z,
    time: randomTimeWithinLastDays(14),
  });
}

samplePotholeEvents.sort((a, b) => a.time - b.time);

module.exports = { data: samplePotholeEvents };