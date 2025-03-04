import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OfferModal({ visible, onClose, listing }) {
  const [offerPrice, setOfferPrice] = useState("");

  const makeOffer = async () => {
    if (!offerPrice.trim()) {
      alert("Please enter an offer price.");
      return;
    }
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listing: listing?._id,
          price: parseFloat(offerPrice),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create offer");
      }

      alert("Offer submitted successfully!");
      setOfferPrice("");
      onClose();
    } catch (error) {
      console.error("Error making offer:", error);
      alert(error.message);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {listing && (
            <>
              {/* Listing Image */}
              {listing.image && (
                <Image source={{ uri: listing.image }} style={styles.image} />
              )}

              {/* Listing Details */}
              <Text style={styles.title}>{listing.title}</Text>
              <Text style={styles.price}>Price: ${listing.price}</Text>
              <Text style={styles.location}>Location: {listing.farmer.location}</Text>

              {/* Offer Input */}
              <Text style={styles.offerText}>Enter Your Offer Price</Text>
              <TextInput
                placeholder="Offer Price"
                keyboardType="numeric"
                value={offerPrice}
                onChangeText={setOfferPrice}
                style={styles.input}
              />

              {/* Buttons */}
              <TouchableOpacity style={styles.submitButton} onPress={makeOffer}>
                <Text style={styles.submitText}>Submit Offer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  offerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    width: "100%",
    borderRadius: 5,
    marginBottom: 15,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
  marginTop: 10,
  padding: 12,
  borderRadius: 5,
  width: "100%",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#007bff",
  backgroundColor: "transparent", // Transparent to match a secondary button style
  },
  cancelText: {
  color: "#007bff",
  fontWeight: "bold",
  },
});