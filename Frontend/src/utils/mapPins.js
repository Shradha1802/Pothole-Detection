// Shared pin-icon generation, used by both the official MapView and PublicMap
// so the two don't duplicate the same SVG/image-loading logic.

export const PIN_COLORS = {
  Minor: "#e8c547",
  Moderate: "#f97316",
  Severe: "#f4574f",
};

export function pinSVG(color) {
  const svg = `
    <svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C9 0 0 9 0 20c0 14 20 32 20 32s20-18 20-32C40 9 31 0 20 0z" fill="${color}" stroke="#0b0f16" stroke-width="2"/>
      <circle cx="20" cy="19" r="7" fill="#0b0f16"/>
    </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function loadPinImage(map, name, color) {
  return new Promise((resolve, reject) => {
    const img = new Image(40, 52);
    img.onload = () => {
      if (!map.hasImage(name)) map.addImage(name, img);
      resolve();
    };
    img.onerror = reject;
    img.src = pinSVG(color);
  });
}

export function loadAllPins(map) {
  return Promise.all(
    Object.entries(PIN_COLORS).map(([severity, color]) => loadPinImage(map, `pin-${severity}`, color))
  );
}