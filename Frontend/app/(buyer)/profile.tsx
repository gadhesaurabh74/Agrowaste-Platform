import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function IndustryProfile() {
  const { user, setUser, API_BASE_URL } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [image, setImage] = useState(user?.profileImage || null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [original, setOriginal] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/buyer/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setName(data.name);
      setPhone(data.phone);
      setLocation(data.location);
      setCompanyName(data.companyName);
      setImage(data.profileImage);
      setUser(data);
      setOriginal(data);
    } catch (e) {
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const form = new FormData();
      form.append("name", name);
      form.append("phone", phone);
      form.append("location", location);
      form.append("companyName", companyName);
      if (image && image !== user?.profileImage) {
        form.append("profileImage", { uri: image, name: "profile.jpg", type: "image/jpeg" });
      }
      const res = await fetch(`${API_BASE_URL}/api/buyer/profile`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: form });
      const data = await res.json();
      setUser(data);
      setOriginal(data);
      Alert.alert("Success", "Profile updated successfully");
      setEditing(false);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setName(original.name);
    setPhone(original.phone);
    setLocation(original.location);
    setCompanyName(original.companyName);
    setImage(original.profileImage);
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={pickImage} disabled={!editing} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <MaterialIcons name="person" size={50} color="gray" />
          )}
        </TouchableOpacity>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="user" size={20} color="#007AFF" style={styles.icon} />
            <TextInput value={name} onChangeText={setName} editable={editing} style={styles.input} placeholder="Full Name" />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call" size={20} color="#34C759" style={styles.icon} />
            <TextInput value={phone} onChangeText={setPhone} editable={editing} keyboardType="phone-pad" style={styles.input} placeholder="Phone Number" />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="location-on" size={20} color="#FF9500" style={styles.icon} />
            <TextInput value={location} onChangeText={setLocation} editable={editing} style={styles.input} placeholder="Location" />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="building" size={20} color="#AF52DE" style={styles.icon} />
            <TextInput value={companyName} onChangeText={setCompanyName} editable={editing} style={styles.input} placeholder="Company Name" />
          </View>
        </View>

        {editing ? (
          <View style={styles.buttons}>
            <TouchableOpacity onPress={updateProfile} style={styles.save} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Save</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelEdit} style={styles.cancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.edit}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F3F3F3", padding: 20 },
  card: { backgroundColor: "white", padding: 20, borderRadius: 15, width: "100%", maxWidth: 400, alignItems: "center", elevation: 5 },
  imageContainer: { width: 100, height: 100, borderRadius: 50, overflow: "hidden", backgroundColor: "#EAEAEA", justifyContent: "center", alignItems: "center", marginBottom: 15 },
  image: { width: 100, height: 100, borderRadius: 50 },
  form: { width: "100%", marginTop: 10 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 8, padding: 10, marginBottom: 10 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  buttons: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 15 },
  edit: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, width: "100%", alignItems: "center", marginTop: 10 },
  save: { backgroundColor: "#34C759", padding: 12, borderRadius: 8, flex: 1, marginRight: 5, alignItems: "center" },
  cancel: { backgroundColor: "#FF3B30", padding: 12, borderRadius: 8, flex: 1, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
});