import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import FarmerDashboard from "./index";
import CreateListing from "./create-listing";
import MyListings from "./my-listings";
import ManageOffers from "./manage-offers";
import Profile from "./profile";
import SettingsScreen from "./settings";
import NotificationScreen from '../../(common)/notifications';
import { Ionicons } from "@expo/vector-icons";
import FarmerHeader from "../../components/FarmerHeader";
import { useTranslation } from "react-i18next";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawer}>
      <DrawerItem label={t("dashboard")} icon={() => <Ionicons name="home-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("Dashboard")} />
      <DrawerItem label={t("createListing")} icon={() => <Ionicons name="add-circle-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("Create Listing")} />
      <DrawerItem label={t("myListings")} icon={() => <Ionicons name="list-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("My Listings")} />
      <DrawerItem label={t("manageOffers")} icon={() => <Ionicons name="pricetag-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("Manage Offers")} />
      <DrawerItem label={t("profile")} icon={() => <Ionicons name="person-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("Profile")} />
      <DrawerItem label={t("notifications")} icon={() => <Ionicons name="notifications-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("Notifications")} />
      <DrawerItem label={t("settings")} icon={() => <Ionicons name="settings-outline" size={22} color="green" />} onPress={() => props.navigation.navigate("Settings")} />
      <DrawerItem label={t("logout")} icon={() => <Ionicons name="log-out-outline" size={22} color="red" />} onPress={logout} />
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
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    paddingTop: 20,
  },
});