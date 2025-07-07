import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import i18n from "../config/i18n";
import { useAuth } from "../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function OfferModal({ visible, offer, onClose, onRespond }) {
  const { t } = useTranslation();
  const { API_BASE_URL } = useAuth();

  const handleResponse = async (status) => {
    if (!offer) return;
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/offers/${offer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "accept-language": i18n.language,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update offer status");
      }

      onClose();
      onRespond();
    } catch (e) {
      Alert.alert(t("error"), t("offerUpdateFailed"));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header with Gradient */}
          <LinearGradient colors={["#007AFF", "#00B4DB"]} style={styles.header}>
            <MaterialIcons name="local-offer" size={28} color="#fff" />
            <Text style={styles.headerTitle}>{t("offerDetails")}</Text>
          </LinearGradient>

          {offer && (
            <View style={styles.offerDetails}>
              <View style={styles.detailRow}>
                <MaterialIcons name="shopping-cart" size={20} color="#007AFF" />
                <Text style={styles.detailText}>{`${t("listing")}: ${offer.listing.title}`}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="person" size={20} color="#28a745" />
                <Text style={styles.detailText}>{`${t("buyer")}: ${offer.buyer.name}`}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="attach-money" size={20} color="#ff8c00" />
                <Text style={styles.detailText}>{`${t("price")}: $${offer.price}`}</Text>
              </View>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.acceptButton} onPress={() => handleResponse("accepted")}>
              <MaterialIcons name="check-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>{t("accept")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.declineButton} onPress={() => handleResponse("declined")}>
              <MaterialIcons name="cancel" size={20} color="#fff" />
              <Text style={styles.buttonText}>{t("decline")}</Text>
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={22} color="#fff" />
            <Text style={styles.buttonText}>{t("close")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 320,
    overflow: "hidden",
    elevation: 5,
  },

  // Header with Gradient
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },

  // Offer Details
  offerDetails: {
    padding: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },

  // Buttons
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 15,
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    justifyContent: "center",
  },
  declineButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    justifyContent: "center",
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    margin: 15,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
});