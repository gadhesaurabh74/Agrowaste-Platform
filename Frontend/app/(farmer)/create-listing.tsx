import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";
import { useAuth } from "../../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const { t } = useTranslation();
  const { API_BASE_URL } = useAuth();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleCreateListing = async () => {
    if (!title || !description || !price || !location || !quantity || !image) {
      Alert.alert(t("error"), t("required"));
      return;
    }

    setLoading(true); // Show loading indicator

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
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("create")}</Text>

        <View style={styles.inputContainer}>
          <Icon name="title" size={22} color="#FF9800" />
          <TextInput style={styles.input} placeholder={t("title")} value={title} onChangeText={setTitle} />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="description" size={22} color="#2196F3" />
          <TextInput style={styles.input} placeholder={t("description")} value={description} onChangeText={setDescription} multiline />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="attach-money" size={22} color="#4CAF50" />
          <TextInput style={styles.input} placeholder={t("price")} value={price} onChangeText={setPrice} keyboardType="numeric" />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="format-list-numbered" size={22} color="#673AB7" />
          <TextInput style={styles.input} placeholder={t("quantity")} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="location-on" size={22} color="#E91E63" />
          <TextInput style={styles.input} placeholder={t("location")} value={location} onChangeText={setLocation} />
        </View>

        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Icon name="image" size={20} color="#fff" />
          <Text style={styles.imageButtonText}>{t("pickImage")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCreateListing} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="check-circle" size={20} color="#fff" />}
          <Text style={styles.buttonText}>{loading ? t("uploading") : t("create")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    width: "100%",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  imageButton: {
    flexDirection: "row",
    backgroundColor: "#009688",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: "100%",
  },
  imageButtonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 10,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#388E3C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 10,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});