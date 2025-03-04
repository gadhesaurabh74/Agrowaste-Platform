import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RoleSelection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Role</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(auth)/farmer/login")}>
        <Ionicons name="leaf-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Farmer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(auth)/buyer/login")}>
        <Ionicons name="cart-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Buyer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
        <Ionicons name="arrow-back-outline" size={20} color="green" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
  backButton: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "green",
  },
  backButtonText: {
    color: "green",
    marginLeft: 10,
  },
});