import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NotificationContext } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const BuyerHeader = () => {
  const navigation = useNavigation();
  const { notifications } = useContext(NotificationContext);
  const { user } = useAuth();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.button}>
        <Ionicons name="menu-outline" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.title}>Marketplace</Text>
      <View style={styles.right}>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")} style={styles.button}>
          <Text>Notifications ({unreadCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.button}>
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
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 5,
    marginHorizontal: 3,
  },
});

export default BuyerHeader;