import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api"; // Change if running on a real device

export const apiRequest = async (endpoint: string, method = "GET", body?: any, auth = true) => {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (auth) {
      const token = await AsyncStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed");

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};