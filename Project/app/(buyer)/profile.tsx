import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      Alert.alert("Error", "Failed");
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
      Alert.alert("Success", "Updated");
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
          {image ? <Image source={{ uri: image }} style={styles.image} /> : <Text>Image</Text>}
        </TouchableOpacity>
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput value={name} onChangeText={setName} editable={editing} style={styles.input} />
          <Text style={styles.label}>Phone</Text>
          <TextInput value={phone} onChangeText={setPhone} editable={editing} keyboardType="phone-pad" style={styles.input} />
          <Text style={styles.label}>Location</Text>
          <TextInput value={location} onChangeText={setLocation} editable={editing} style={styles.input} />
          <Text style={styles.label}>Company</Text>
          <TextInput value={companyName} onChangeText={setCompanyName} editable={editing} style={styles.input} />
        </View>
        {editing ? (
          <View style={styles.buttons}>
            <TouchableOpacity onPress={updateProfile} style={styles.save} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text>Save</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelEdit} style={styles.cancel}><Text>Cancel</Text></TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.edit}><Text>Edit</Text></TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0", padding: 20 },
  card: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "100%", maxWidth: 400, alignItems: "center" },
  imageContainer: { width: 100, height: 100, borderRadius: 50, overflow: "hidden", backgroundColor: "#ddd", justifyContent: "center", alignItems: "center", marginBottom: 15 },
  image: { width: 100, height: 100, borderRadius: 50 },
  form: { width: "100%", marginTop: 10 },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10, marginBottom: 10 },
  buttons: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 15 },
  edit: { backgroundColor: "blue", padding: 10, borderRadius: 5, width: "100%", alignItems: "center" },
  save: { backgroundColor: "green", padding: 10, borderRadius: 5, flex: 1, marginRight: 5, alignItems: "center" },
  cancel: { backgroundColor: "red", padding: 10, borderRadius: 5, flex: 1, alignItems: "center" },
});