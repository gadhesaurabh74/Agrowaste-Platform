import { useState, useEffect, useCallback } from "react";
import { 
  View, Text, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator, 
  Alert, RefreshControl, StyleSheet 
} from "react-native";
import * as Speech from "expo-speech";
import { apiRequest } from "../../config/api";
import { useFocusEffect } from "expo-router";
import EditListingModal from "../../components/editListingModal";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";
import Icon from "react-native-vector-icons/MaterialIcons";

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

  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [])
  );

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/listings/my-listings", "GET", null, {
        "accept-language": i18n.language,
      });
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
    const filtered = listings.filter((listing) =>
      listing.title.toLowerCase().includes(lowerQuery)
    );
    setFilteredListings(query.trim() === "" ? listings : filtered);
  };

  const openEditModal = (listing) => {
    setEditingListing({ ...listing });
    setModalVisible(true);
  };

  const handleUpdate = () => {
    fetchListings(); // ✅ Ensure UI updates after delete/update
  };

  const speak = (text) => {
    Speech.speak(text, {
      language: i18n.language,
      pitch: 1.0,
      rate: 1.0,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("myListings")}</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={22} color="#757575" />
        <TextInput
          style={styles.searchInput}
          placeholder={t("search")}
          value={searchQuery}
          onChangeText={filterListings}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF9800" />
      ) : filteredListings.length === 0 ? (
        <Text style={styles.empty}>{t("noListingsFound")}</Text>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => openEditModal(item)}>
              <Image source={{ uri: item.image || "fallback-image-url.png" }} style={styles.image} />
              <View style={styles.details}>
                <View style={styles.titleRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <TouchableOpacity onPress={() => speak(item.title)} style={styles.speakerButton}>
                    <Icon name="volume-up" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.infoRow}>
                  <Icon name="attach-money" size={18} color="#4CAF50" />
                  <Text style={styles.infoText}>{`${t("price")}: $${item.price}`}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="shopping-cart" size={18} color="#FF5722" />
                  <Text style={styles.infoText}>{`${t("quantity")}: ${item.quantity} Kg`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchListings} />}
        />
      )}

      {/* Edit Modal */}
      <EditListingModal
        visible={modalVisible}
        listing={editingListing}
        onClose={() => setModalVisible(false)}
        onUpdate={handleUpdate} // ✅ Ensures MyListings refreshes after updates
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  speakerButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#555",
  },
});