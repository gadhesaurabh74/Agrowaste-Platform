import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OfferModal from "../../components/BuyerOfferModal";
import { useAuth } from "../../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function MyOffers() {
  const [offers, setOffers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const { API_BASE_URL } = useAuth();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/offers/my`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      setOffers(data);
    } catch (e) { console.error("Error:", e); }
  };

  const openModal = (offer) => {
    setSelectedOffer(offer);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Offers</Text>
      
      {offers.length === 0 ? (
        <Text style={styles.emptyText}>No offers made yet</Text>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openModal(item)} style={styles.card}>
              <Image source={{ uri: item.listing.image }} style={styles.image} />
              
              <View style={styles.info}>
                <Text style={styles.listing}>{item.listing.title}</Text>

                <View style={styles.row}>
                  <Icon name="account" size={16} color="#555" />
                  <Text style={styles.detail}> {item.farmer.name}</Text>
                </View>

                <View style={styles.row}>
                  <Icon name="phone" size={16} color="#28a745" />
                  <Text style={styles.detail}> {item.farmer.phone}</Text>
                </View>

                <View style={styles.row}>
                  <Icon name="cash" size={16} color="#007bff" />
                  <Text style={styles.detail}> ${item.price}</Text>
                </View>

                <Text style={[styles.status, styles[item.status]]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <OfferModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        offer={selectedOffer}
        fetchOffers={fetchOffers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f8f9fa" },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 12 },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  image: { width: 70, height: 70, borderRadius: 8, backgroundColor: "#ccc", marginRight: 10, },
  info: { flex: 1, justifyContent: "center" },
  listing: { fontWeight: "bold", fontSize: 16, marginBottom: 4, color: "#333" },

  row: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  detail: { fontSize: 14, color: "#555", marginLeft: 6 },

  status: { 
    marginTop: 6, 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 12, 
    fontSize: 12, 
    fontWeight: "bold", 
    textAlign: "center", 
    alignSelf: "flex-start",
  },
  accepted: { backgroundColor: "#d4edda", color: "#155724" },
  declined: { backgroundColor: "#f8d7da", color: "#721c24" },
  pending: { backgroundColor: "#fff3cd", color: "#856404" },
});