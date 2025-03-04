import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

const NotificationList = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useContext(NotificationContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.markAll} onPress={markAllAsRead}>
        <Text style={styles.markAllText}>Mark All Read</Text>
      </TouchableOpacity>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.item, item.isRead ? styles.read : styles.unread]}>
            <TouchableOpacity style={styles.content} onPress={() => markAsRead(item._id)}>
              <Text style={styles.message}>{item.message}</Text>
              {!item.isRead && <Text style={styles.unreadText}>Unread</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteNotification(item._id)}><Text>Delete</Text></TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default NotificationList;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eee", paddingTop: 10 },
  markAll: { backgroundColor: "blue", padding: 10, borderRadius: 5, alignSelf: "center", marginBottom: 10 },
  markAllText: { color: "white", fontWeight: "bold" },
  item: { flexDirection: "row", backgroundColor: "white", padding: 10, marginHorizontal: 10, marginVertical: 5, borderRadius: 5, justifyContent: "space-between" },
  unread: { borderLeftWidth: 3, borderLeftColor: "blue" },
  read: { borderLeftWidth: 3, borderLeftColor: "#ccc" },
  content: { flex: 1 },
  message: { fontWeight: "bold" },
  unreadText: { color: "red", marginTop: 2 },
});