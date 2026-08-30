// config/environment.js
// Single source of truth for environment-dependent values. Every component/
// api file should import from here instead of reading import.meta.env or
// hardcoding localhost URLs directly — this is the only file that needs to
// change when you move between local dev and production.

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.warn("VITE_MAPBOX_TOKEN is not set — maps will fail to load.");
}
