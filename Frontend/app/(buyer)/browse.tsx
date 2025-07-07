import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import OfferModal from "../../components/BrowseModal";
import { useAuth } from "../../context/AuthContext";

export default function BrowseListings() {
  const { user, API_BASE_URL } = useAuth();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [search, sortOrder, listings]);

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/listings`);
      const data = await res.json();
      setListings(data);
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const filterAndSort = () => {
    let list = [...listings];
    if (search) {
      list = list.filter((item) => item.title.toLowerCase()?.includes(search.toLowerCase()) || item.farmer.location?.toLowerCase().includes(search.toLowerCase()));
    }
    if (sortOrder === "low-to-high") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
      list.sort((a, b) => b.price - a.price);
    }
    setFilteredListings(list);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Browse Listings</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#555" />
        <TextInput
          placeholder="Search listings..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Sorting */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortText}>Sort by Price:</Text>
        <TouchableOpacity onPress={() => setSortOrder(sortOrder === "low-to-high" ? "high-to-low" : "low-to-high")} style={styles.sortButton}>
          <MaterialIcons name={sortOrder === "low-to-high" ? "arrow-upward" : "arrow-downward"} size={20} color="white" />
          <Text style={styles.sortButtonText}>{sortOrder === "low-to-high" ? "High-Low" : "Low-High"}</Text>
        </TouchableOpacity>
      </View>

      {/* Listings */}
      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <View style={styles.details}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <Text style={styles.location}><Ionicons name="location" size={14} color="#666" /> {item.farmer.location}</Text>
              <TouchableOpacity
                style={styles.offerButton}
                onPress={() => { setSelectedListing(item); setModalVisible(true); }}
              >
                <Text style={styles.offerButtonText}>Make Offer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Offer Modal */}
      <OfferModal visible={modalVisible} onClose={() => setModalVisible(false)} listing={selectedListing} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sortText: {
    fontSize: 16,
    color: "#444",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
  },
  sortButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  offerButton: {
    backgroundColor: "#FF9800",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  offerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});