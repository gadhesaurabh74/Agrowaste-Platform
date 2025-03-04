import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OfferItem from "../../components/OfferItem";
import OfferModal from "../../components/OfferModal";

export default function ManageOffers() {
  const [offers, setOffers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/offers/farmer", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOffers(data);
    } catch (e) { console.error("Error:", e); } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offers</Text>
      {loading ? <ActivityIndicator size="large" /> : offers.length === 0 ? <Text style={styles.empty}>None</Text> : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <OfferItem offer={item} onPress={() => { setSelectedOffer(item); setModalVisible(true); }} />}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOffers} />}
        />
      )}
      <OfferModal visible={modalVisible} offer={selectedOffer} onClose={() => setModalVisible(false)} onRespond={fetchOffers} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  empty: { textAlign: "center", marginTop: 20 },
});