import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
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
      <ImageBackground
        source={require("../assets/front.webp")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <Text style={styles.title}>AgroWaste Marketplace</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(auth)/role-selection")}
        >
          <Ionicons name="log-in-outline" size={28} color="white" />
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay for readability
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#ff9800",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});