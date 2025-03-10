import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";
import TextToSpeech from '../../components/TextToSpeech';
import { Feather, MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

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

  if (!user) return <Text style={styles.loadingText}>{t("loading")}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("dashboard")}</Text>

        <View style={styles.card}>
          <View style={styles.userDetails}>
            <Feather name="user" size={40} color="#3498db" style={styles.userIcon} />
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.userExtraDetails}>
                <Ionicons name="location-outline" size={20} color="gray" />
                <Text style={styles.userExtraText}>{user.location}</Text>
              </View>
              <View style={styles.userExtraDetails}>
                <Feather name="phone" size={20} color="gray" />
                <Text style={styles.userExtraText}>{user.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#27ae60" style={styles.loadingIndicator} />
        ) : (
          <View style={styles.card}>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="format-list-bulleted" size={30} color="#e67e22" />
                <Text style={styles.statLabel}>{t("listings")}:</Text>
                <Text style={styles.statValue}>{stats.totalListings || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesome5 name="hand-holding-usd" size={30} color="#9b59b6" />
                <Text style={styles.statLabel}>{t("offers")}:</Text>
                <Text style={styles.statValue}>{stats.totalOffers || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="timer-sand" size={30} color="#f39c12" />
                <Text style={styles.statLabel}>{t("pending")}:</Text>
                <Text style={styles.statValue}>{stats.pendingOffers || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="check-circle" size={30} color="#2ecc71" />
                <Text style={styles.statLabel}>{t("accepted")}:</Text>
                <Text style={styles.statValue}>{stats.acceptedOffers || 0}</Text>
              </View>
            </View>
          </View>
        )}
        <TouchableOpacity style={styles.speakButton}>
          <TextToSpeech text={`${t("listings")}: ${stats.totalListings || 0}. ${t("offers")}: ${stats.totalOffers || 0}. ${t("pending")}: ${stats.pendingOffers || 0}. ${t("accepted")}: ${stats.acceptedOffers || 0}.`} />
          <Feather name="volume-2" size={40} color="#27ae60" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    marginRight: 15,
  },
  userName: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 5,
  },
  userExtraDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  userExtraText: {
    fontSize: 18,
    color: 'gray',
    marginLeft: 5,
  },
  loadingIndicator: {
    marginTop: 30,
  },
  statsContainer: {
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  statLabel: {
    fontSize: 22,
    fontWeight: '500',
    marginRight: 10,
  },
  statValue: {
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    backgroundColor: '#e0f7fa',
    padding: 20,
    borderRadius: 15,
  },
  loadingText: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 20,
  }
});