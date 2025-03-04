import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import FarmerDashboard from "./index";
import CreateListing from "./create-listing";
import MyListings from "./my-listings";
import ManageOffers from "./manage-offers";
import Profile from "./profile";
import NotificationScreen from '../../(common)/notifications';
import { Ionicons } from "@expo/vector-icons";
import FarmerHeader from "../../components/FarmerHeader";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { logout } = useAuth();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawer}>
      <DrawerItem label="Dashboard" icon={() => <Ionicons name="home-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("Dashboard")} />
      <DrawerItem label="Create Listing" icon={() => <Ionicons name="add-circle-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("Create Listing")} />
      <DrawerItem label="My Listings" icon={() => <Ionicons name="list-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("My Listings")} />
      <DrawerItem label="Manage Offers" icon={() => <Ionicons name="pricetag-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("Manage Offers")} />
      <DrawerItem label="Profile" icon={() => <Ionicons name="person-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("Profile")} />
      <DrawerItem label="Notifications" icon={() => <Ionicons name="notifications-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("Notifications")} />
      <DrawerItem label="Logout" icon={() => <Ionicons name="log-out-outline" size={22} color="red" />} onPress={logout} />
    </DrawerContentScrollView>
  );
};

export default function FarmerLayout() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ header: () => <FarmerHeader />, drawerActiveTintColor: "green" }}>
      <Drawer.Screen name="Dashboard" component={FarmerDashboard} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="Create Listing" component={CreateListing} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="My Listings" component={MyListings} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="Manage Offers" component={ManageOffers} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="Profile" component={Profile} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="Notifications" component={NotificationScreen} options={{ drawerItemStyle: { display: 'none' } }}/>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    paddingTop: 20,
  },
});