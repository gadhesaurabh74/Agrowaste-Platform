import { useState, useCallback } from "react";
import { 
  View, Text, ActivityIndicator, Alert, StyleSheet, ScrollView, TouchableOpacity 
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";
import * as Speech from "expo-speech";
import { MaterialIcons } from "@expo/vector-icons";

export default function FarmerDashboard() {
  const { user, API_BASE_URL } = useAuth();
  const navigation = useNavigation();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      fetchDashboardStats();
    }, [])
  );

  const fetchDashboardStats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/farmer/profile/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "accept-language": i18n.language,
        },
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      Alert.alert(t("error"), t("failed"));
    } finally {
      setLoading(false);
    }
  };

  const speakStats = () => {
    const text = `${t("listings")}: ${stats.totalListings || 0}. 
                  ${t("offers")}: ${stats.totalOffers || 0}. 
                  ${t("pending")}: ${stats.pendingOffers || 0}. 
                  ${t("accepted")}: ${stats.acceptedOffers || 0}.`;
    Speech.speak(text, { language: i18n.language });
  };

  if (!user) return <Text style={styles.loadingText}>{t("loading")}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("dashboard")}</Text>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <MaterialIcons name="person" size={90} color="#fff" style={styles.iconBackground} />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userDetail}>
            <MaterialIcons name="phone" size={20} color="#2D9CDB" /> {user.phone}
          </Text>
          <Text style={styles.userDetail}>
            <MaterialIcons name="location-on" size={20} color="#27AE60" /> {user.location || t("no_location")}
          </Text>
          <Text style={styles.userDetail}>
            <MaterialIcons name="email" size={20} color="#F2994A" /> {user.email}
          </Text>
        </View>

        {/* Dashboard Stats Tiles */}
        {loading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <View style={styles.statsContainer}>
            <View style={[styles.statTile, { backgroundColor: "#2D9CDB" }]}>
              <MaterialIcons name="inventory" size={40} color="white" />
              <Text style={styles.statText}>{stats.totalListings || 0}</Text>
              <Text style={styles.statLabel}>{t("listings")}</Text>
            </View>
            <View style={[styles.statTile, { backgroundColor: "#F2994A" }]}>
              <MaterialIcons name="local-offer" size={40} color="white" />
              <Text style={styles.statText}>{stats.totalOffers || 0}</Text>
              <Text style={styles.statLabel}>{t("offers")}</Text>
            </View>
            <View style={[styles.statTile, { backgroundColor: "#F2C94C" }]}>
              <MaterialIcons name="pending-actions" size={40} color="white" />
              <Text style={styles.statText}>{stats.pendingOffers || 0}</Text>
              <Text style={styles.statLabel}>{t("pending")}</Text>
            </View>
            <View style={[styles.statTile, { backgroundColor: "#27AE60" }]}>
              <MaterialIcons name="check-circle" size={40} color="white" />
              <Text style={styles.statText}>{stats.acceptedOffers || 0}</Text>
              <Text style={styles.statLabel}>{t("accepted")}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Sticky Buttons */}
      <TouchableOpacity style={styles.ttsButton} onPress={speakStats}>
        <MaterialIcons name="volume-up" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.aiButton} onPress={() => navigation.navigate("AI Suggestions")}>
        <MaterialIcons name="lightbulb" size={30} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f7f7f7",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
  },

  /** Profile Card **/
  profileCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
    width: "100%",
  },
  iconBackground: {
    backgroundColor: "#6FCF97",
    borderRadius: 50,
    padding: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  userDetail: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  /** Stats Tiles **/
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  statTile: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  statText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 16,
    color: "#fff",
  },

  /** Sticky Buttons **/
  ttsButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#2D9CDB",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  aiButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#F2994A",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
});