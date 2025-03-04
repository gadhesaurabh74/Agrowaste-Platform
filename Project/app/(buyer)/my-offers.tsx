import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OfferModal from "../../components/BuyerOfferModal";

export default function MyOffers() {
  const [offers, setOffers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/offers/my", { headers: { Authorization: `Bearer ${token}` } });
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
      <Text style={styles.title}>Offers</Text>
      {offers.length === 0 ? <Text style={styles.empty}>None</Text> : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openModal(item)} style={styles.card}>
              <Image source={{ uri: item.listing.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.listing}>{item.listing.title}</Text>
                <Text>By {item.farmer.name}</Text>
                <Text>📞 {item.farmer.phone}</Text>
                <Text>${item.price}</Text>
                <Text style={[styles.status, styles[item.status]]}>{item.status.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <OfferModal visible={modalVisible} onClose={() => setModalVisible(false)} offer={selectedOffer} fetchOffers={fetchOffers} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f0f0f0" },
  title: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginVertical: 8 },
  empty: { textAlign: "center", marginTop: 15 },
  card: { flexDirection: "row", backgroundColor: "white", padding: 8, marginVertical: 4, borderRadius: 4 },
  image: { width: 60, height: 60, borderRadius: 3, backgroundColor: "#ccc", marginRight: 8 },
  info: { flex: 1 },
  listing: { fontWeight: "bold", marginBottom: 2 },
  status: { padding: 2, borderRadius: 2, alignSelf: "flex-start", marginTop: 2, fontSize: 10 },
  accepted: { backgroundColor: "#e0f2e7", color: "green" },
  declined: { backgroundColor: "#fbe3e7", color: "red" },
  pending: { backgroundColor: "#e0f7fa", color: "blue" },
});