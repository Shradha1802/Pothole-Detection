import { getEventData, getStats } from "../api/event";
import { usePolling } from "../utils/usePolling";
import Navbar from "./Navbar";
import StatsPanel from "./StatsPanel";
import MapView from "./MapView";
import EventTable from "./EventTable";

export default function Dashboard() {
  const {
    data: events,
    loading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = usePolling(getEventData, 5000);
  const { data: stats, refetch: refetchStats } = usePolling(getStats, 5000);

  const handleResolved = () => {
    refetchEvents();
    refetchStats();
  };

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
      <Navbar isLive={!eventsError} />

      <div style={{ padding: 24 }}>
        <StatsPanel stats={stats} />

        {eventsLoading ? (
          <p style={{ color: "#5b6b82" }}>Loading map…</p>
        ) : (
          <MapView events={events} />
        )}

        <div style={{ marginTop: 20 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: 1,
              color: "#5b6b82",
              margin: "0 0 8px",
              textTransform: "uppercase",
            }}
          >
            Recent Detections
          </p>
          <EventTable events={events} onResolved={handleResolved} />
        </div>
      </div>
    </div>
  );
}
