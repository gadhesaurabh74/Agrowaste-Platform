import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace(user?.role === "farmer" ? "/(farmer)/" : "/(buyer)/");
    }
  }, [user, loading]);

  if (loading) return null;

  return (
    <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <Image source={require("../assets/logo.webp")} style={styles.logo} />
      <Text style={styles.title}>AgroWaste</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/(auth)/role-selection")}
      >
        <Ionicons name="log-in-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
});