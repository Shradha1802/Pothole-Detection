export function getSeverity(depthCm) {
  if (depthCm <= 5) return "Minor";
  if (depthCm <= 10) return "Moderate";
  return "Severe";
}

export const severityColor = {
  Minor: "#e8c547",
  Moderate: "#f97316",
  Severe: "#f4574f",
};

export function accelMagnitude(x, y, z) {
  return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
}