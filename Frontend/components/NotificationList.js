import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { useTranslation } from "react-i18next";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; // Icons

const NotificationList = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useContext(NotificationContext);
  const { t } = useTranslation();

  // Function to determine icon and color based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <FontAwesome name="check-circle" size={24} color="#2ecc71" />;
      case "error":
        return <MaterialIcons name="error" size={24} color="#e74c3c" />;
      case "warning":
        return <MaterialIcons name="warning" size={24} color="#f39c12" />;
      default:
        return <FontAwesome name="info-circle" size={24} color="#3498db" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Mark All as Read Button */}
      {notifications.length > 0 && (
        <TouchableOpacity style={styles.markAll} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>{t("markAllRead")}</Text>
        </TouchableOpacity>
      )}

      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.item, item.isRead ? styles.read : styles.unread]}>
            {/* Icon & Message */}
            <View style={styles.iconContainer}>{getNotificationIcon(item.type)}</View>

            {/* Notification Content */}
            <TouchableOpacity style={styles.content} onPress={() => markAsRead(item._id)}>
              <Text style={styles.message}>{item.message}</Text>
              {!item.isRead && <Text style={styles.unreadText}>{t("unread")}</Text>}
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity onPress={() => deleteNotification(item._id)} style={styles.deleteButton}>
              <MaterialIcons name="delete" size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default NotificationList;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", paddingTop: 10 },
  
  /* Mark All as Read */
  markAll: { backgroundColor: "#2980b9", padding: 10, borderRadius: 8, alignSelf: "center", marginBottom: 10 },
  markAllText: { color: "white", fontWeight: "bold", fontSize: 14 },

  /* Notification Item */
  item: { 
    flexDirection: "row", 
    backgroundColor: "white", 
    padding: 15, 
    marginHorizontal: 10, 
    marginVertical: 5, 
    borderRadius: 8, 
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2, // Android shadow
  },

  unread: { borderLeftWidth: 4, borderLeftColor: "#3498db" },
  read: { borderLeftWidth: 4, borderLeftColor: "#bdc3c7" },

  /* Icon */
  iconContainer: { width: 30, marginRight: 15 },

  /* Notification Text */
  content: { flex: 1 },
  message: { fontSize: 16, fontWeight: "600", color: "#2c3e50" },
  unreadText: { color: "#e74c3c", fontSize: 12, marginTop: 4 },

  /* Delete Button */
  deleteButton: { padding: 8 },
});