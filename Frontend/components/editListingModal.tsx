import { useState, useEffect } from "react";
import { View, Text, TextInput, Image, Modal, Alert, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function EditListingModal({ visible, listing, onClose, onUpdate }) {
  if (!visible || !listing) return null;


  const { t } = useTranslation();
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(listing.price?.toString() || '');
  const [quantity, setQuantity] = useState(listing.quantity?.toString() || '');
  const [image, setImage] = useState(listing.image);
  const [imageChanged, setImageChanged] = useState(false);
  const { API_BASE_URL } = useAuth();
  
  useEffect(() => {
      if (listing) {
        setTitle(listing.title || "");
        setDescription(listing.description || "");
        setPrice(listing.price?.toString() || "");
        setQuantity(listing.quantity?.toString() || "");
        setImage(listing.image || "");
      }
    }, [listing]);


  const updateListing = async () => {
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("price", price);
      form.append("quantity", quantity);
      if (imageChanged) form.append("image", { uri: image, type: "image/jpeg", name: "listing.jpg" });

      const token = await AsyncStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/listings/${listing._id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: form });

      Alert.alert(t("updated"));
      onClose();
      onUpdate();
    } catch (e) { Alert.alert(t("failed")); }
  };

  const deleteListing = async () => {
    Alert.alert(t("delete"), t("areYouSure"), [
      { text: t("no"), style: "cancel" },
      { text: t("yes"), style: "destructive", onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await fetch(`${API_BASE_URL}/api/listings/${listing._id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            Alert.alert(t("deleted"));
            onClose();
            onUpdate();
          } catch (e) { Alert.alert(t("failed")); }
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
            <Text style={styles.header}>{t("editListing")}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}><Icon name="tag" size={20} color="#2980b9" /> {t("title")}</Text>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}><Icon name="text" size={20} color="#e67e22" /> {t("description")}</Text>
              <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}><Icon name="currency-usd" size={20} color="#27ae60" /> {t("price")}</Text>
              <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}><Icon name="scale" size={20} color="#8e44ad" /> {t("quantity")}</Text>
              <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            </View>

            {image && <Image source={{ uri: image }} style={styles.image} />}
            
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Icon name="image-plus" size={24} color="white" />
              <Text style={styles.buttonText}>{t("changeImage")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={updateListing}>
              <Icon name="content-save" size={24} color="white" />
              <Text style={styles.buttonText}>{t("save")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={deleteListing}>
              <Icon name="trash-can" size={24} color="white" />
              <Text style={styles.buttonText}>{t("delete")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Icon name="close-circle" size={24} color="white" />
              <Text style={styles.buttonText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)"
  },
  scroll: { width: "90%", maxHeight: "80%" },
  content: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333"
  },
  inputGroup: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "#f9f9f9"
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ecc71",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7f8c8d",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  }
});