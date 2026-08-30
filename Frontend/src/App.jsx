import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hook/useAuth";
import PublicMap from "./components/PublicMap";
import Login from "./components/auth/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ color: "#5b6b82", padding: 24 }}>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicMap />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
