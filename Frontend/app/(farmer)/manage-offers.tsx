import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import OfferItem from "../../components/OfferItem";
import OfferModal from "../../components/OfferModal";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";
import { useAuth } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

export default function ManageOffers() {
  const [offers, setOffers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { API_BASE_URL } = useAuth();

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/offers/farmer`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "accept-language": i18n.language,
        },
      });
      const data = await res.json();
      setOffers(data);
    } catch (e) {
      Alert.alert(t("error"), t("offersLoadFailed"));
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect to refresh the offers when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchOffers();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient colors={["#007AFF", "#00B4DB"]} style={styles.header}>
        <MaterialIcons name="local-offer" size={28} color="#fff" />
        <Text style={styles.headerTitle}>{t("manageOffers")}</Text>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : offers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="hourglass-empty" size={50} color="gray" />
          <Text style={styles.emptyText}>{t("noOffers")}</Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <OfferItem
                offer={item}
                onPress={() => {
                  setSelectedOffer(item);
                  setModalVisible(true);
                }}
              />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOffers} />}
        />
      )}

      {/* Offer Modal */}
      <OfferModal
        visible={modalVisible}
        offer={selectedOffer}
        onClose={() => setModalVisible(false)}
        onRespond={fetchOffers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 15,
  },

  // Header with Gradient
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },

  // Card Style for Offers
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },

  // Empty State
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
  },
});