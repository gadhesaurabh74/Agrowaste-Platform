import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons"; // Icons

export default function ProfileScreen() {
  const { user, setUser, logout, API_BASE_URL } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/farmer/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
      setName(data.name);
      setLocation(data.location);
      setEmail(data.email);
      setPhone(data.phone);
      setImage(data.profileImage);
    } catch (e) {
      Alert.alert(t("error"), t("failed"));
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const form = new FormData();
      form.append("name", name);
      form.append("location", location);
      form.append("email", email);
      form.append("phone", phone);
      if (image) form.append("profileImage", { uri: image, name: "profile.jpg", type: "image/jpeg" });
      const res = await fetch(`${API_BASE_URL}/api/farmer/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      setProfile(data);
      setUser(data);
      setEditing(false);
      Alert.alert(t("success"), t("updated"));
    } catch (e) {
      Alert.alert(t("error"), t("failed"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#2ecc71" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t("profile")}</Text>

      {/* Profile Image or Icon */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <FontAwesome name="user-circle" size={100} color="#3498db" />
        )}
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>{t("changePhoto")}</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Fields */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <FontAwesome name="user" size={22} color="#e67e22" style={styles.icon} />
          <TextInput style={styles.input} value={name} onChangeText={setName} editable={editing} placeholder={t("name")} />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="location-outline" size={22} color="#27ae60" style={styles.icon} />
          <TextInput style={styles.input} value={location} onChangeText={setLocation} editable={editing} placeholder={t("location")} />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="phone" size={22} color="#2980b9" style={styles.icon} />
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} editable={editing} keyboardType="phone-pad" placeholder={t("phone")} />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="email" size={22} color="#c0392b" style={styles.icon} />
          <TextInput style={styles.input} value={email} onChangeText={setEmail} editable={editing} keyboardType="email-address" placeholder={t("email")} />
        </View>

        {!editing ? (
          <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
            <Text style={styles.buttonText}>{t("edit")}</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
              <Text style={styles.buttonText}>{t("save")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
              <Text style={styles.buttonText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>{t("logout")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#2c3e50" },
  imageContainer: { position: "relative", marginBottom: 20, alignItems: "center" },
  image: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: "#3498db" },
  imageButton: { marginTop: 10, backgroundColor: "#2980b9", padding: 8, borderRadius: 5 },
  imageButtonText: { color: "#fff", fontWeight: "bold" },
  form: { width: "100%" },
  inputGroup: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#bdc3c7", padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: "#ecf0f1" },
  icon: { marginRight: 10 },
  input: { flex: 1 },
  editButton: { backgroundColor: "#f39c12", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  saveButton: { backgroundColor: "#27ae60", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  cancelButton: { backgroundColor: "#95a5a6", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  logoutButton: { backgroundColor: "#e74c3c", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});