import { useAuth } from "../hook/useAuth";
import { usePolling } from "../utils/usePolling";
import { getResolvedLog } from "../api/event";
import { getSeverity, severityColor } from "../utils/severity";
import Navbar from "./Navbar";

export default function Profile() {
  const { user } = useAuth();
  const { data: resolvedLog, loading } = usePolling(getResolvedLog, 10000);

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
      <Navbar isLive={true} />

      <div style={{ padding: 24, maxWidth: 800 }}>
        <div
          style={{
            background: "#111826",
            border: "1px solid #1e2836",
            borderRadius: 10,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: 1,
              color: "#5b6b82",
              margin: "0 0 4px",
              textTransform: "uppercase",
            }}
          >
            Username
          </p>
          <p style={{ fontSize: 16, margin: "0 0 16px" }}>
            {user?.username || "—"}
          </p>

          <p
            style={{
              fontSize: 11,
              letterSpacing: 1,
              color: "#5b6b82",
              margin: "0 0 4px",
              textTransform: "uppercase",
            }}
          >
            Email
          </p>
          <p style={{ fontSize: 16, margin: 0 }}>{user?.email || "—"}</p>
        </div>

        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            color: "#5b6b82",
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          Potholes Resolved By You
        </p>

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
              borderCollapse: "collapse",
              fontSize: 13,
              fontFamily: "monospace",
            }}
          >
            <thead>
              <tr
                style={{ borderBottom: "1px solid #1e2836", color: "#5b6b82" }}
              >
                <th
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontWeight: 400,
                  }}
                >
                  Resolved At
                </th>
                <th
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontWeight: 400,
                  }}
                >
                  Depth
                </th>
                <th
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontWeight: 400,
                  }}
                >
                  Severity
                </th>
                <th
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontWeight: 400,
                  }}
                >
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} style={{ padding: 14, color: "#5b6b82" }}>
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && (!resolvedLog || resolvedLog.length === 0) && (
                <tr>
                  <td colSpan={4} style={{ padding: 14, color: "#5b6b82" }}>
                    No potholes resolved yet.
                  </td>
                </tr>
              )}
              {resolvedLog?.map((event) => {
                const severity = getSeverity(event.depthCm);
                return (
                  <tr
                    key={event._id}
                    style={{ borderBottom: "1px solid #1e2836" }}
                  >
                    <td style={{ padding: "10px 14px" }}>
                      {new Date(event.resolvedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "10px 14px" }}>{event.depthCm} cm</td>
                    <td
                      style={{
                        padding: "10px 14px",
                        color: severityColor[severity],
                      }}
                    >
                      {severity}
                    </td>
                    <td style={{ padding: "10px 14px", color: "#8393a8" }}>
                      {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
