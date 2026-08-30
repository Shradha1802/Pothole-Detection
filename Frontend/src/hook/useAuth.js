import { useContext, useEffect } from "react";
import { AuthContext } from "../authContext";
import { login, register, logout, getMe } from "../api/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading, error, setError } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return true; // caller (Login.jsx) uses this to decide whether to navigate
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.log(err); // fixed: was referencing undefined 'e'
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (err) {
        console.log(err); // fixed: was referencing undefined 'e', which threw inside the catch itself
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, []);

  return { user, loading, error, handleRegister, handleLogin, handleLogout };
};