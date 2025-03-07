import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import i18n from "../config/i18n";

export default function OfferModal({ visible, offer, onClose, onRespond }) {
  const { t } = useTranslation();

  const handleResponse = async (status) => {
    if (!offer) return;
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/offers/${offer._id}`, {
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
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t("offer")}</Text>
          {offer && (
            <View style={styles.offerDetails}>
              <Text>{`${t("listing")}: ${offer.listing.title}`}</Text>
              <Text>{`${t("buyer")}: ${offer.buyer.name}`}</Text>
              <Text>{`${t("price")}: $${offer.price}`}</Text>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.acceptButton} onPress={() => handleResponse("accepted")}>
              <Text>{t("accept")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton} onPress={() => handleResponse("declined")}>
              <Text>{t("decline")}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text>{t("close")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 8, width: 280 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  offerDetails: { marginBottom: 15 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around" },
  acceptButton: { backgroundColor: "green", padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5, alignItems: "center" },
  declineButton: { backgroundColor: "red", padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5, alignItems: "center" },
  closeButton: { backgroundColor: "blue", padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center" },
});