import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, setUser, logout } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/farmer/profile", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setProfile(data);
      setName(data.name);
      setLocation(data.location);
      setEmail(data.email);
      setPhone(data.phone);
      setImage(data.profileImage);
    } catch (e) { Alert.alert("Error", "Failed"); } finally { setLoading(false); }
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
      const res = await fetch("http://localhost:5000/api/farmer/profile", { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: form });
      const data = await res.json();
      setProfile(data);
      setUser(data);
      setEditing(false);
      Alert.alert("Success", "Updated");
    } catch (e) { Alert.alert("Error", "Failed"); } finally { setLoading(false); }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.imageContainer}>
        <Image source={image ? { uri: image } : ""} style={styles.image} />
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}><Text>Image</Text></TouchableOpacity>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} editable={editing} />
        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} editable={editing} />
        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} editable={editing} keyboardType="phone-pad" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} editable={editing} keyboardType="email-address" />
        {!editing ? (
          <TouchableOpacity style={styles.edit} onPress={() => setEditing(true)}><Text>Edit</Text></TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.save} onPress={updateProfile}><Text>Save</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancel} onPress={() => setEditing(false)}><Text>Cancel</Text></TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.logout} onPress={logout}><Text>Logout</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", flexGrow: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  imageContainer: { position: "relative", marginBottom: 15 },
  image: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: "#ccc" },
  imageButton: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#ddd", padding: 5, borderRadius: 5 },
  form: { width: "100%" },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  edit: { backgroundColor: "blue", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  save: { backgroundColor: "green", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  cancel: { backgroundColor: "#ccc", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  logout: { backgroundColor: "red", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
});