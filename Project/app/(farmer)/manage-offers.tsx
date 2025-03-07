import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OfferItem from "../../components/OfferItem";
import OfferModal from "../../components/OfferModal";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";

export default function ManageOffers() {
  const [offers, setOffers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/offers/farmer", {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("manageOffers")}</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : offers.length === 0 ? (
        <Text style={styles.empty}>{t("noOffers")}</Text>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <OfferItem
              offer={item}
              onPress={() => {
                setSelectedOffer(item);
                setModalVisible(true);
              }}
            />
          )}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOffers} />}
        />
      )}
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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  empty: { textAlign: "center", marginTop: 20 },
});