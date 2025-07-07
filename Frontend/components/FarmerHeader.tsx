import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NotificationContext } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"; // Importing colorful icons
import { useTranslation } from "react-i18next";

const FarmerHeader = () => {
  const navigation = useNavigation();
  const { notifications } = useContext(NotificationContext);
  const { user } = useAuth();
  const { t } = useTranslation();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const profileImage = user?.profileImage; // Fetch profile image if available

  return (
    <View style={styles.header}>
      {/* Menu Button - Green Color */}
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
        <Ionicons name="menu" size={34} color="#2ecc71" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{t("marketplace")}</Text>

      {/* Icons Section */}
      <View style={styles.right}>
        {/* Notifications - Orange Color */}
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")} style={styles.notificationButton}>
          <Ionicons name="notifications" size={32} color="#e67e22" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Profile Image or Icon */}
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.profileContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <FontAwesome5 name="user-circle" size={34} color="#3498db" />
          )}
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
    backgroundColor: "#f5f6fa", // Light grey background for contrast
    paddingVertical: 14,
    paddingHorizontal: 15,
    elevation: 5, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d3436", // Dark gray for better visibility
    textTransform: "uppercase",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 5,
  },
  notificationButton: {
    padding: 5,
    position: "relative",
    marginRight: 12,
  },
  badge: {
    position: "absolute",
    right: -3,
    top: -3,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  profileContainer: {
    borderRadius: 50,
    overflow: "hidden",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
});

export default FarmerHeader;