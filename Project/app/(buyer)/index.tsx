import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../config/api";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOffers: 0,
    acceptedOffers: 0,
    rejectedOffers: 0,
    pendingOffers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiRequest("/buyer/profile/dashboard", "GET");
        setStats(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profile}>
        <Text style={styles.welcome}>Welcome, {user.name}!</Text>
        <Text>{user.email}</Text>
        <Text>{user.phone}</Text>
        <Text>{user.companyName}</Text>
        <Text>{user.location}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text>{stats.totalOffers}</Text>
          <Text>Total Offers</Text>
        </View>
        <View style={styles.stat}>
          <Text>{stats.acceptedOffers}</Text>
          <Text>Accepted</Text>
        </View>
        <View style={styles.stat}>
          <Text>{stats.rejectedOffers}</Text>
          <Text>Rejected</Text>
        </View>
        <View style={styles.stat}>
          <Text>{stats.pendingOffers}</Text>
          <Text>Pending</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  profile: { backgroundColor: "#eee", padding: 20, borderRadius: 5, marginBottom: 10 },
  welcome: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  stats: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  stat: { width: "45%", backgroundColor: "white", padding: 10, borderRadius: 5, alignItems: "center", margin: 5 },
});