import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Modal, 
  StyleSheet, Alert, ActivityIndicator 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const OfferModal = ({ visible, onClose, offer, fetchOffers }) => {
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const { API_BASE_URL } = useAuth();

  useEffect(() => {
    if (offer) setNewPrice(offer.price ? offer.price.toString() : "");
  }, [offer]);

  const updateOffer = async () => {
    if (!offer || !newPrice || isNaN(parseFloat(newPrice)) || parseFloat(newPrice) <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid price.");
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/offers/${offer._id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ price: parseFloat(newPrice) }),
      });
      if (!response.ok) throw new Error("Failed to update offer");

      onClose();
      fetchOffers();
    } catch (error) {
      Alert.alert("Error", "Failed to update offer. Please try again.");
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
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/offers/${offer._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to delete offer");

            onClose();
            fetchOffers();
          } catch (error) {
            Alert.alert("Error", "Failed to delete offer. Please try again.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Offer</Text>

          {/* Listing Details */}
          <View style={styles.detailRow}>
            <Icon name="clipboard-list" size={20} color="#007bff" />
            <Text style={styles.label}>{offer?.listing?.title || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="account" size={20} color="#28a745" />
            <Text style={styles.label}>{offer?.farmer?.name || "Unknown"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="phone" size={20} color="#ff9800" />
            <Text style={styles.label}>{offer?.farmer?.phone || "N/A"}</Text>
          </View>

          {/* Price Input */}
          <View style={styles.inputContainer}>
            <Icon name="cash" size={24} color="#4caf50" />
            <TextInput
              style={styles.input}
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
              placeholder="Enter new price"
              placeholderTextColor="#999"
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.updateButton]} 
              onPress={updateOffer} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : 
                <Icon name="content-save" size={20} color="white" />}
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]} 
              onPress={deleteOffer} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : 
                <Icon name="trash-can" size={20} color="white" />}
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Icon name="close-circle" size={20} color="#007bff" />
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
    width: 330, 
    padding: 20, 
    backgroundColor: "white", 
    borderRadius: 12, 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 15, 
    color: "#333" 
  },
  detailRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8,
    marginBottom: 8,
  },
  label: { 
    fontSize: 16, 
    color: "#555", 
    textAlign: "center" 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    width: "100%",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  buttonRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "100%", 
    marginTop: 10 
  },
  button: { 
    flex: 1, 
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    padding: 12, 
    borderRadius: 8, 
    alignItems: "center", 
    marginHorizontal: 5 
  },
  updateButton: { backgroundColor: "#28a745" },
  deleteButton: { backgroundColor: "#dc3545" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  cancelButton: {
    flexDirection: "row",
    gap: 6,
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { color: "#007bff", fontSize: 16, fontWeight: "bold" },
});

export default OfferModal;