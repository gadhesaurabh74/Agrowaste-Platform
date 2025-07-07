import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NotificationContext } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

const BuyerHeader = () => {
  const navigation = useNavigation();
  const { notifications } = useContext(NotificationContext);
  const { user } = useAuth();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.header}>
      {/* Drawer Menu */}
      <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.button}>
        <Ionicons name="menu" size={28} color="#007bff" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Marketplace</Text>

      {/* Right Section */}
      <View style={styles.right}>
        {/* Notifications */}
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")} style={styles.button}>
          <MaterialIcons name="notifications" size={24} color={unreadCount > 0 ? "#ff4d4d" : "#555"} />
          {unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>}
        </TouchableOpacity>

        {/* Profile Image in the Right Corner */}
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.profileContainer}>
          {user?.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <FontAwesome name="user-circle" size={40} color="#ddd" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 3,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    position: "relative",
    marginLeft: 15,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4d4d",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  profileContainer: {
    marginLeft: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default BuyerHeader;