import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/farmer/profile/dashboard", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      Alert.alert("Error", "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <View style={styles.stats}>
          <Text>{`Listings: ${stats.totalListings || 0}`}</Text>
          <Text>{`Offers: ${stats.totalOffers || 0}`}</Text>
          <Text>{`Pending: ${stats.pendingOffers || 0}`}</Text>
          <Text>{`Accepted: ${stats.acceptedOffers || 0}`}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',
  },
  stats: {
    alignItems: 'center',
  },
});