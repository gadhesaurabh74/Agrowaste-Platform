import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert, RefreshControl, StyleSheet } from "react-native";
import { apiRequest } from "../../config/api";
import { useFocusEffect } from "expo-router";
import EditListingModal from "../../components/editListingModal";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";
import TextToSpeech from '../../components/TextToSpeech';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    fetchListings();
  }, []);

  useFocusEffect(useCallback(() => {
    fetchListings();
  }, []));

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/listings/my-listings", "GET", null, { "accept-language": i18n.language });
      setListings(response);
      setFilteredListings(response);
    } catch (error) {
      Alert.alert(t("error"), t("listingsLoadFailed"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterListings = (query) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    const filtered = listings.filter((listing) => listing.title.toLowerCase().includes(lowerQuery));
    setFilteredListings(query.trim() === "" ? listings : filtered);
  };

  const openEditModal = (listing) => {
    setEditingListing({ ...listing });
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("myListings")}</Text>
      <TextInput placeholder={t("search")} value={searchQuery} onChangeText={filterListings} style={styles.search} />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : filteredListings.length === 0 ? (
        <Text style={styles.empty}>{t("noListingsFound")}</Text>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => openEditModal(item)}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text>{`${t("price")}: $${item.price}`}</Text>
                <Text>{`${t("quantity")}: ${item.quantity} Kg`}</Text>
                <TextToSpeech text={item.title} />
              </View>
            </TouchableOpacity>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchListings} />}
        />
      )}
      <EditListingModal visible={modalVisible} listing={editingListing} onClose={() => setModalVisible(false)} onUpdate={fetchListings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f0f0f0" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  search: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: "white" },
  empty: { textAlign: "center", marginTop: 20, color: "#888" },
  item: { flexDirection: "row", padding: 10, marginBottom: 10, backgroundColor: "white", borderRadius: 8, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  details: { flex: 1 },
  itemTitle: { fontSize: 18, fontWeight: "bold" },
});