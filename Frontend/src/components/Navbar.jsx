import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

export default function Navbar({ mode = "official", isLive = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useAuth();

  const navItemStyle = {
    color: "#8393a8",
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    background: "none",
    border: "none",
  };

  const onLogout = async () => {
    navigate("/");
    await handleLogout();
  };

  // Show whichever of Dashboard/Profile the user ISN'T currently on —
  // never both at once.
  const isOnProfile = location.pathname === "/profile";

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 24px",
        borderBottom: "1px solid #1e2836",
        background: "#0b0f16",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 700 }}>
        <span style={{ color: "#e6edf5" }}>Pothole</span>
        <span style={{ color: "#22d3ee" }}>Guard</span>
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 20,
            background: isLive ? "rgba(74,222,128,0.1)" : "rgba(244,87,79,0.1)",
            color: isLive ? "#4ade80" : "#f4574f",
            border: `1px solid ${isLive ? "#4ade80" : "#f4574f"}`,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: isLive ? "#4ade80" : "#f4574f",
            }}
          />
          {isLive ? "LIVE" : "OFFLINE"}
        </div>

        {mode === "public" ? (
          <a href="/login" style={navItemStyle}>
            Login
          </a>
        ) : (
          <>
            {isOnProfile ? (
              <a href="/dashboard" style={navItemStyle}>
                Dashboard
              </a>
            ) : (
              <a href="/profile" style={navItemStyle}>
                Profile
              </a>
            )}
            <button
              onClick={onLogout}
              style={{ ...navItemStyle, cursor: "pointer" }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
