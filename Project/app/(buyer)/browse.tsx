import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import OfferModal from "../../components/BrowseModal";
import { useAuth } from "../../context/AuthContext";

export default function BrowseListings() {
  const { user } = useAuth();
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
      const res = await fetch("http://localhost:5000/api/listings");
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
      <Text style={styles.title}>Listings</Text>
      <TextInput placeholder="Search" value={search} onChangeText={setSearch} style={styles.search} />
      <View style={styles.sort}>
        <Text>Sort:</Text>
        <TouchableOpacity onPress={() => setSortOrder(sortOrder === "low-to-high" ? "high-to-low" : "low-to-high")}>
          <Text>{sortOrder === "low-to-high" ? "High-Low" : "Low-High"}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <View style={styles.details}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text>${item.price}</Text>
              <Text>{item.farmer.location}</Text>
              <TouchableOpacity style={styles.offer} onPress={() => { setSelectedListing(item); setModalVisible(true); }}><Text>Offer</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
      <OfferModal visible={modalVisible} onClose={() => setModalVisible(false)} listing={selectedListing} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  search: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10 },
  sort: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  item: { flexDirection: "row", backgroundColor: "white", padding: 10, borderRadius: 5, marginBottom: 8 },
  image: { width: 80, height: 80, borderRadius: 5, marginRight: 10 },
  details: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  offer: { backgroundColor: "green", padding: 8, borderRadius: 5, alignSelf: "flex-start" },
});