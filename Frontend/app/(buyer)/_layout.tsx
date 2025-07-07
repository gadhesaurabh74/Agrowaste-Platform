import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import BuyerDashboard from "./index";
import BrowseListings from "./browse";
import MyOffers from "./my-offers";
import Profile from "./profile";
import NotificationScreen from "../../(common)/notifications";
import { Ionicons } from "@expo/vector-icons";
import BuyerHeader from "../../components/BuyerHeader";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.profile}>
        {user?.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.image} />
        ) : (
          <Ionicons name="person-circle-outline" size={60} color="black" />
        )}
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <View style={styles.items}>
        <DrawerItemList {...props} />
        <DrawerItem label="Logout" onPress={logout} icon={({ size }) => <Ionicons name="log-out-outline" size={size} color="red" />} />
      </View>
    </DrawerContentScrollView>
  );
};

export default function BuyerLayout() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ header: () => <BuyerHeader /> }}>
      <Drawer.Screen name="Dashboard" component={BuyerDashboard} options={{ drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Browse Listings" component={BrowseListings} options={{ drawerIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="My Offers" component={MyOffers} options={{ drawerIcon: ({ color, size }) => <Ionicons name="pricetag-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Profile" component={Profile} options={{ drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="Notifications" component={NotificationScreen} options={{ drawerIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} /> }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profile: { backgroundColor: "#eee", padding: 20, alignItems: "center" },
  image: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: "white" },
  name: { fontSize: 18, fontWeight: "600", marginTop: 10 },
  email: { fontSize: 14, color: "#555", marginTop: 5 },
  items: { flex: 1, paddingTop: 15 },
});