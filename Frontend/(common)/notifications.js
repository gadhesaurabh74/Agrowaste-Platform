import { View, Text, StyleSheet } from "react-native";
import NotificationList from "../components/NotificationList";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons"; // Icon for header

const NotificationsScreen = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Header with Icon */}
      <View style={styles.header}>
        <MaterialIcons name="notifications-active" size={28} color="white" />
        <Text style={styles.title}>{t("notifications")}</Text>
      </View>

      {/* Notifications List */}
      <NotificationList />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  /* Header */
  header: { 
    backgroundColor: "#2980b9", 
    paddingVertical: 15, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 10 
  },
  title: { 
    color: "white", 
    fontSize: 20, 
    fontWeight: "bold", 
    textAlign: "center" 
  },
});