import { severityColor } from "../utils/severity";

const cardStyle = {
  background: "#111826",
  border: "1px solid #1e2836",
  borderRadius: 10,
  padding: "16px 20px",
  flex: 1,
};

const labelStyle = {
  fontSize: 11,
  letterSpacing: 1,
  color: "#5b6b82",
  margin: "0 0 8px",
  textTransform: "uppercase",
};

export default function StatsPanel({ stats }) {
  if (!stats) return null;

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
      <div style={cardStyle}>
        <p style={labelStyle}>Total Events</p>
        <p style={{ fontSize: 28, fontWeight: 600, color: "#22d3ee", margin: 0, fontFamily: "monospace" }}>
          {stats.total}
        </p>
      </div>
      {["Minor", "Moderate", "Severe"].map((level) => (
        <div key={level} style={cardStyle}>
          <p style={labelStyle}>{level}</p>
          <p style={{ fontSize: 28, fontWeight: 600, color: severityColor[level], margin: 0, fontFamily: "monospace" }}>
            {stats[level] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}