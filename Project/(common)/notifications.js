import { View, Text, StyleSheet } from "react-native";
import NotificationList from "../components/NotificationList";

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <NotificationList />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eee" },
  header: { backgroundColor: "blue", padding: 15 },
  title: { color: "white", fontSize: 18, fontWeight: "bold", textAlign: "center" },
});