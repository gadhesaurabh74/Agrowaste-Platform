import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../config/api";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";

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
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <FontAwesome5 name="user-circle" size={60} color="#4CAF50" />
        <Text style={styles.welcome}>Welcome, {user.name}!</Text>
        <Text style={styles.userInfo}><MaterialIcons name="email" size={16} color="#555" /> {user.email}</Text>
        <Text style={styles.userInfo}><Ionicons name="call" size={16} color="#555" /> {user.phone}</Text>
        <Text style={styles.userInfo}><FontAwesome5 name="building" size={16} color="#555" /> {user.companyName}</Text>
        <Text style={styles.userInfo}><Ionicons name="location" size={16} color="#555" /> {user.location}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.stats}>
        <View style={[styles.statBox, { backgroundColor: "#FF9800" }]}>
          <FontAwesome5 name="clipboard-list" size={28} color="white" />
          <Text style={styles.statNumber}>{stats.totalOffers}</Text>
          <Text style={styles.statLabel}>Total Offers</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: "#4CAF50" }]}>
          <MaterialIcons name="check-circle" size={28} color="white" />
          <Text style={styles.statNumber}>{stats.acceptedOffers}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: "#F44336" }]}>
          <MaterialIcons name="cancel" size={28} color="white" />
          <Text style={styles.statNumber}>{stats.rejectedOffers}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: "#03A9F4" }]}>
          <Ionicons name="hourglass" size={28} color="white" />
          <Text style={styles.statNumber}>{stats.pendingOffers}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  profileCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  userInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    width: "47%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "white",
  },
});