import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function RoleSelection() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#F5F5F5", "#E3F2FD"]} style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>

      <Pressable style={({ pressed }) => [styles.button, styles.farmerButton, pressed && styles.pressed]} onPress={() => router.push("/(auth)/farmer/login")}>
        <Ionicons name="leaf" size={30} color="#1B5E20" />
        <Text style={styles.buttonText}>Farmer</Text>
      </Pressable>

      <Pressable style={({ pressed }) => [styles.button, styles.buyerButton, pressed && styles.pressed]} onPress={() => router.push("/(auth)/buyer/login")}>
        <Ionicons name="cart" size={30} color="#FF6F00" />
        <Text style={styles.buttonText}>Buyer</Text>
      </Pressable>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
        <Ionicons name="arrow-back-outline" size={24} color="#1976D2" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#37474F",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  button: {
    flexDirection: "row",
    width: "85%",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  farmerButton: {
    backgroundColor: "#A5D6A7",
  },
  buyerButton: {
    backgroundColor: "#FFCC80",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#263238",
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.8,
  },
  backButton: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
    color: "#1976D2",
  },
});