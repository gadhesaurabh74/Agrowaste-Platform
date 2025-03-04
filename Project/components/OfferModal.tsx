import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OfferModal({ visible, offer, onClose, onRespond }) {
  const handleResponse = async (status) => {
    if (!offer) return;
    try {
      const token = await AsyncStorage.getItem("token");
      await fetch(`http://localhost:5000/api/offers/${offer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      onClose();
      onRespond();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Offer</Text>
          {offer && (
            <View style={styles.offerDetails}>
              <Text>Listing: {offer.listing.title}</Text>
              <Text>Buyer: {offer.buyer.name}</Text>
              <Text>Price: ${offer.price}</Text>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.acceptButton} onPress={() => handleResponse("accepted")}>
              <Text>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton} onPress={() => handleResponse("declined")}>
              <Text>Decline</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text>Close</Text>
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