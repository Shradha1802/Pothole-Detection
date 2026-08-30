import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getPublicEventData, getPublicSummary } from "../api/event";
import { usePolling } from "../utils/usePolling";
import { loadAllPins } from "../utils/mapPins";
import Navbar from "./Navbar";

if (import.meta.hot) {
  import.meta.hot.decline();
}

import { MAPBOX_TOKEN } from "../environment";
mapboxgl.accessToken = MAPBOX_TOKEN;

const SOURCE_ID = "public-pothole-events";
const LAYER_ID = "public-pothole-events-pins";

function toGeoJSON(events) {
  return {
    type: "FeatureCollection",
    features: events.map((event) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [event.longitude, event.latitude],
      },
      properties: { severity: event.severity },
    })),
  };
}

export default function PublicMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const styleLoadedRef = useRef(null);
  const hasFitBounds = useRef(false);
  const [mapError, setMapError] = useState(null);

  const {
    data: events,
    loading,
    error: fetchError,
  } = usePolling(getPublicEventData, 8000);
  const { data: summary } = usePolling(getPublicSummary, 10000);

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
        await loadAllPins(map);
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
        const { severity } = e.features[0].properties;
        popup
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div style="font-family: monospace; font-size: 12px; color: #0b0f16;">
              <strong>${severity} pothole reported</strong>
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

  return (
    <div
      style={{
        background: "#0b0f16",
        minHeight: "100vh",
        width: "100%",
        color: "#e6edf5",
        fontFamily: "sans-serif",
      }}
    >
      <Navbar mode="public" isLive={!fetchError} />

      <div style={{ padding: 24 }}>
        {/* Total detected vs resolved — counts only, no severity breakdown, shown on the page (not the navbar) */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div
            style={{
              background: "#111826",
              border: "1px solid #1e2836",
              borderRadius: 10,
              padding: "14px 20px",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: 1,
                color: "#5b6b82",
                margin: "0 0 6px",
                textTransform: "uppercase",
              }}
            >
              Total Detected
            </p>
            <p
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: "#22d3ee",
                margin: 0,
                fontFamily: "monospace",
              }}
            >
              {summary?.totalDetected ?? "—"}
            </p>
          </div>
          <div
            style={{
              background: "#111826",
              border: "1px solid #1e2836",
              borderRadius: 10,
              padding: "14px 20px",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: 1,
                color: "#5b6b82",
                margin: "0 0 6px",
                textTransform: "uppercase",
              }}
            >
              Total Resolved
            </p>
            <p
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: "#4ade80",
                margin: 0,
                fontFamily: "monospace",
              }}
            >
              {summary?.totalResolved ?? "—"}
            </p>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#8393a8", marginBottom: 16 }}>
          {loading
            ? "Loading reported potholes…"
            : `${events?.length ?? 0} unresolved potholes shown on the map.`}
        </p>

        {mapError ? (
          <div
            style={{
              width: "100%",
              height: 480,
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
        ) : (
          <div
            ref={containerRef}
            style={{
              width: "100%",
              height: 480,
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid #1e2836",
            }}
          />
        )}

        <p style={{ fontSize: 12, color: "#5b6b82", marginTop: 16 }}>
          Government officials can{" "}
          <a href="/login" style={{ color: "#22d3ee" }}>
            log in
          </a>{" "}
          for detailed sensor data and repair tracking.
        </p>
      </div>
    </div>
  );
}
