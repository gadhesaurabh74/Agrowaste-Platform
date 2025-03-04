import { useState } from "react";
import { View, Text, TextInput, Image, Modal, Alert, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditListingModal({ visible, listing, onClose, onUpdate }) {
  if (!listing) return null;

  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(listing.price?.toString() || '');
  const [quantity, setQuantity] = useState(listing.quantity?.toString() || '');
  const [image, setImage] = useState(listing.image);
  const [imageChanged, setImageChanged] = useState(false);

  const updateListing = async () => {
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("price", price);
      form.append("quantity", quantity);
      if (imageChanged) form.append("image", { uri: image, type: "image/jpeg", name: "listing.jpg" });

      const token = await AsyncStorage.getItem("token");
      await fetch(`http://localhost:5000/api/listings/${listing._id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: form });

      Alert.alert("Updated");
      onClose();
      onUpdate();
    } catch (e) { Alert.alert("Failed"); }
  };

  const deleteListing = async () => {
    Alert.alert("Delete?", "Sure?", [
      { text: "No", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await fetch(`http://localhost:5000/api/listings/${listing._id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            Alert.alert("Deleted");
            onClose();
            onUpdate();
          } catch (e) { Alert.alert("Failed"); }
        }},
    ]);
  };

  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!res.canceled) { setImage(res.assets[0].uri); setImageChanged(true); }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalView}>
        <ScrollView style={styles.scroll}>
          <View style={styles.content}>
            <Text style={styles.header}>Edit</Text>
            <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
            <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TouchableOpacity style={styles.button} onPress={pickImage}><Text>Image</Text></TouchableOpacity>
            <TouchableOpacity style={styles.save} onPress={updateListing}><Text>Save</Text></TouchableOpacity>
            <TouchableOpacity style={styles.delete} onPress={deleteListing}><Text>Delete</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancel} onPress={onClose}><Text>Cancel</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  scroll: { width: "90%", maxHeight: "80%" },
  content: { backgroundColor: "white", padding: 20, borderRadius: 10 },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  image: { width: "100%", height: 200, borderRadius: 5, marginBottom: 10 },
  button: { backgroundColor: "#ddd", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  save: { backgroundColor: "green", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  delete: { backgroundColor: "red", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  cancel: { backgroundColor: "#ccc", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 10 },
});