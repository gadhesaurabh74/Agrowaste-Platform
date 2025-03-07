import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";
import TextToSpeech from '../../components/TextToSpeech';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/farmer/profile/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "accept-language": i18n.language, // Add language header
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

  if (!user) return <Text>{t("loading")}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("dashboard")}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <View style={styles.stats}>
            <Text>{`${t("listings")}: ${stats.totalListings || 0}`}</Text>
            <Text>{`${t("offers")}: ${stats.totalOffers || 0}`}</Text>
            <Text>{`${t("pending")}: ${stats.pendingOffers || 0}`}</Text>
            <Text>{`${t("accepted")}: ${stats.acceptedOffers || 0}`}</Text>
            <TextToSpeech text={`${t("listings")}: ${stats.totalListings || 0}. ${t("offers")}: ${stats.totalOffers || 0}. ${t("pending")}: ${stats.pendingOffers || 0}. ${t("accepted")}: ${stats.acceptedOffers || 0}.`} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
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