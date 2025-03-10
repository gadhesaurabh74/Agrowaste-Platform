import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

// Change if running on a real device

export const apiRequest = async (endpoint: string, method = "GET", body?: any, auth = true) => {
  console.log("start");
  const IP_ADDRESS="localhost";
  const API_BASE_URL=`http://${IP_ADDRESS}:5000`;
  const API_URL = `${API_BASE_URL}/api`;
  
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