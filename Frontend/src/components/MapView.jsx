import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getSeverity } from "../utils/severity";

if (import.meta.hot) {
  import.meta.hot.decline();
}

import { MAPBOX_TOKEN } from "../environment";
mapboxgl.accessToken = MAPBOX_TOKEN;

const SOURCE_ID = "pothole-events";
const LAYER_ID = "pothole-events-pins";

const PIN_COLORS = {
  Minor: "#e8c547",
  Moderate: "#f97316",
  Severe: "#f4574f",
};

// Generates a teardrop pin icon as a data URL for a given hex color
function pinSVG(color) {
  const svg = `
    <svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C9 0 0 9 0 20c0 14 20 32 20 32s20-18 20-32C40 9 31 0 20 0z" fill="${color}" stroke="#0b0f16" stroke-width="2"/>
      <circle cx="20" cy="19" r="7" fill="#0b0f16"/>
    </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function loadPinImage(map, name, color) {
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

function toGeoJSON(events) {
  return {
    type: "FeatureCollection",
    features: events.map((event) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [event.longitude, event.latitude],
      },
      properties: {
        id: event._id,
        depthCm: event.depthCm,
        severity: getSeverity(event.depthCm),
        x: event.x,
        y: event.y,
        z: event.z,
        time: event.time,
      },
    })),
  };
}

export default function MapView({ events }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const styleLoadedRef = useRef(false);
  const hasFitBounds = useRef(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setMapError(
        "VITE_MAPBOX_TOKEN is missing. Add it to your .env file and restart the dev server.",
      );
      return;
    }
    if (mapRef.current || !containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [80.185, 12.905],
      zoom: 10,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", async () => {
      map.resize();

      try {
        await Promise.all(
          Object.entries(PIN_COLORS).map(([severity, color]) =>
            loadPinImage(map, `pin-${severity}`, color),
          ),
        );
      } catch (err) {
        console.error("Failed to load pin icons:", err);
      }

      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: LAYER_ID,
        type: "symbol",
        source: SOURCE_ID,
        layout: {
          "icon-image": ["concat", "pin-", ["get", "severity"]],
          "icon-size": 0.6,
          "icon-anchor": "bottom",
          "icon-allow-overlap": true,
        },
      });

      const popup = new mapboxgl.Popup({ offset: 24, closeButton: false });
      map.on("click", LAYER_ID, (e) => {
        const props = e.features[0].properties;
        popup
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div style="font-family: monospace; font-size: 12px; color: #0b0f16;">
              <strong>${props.severity}</strong><br/>
              Depth: ${props.depthCm} cm<br/>
              X: ${props.x} &nbsp; Y: ${props.y} &nbsp; Z: ${props.z}<br/>
              ${new Date(props.time).toLocaleString()}
            </div>
          `,
          )
          .addTo(map);
      });
      map.on(
        "mouseenter",
        LAYER_ID,
        () => (map.getCanvas().style.cursor = "pointer"),
      );
      map.on("mouseleave", LAYER_ID, () => (map.getCanvas().style.cursor = ""));

      styleLoadedRef.current = true;
      mapRef.current._pendingUpdate?.();
    });

    map.on("error", (e) => {
      console.error("Mapbox error:", e?.error);
      setMapError(
        e?.error?.message || "Map failed to load. Check your Mapbox token.",
      );
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      styleLoadedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !events || events.length === 0) return;

    const geojson = toGeoJSON(events);

    const applyUpdate = () => {
      const source = mapRef.current.getSource(SOURCE_ID);
      if (!source) return;
      source.setData(geojson);

      if (!hasFitBounds.current) {
        const bounds = new mapboxgl.LngLatBounds();
        geojson.features.forEach((f) => bounds.extend(f.geometry.coordinates));
        if (!bounds.isEmpty()) {
          mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 14 });
          hasFitBounds.current = true;
        }
      }
    };

    if (styleLoadedRef.current) {
      applyUpdate();
    } else {
      mapRef.current._pendingUpdate = applyUpdate;
    }
  }, [events]);

  if (mapError) {
    return (
      <div
        style={{
          width: "100%",
          height: 420,
          borderRadius: 10,
          border: "1px solid #5c2323",
          background: "#2a1414",
          color: "#f4574f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
          fontSize: 13,
        }}
      >
        {mapError}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: 420,
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid #1e2836",
      }}
    />
  );
}
