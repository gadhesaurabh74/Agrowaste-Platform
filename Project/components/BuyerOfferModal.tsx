import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Modal, 
  StyleSheet, Alert, ActivityIndicator 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OfferModal = ({ visible, onClose, offer, fetchOffers }) => {
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (offer) {
      setNewPrice(offer.price ? offer.price.toString() : "");
    }
  }, [offer]);

  const updateOffer = async () => {
    if (!offer) return;
    if (!newPrice || isNaN(parseFloat(newPrice)) || parseFloat(newPrice) <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid price.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/offers/${offer._id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: parseFloat(newPrice) }),
      });

      if (!response.ok) {
        throw new Error("Failed to update offer");
      }

      onClose();
      fetchOffers();
    } catch (error) {
      Alert.alert("Error", "Failed to update offer. Please try again.");
      console.error("Error updating offer:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async () => {
    if (!offer) return;

    Alert.alert("Delete Offer", "Are you sure you want to delete this offer?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/offers/${offer._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to delete offer");

            onClose();
            fetchOffers();
          } catch (error) {
            Alert.alert("Error", "Failed to delete offer. Please try again.");
            console.error("Error deleting offer:", error);
          } finally {
            setLoading(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Offer</Text>

          {/* Listing Details */}
          <Text style={styles.label}><Text style={styles.bold}>Listing:</Text> {offer?.listing?.title || "N/A"}</Text>
          <Text style={styles.label}><Text style={styles.bold}>Farmer:</Text> {offer?.farmer?.name || "Unknown"}</Text>
          <Text style={styles.label}><Text style={styles.bold}>Phone:</Text> {offer?.farmer?.phone || "N/A"}</Text>

          {/* Price Input */}
          <TextInput
            style={styles.input}
            value={newPrice}
            onChangeText={setNewPrice}
            keyboardType="numeric"
            placeholder="Enter new price"
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.updateButton]} 
              onPress={updateOffer} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Update</Text>}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]} 
              onPress={deleteOffer} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Delete</Text>}
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    width: 320, 
    padding: 20, 
    backgroundColor: "white", 
    borderRadius: 10, 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 15, 
    color: "#333" 
  },
  label: { 
    fontSize: 16, 
    color: "#555", 
    marginBottom: 5, 
    textAlign: "center" 
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    borderColor: "#ccc",
    backgroundColor: "#f8f8f8",
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  buttonRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "100%", 
    marginTop: 10 
  },
  button: { 
    flex: 1, 
    padding: 12, 
    borderRadius: 5, 
    alignItems: "center", 
    marginHorizontal: 5 
  },
  updateButton: { 
    backgroundColor: "#28a745" 
  },
  deleteButton: { 
    backgroundColor: "#dc3545" 
  },
  buttonText: { 
    color: "white", 
    fontWeight: "bold" 
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    width: "100%",
    alignItems: "center",
  },
  cancelText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OfferModal;