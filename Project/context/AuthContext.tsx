import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Create Auth Context
const AuthContext = createContext(null);

const API_BASE_URL="http://localhost:5000"
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper function for API requests
  const fetchAPI = async (endpoint, method = "GET", body = null, auth = true) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (auth) {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }
      return data;
    } catch (error) {
      console.error("API request error:", error.message);
      throw error;
    }
  };

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("token there in authContext");
        if (token) {
          const userData = await fetchAPI("/auth/me", "GET");
          setUser({...userData,role:userData.role});
          console.log("data in authcon",{...user});

          // Redirect user based on role
          if (userData.role === "farmer") {
            router.replace("/(farmer)");
          } else if (userData.role === "buyer") {
            router.replace("/(buyer)");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  // Login function (now requires role)
  const login = async (email, password, role) => {
    try {
      const url = role === "farmer" ? "/auth/farmer/login" : "/auth/buyer/login";
      const data = await fetchAPI(url, "POST", { email, password }, false);

      await AsyncStorage.setItem("token", data.token);
      setUser(data.farmer || data.buyer);
      console.log("user in auth: ",{...user});

      // Delay navigation slightly to ensure layout is mounted
      setTimeout(() => {
        if (data.farmer) {
          router.replace("/(farmer)");
        } else if (data.buyer) {
          router.replace("/(buyer)");
        }
      }, 100);
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    router.replace("/(auth)/role-selection"); // Redirect to role selection
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAuth = () => useContext(AuthContext);