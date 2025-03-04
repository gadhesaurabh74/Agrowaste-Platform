import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NotificationContext } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

const FarmerHeader = () => {
  const navigation = useNavigation();
  const { notifications } = useContext(NotificationContext);
  const { user } = useAuth();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
        <Ionicons name="menu-outline" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.title}>Marketplace</Text>
      <View style={styles.right}>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")} style={styles.button}>
          <Text>Notifications ({unreadCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Align items vertically in the center
    backgroundColor: "white",
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  right: {
    flexDirection: "row",
    alignItems: "center", // Align items vertically in the center
  },
  button: {
    padding: 5,
    marginHorizontal: 3,
  },
  iconButton: {
    padding: 5,
    marginHorizontal: 3,
  },
});

export default FarmerHeader;