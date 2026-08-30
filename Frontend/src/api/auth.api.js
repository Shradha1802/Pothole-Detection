import axios from "axios";
import { API_BASE_URL } from "../environment";

const BASE_URL = `${API_BASE_URL}/api/auth`;

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const login = async ({ email, password }) => {
  const response = await client.post("/login", { email, password });
  return response.data;
};

export const register = async ({ username, email, password }) => {
  const response = await client.post("/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await client.get("/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await client.get("/get-me");
  return response.data;
};
