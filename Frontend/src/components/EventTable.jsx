import { useState } from "react";
import { getSeverity, severityColor } from "../utils/severity";
import { resolveEvent } from "../api/event";

const COLS = [
  { key: "time", label: "Time", width: "18%" },
  { key: "depth", label: "Depth", width: "12%" },
  { key: "severity", label: "Severity", width: "13%" },
  { key: "location", label: "Location", width: "37%" },
  { key: "action", label: "", width: "20%" },
];

const cellStyle = { padding: "10px 14px", textAlign: "left" };

export default function EventTable({ events, onResolved }) {
  const [resolvingId, setResolvingId] = useState(null);
  const recent = [...(events || [])]
    .filter((e) => !e.resolved)
    .sort((a, b) => b.time - a.time)
    .slice(0, 10);

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      await resolveEvent(id);
      onResolved?.(id); // tells Dashboard to refetch events + stats immediately
    } catch (err) {
      console.error("Failed to resolve event:", err);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #1e2836",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <table
        style={{
          width: "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse",
          fontSize: 13,
          fontFamily: "monospace",
        }}
      >
        <colgroup>
          {COLS.map((col) => (
            <col key={col.key} style={{ width: col.width }} />
          ))}
        </colgroup>
        <thead>
          <tr style={{ borderBottom: "1px solid #1e2836", color: "#5b6b82" }}>
            {COLS.map((col) => (
              <th key={col.key} style={{ ...cellStyle, fontWeight: 400 }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recent.length === 0 && (
            <tr>
              <td colSpan={5} style={{ ...cellStyle, color: "#5b6b82" }}>
                No unresolved events.
              </td>
            </tr>
          )}
          {recent.map((event) => {
            const severity = getSeverity(event.depthCm);
            return (
              <tr
                key={event._id}
                style={{ borderBottom: "1px solid #1e2836", color: "#e6edf5" }}
              >
                <td style={cellStyle}>
                  {new Date(event.time).toLocaleTimeString()}
                </td>
                <td style={cellStyle}>{event.depthCm} cm</td>
                <td style={{ ...cellStyle, color: severityColor[severity] }}>
                  {severity}
                </td>
                <td style={{ ...cellStyle, color: "#8393a8" }}>
                  {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                </td>
                <td style={cellStyle}>
                  <button
                    onClick={() => handleResolve(event._id)}
                    disabled={resolvingId === event._id}
                    style={{
                      background: "transparent",
                      border: "1px solid #4ade80",
                      color: "#4ade80",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 12,
                      cursor: resolvingId === event._id ? "wait" : "pointer",
                      opacity: resolvingId === event._id ? 0.6 : 1,
                    }}
                  >
                    {resolvingId === event._id ? "Resolving…" : "Mark Resolved"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
