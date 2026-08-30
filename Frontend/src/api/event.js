import axios from "axios";
import { API_BASE_URL } from "../environment";

const BASE_URL = `${API_BASE_URL}/api/events`;

export const getEventData = async () => {
  try {
    const response = await axios.get(BASE_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log("Error fetching event data:", error);
    return [];
  }
};

export const getStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/stats`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching event stats:", error);
    return { total: 0, Minor: 0, Moderate: 0, Severe: 0 };
  }
};

export const getPublicEventData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/public`);
    return response.data;
  } catch (error) {
    console.log("Error fetching public event data:", error);
    return [];
  }
};

export const resolveEvent = async (id) => {
  const response = await axios.patch(
    `${BASE_URL}/${id}/resolve`,
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const getPublicSummary = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/public/summary`);
    return response.data;
  } catch (error) {
    console.log("Error fetching public summary:", error);
    return { totalDetected: 0, totalResolved: 0 };
  }
};

export const getResolvedLog = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/resolved-log`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching resolved log:", error);
    return [];
  }
};
