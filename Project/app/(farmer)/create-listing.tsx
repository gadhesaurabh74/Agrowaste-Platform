import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";
import { useAuth } from "../../context/AuthContext";

export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const { t } = useTranslation();
  const { API_BASE_URL } = useAuth();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleCreateListing = async () => {
    if (!title || !description || !price || !location || !quantity || !image) {
      Alert.alert(t("error"), t("required"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", { uri: image, name: "listing.jpg", type: "image/jpeg" });
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("quantity", quantity);

      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/listings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          "accept-language": i18n.language,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed");
      Alert.alert(t("success"), t("created"));
      setTitle("");
      setDescription("");
      setPrice("");
      setLocation("");
      setQuantity("");
      setImage(null);
    } catch (error) {
      Alert.alert(t("error"), t("failed"));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("create")}</Text>
      <TextInput style={styles.input} placeholder={t("title")} value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder={t("description")} value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder={t("price")} value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder={t("quantity")} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder={t("location")} value={location} onChangeText={setLocation} />
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text>{t("pickImage")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCreateListing}>
        <Text style={styles.buttonText}>{t("create")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  imageButton: {
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});