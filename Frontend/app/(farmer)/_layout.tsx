import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAuth } from "../../context/AuthContext";
import FarmerDashboard from "./index";
import CreateListing from "./create-listing";
import MyListings from "./my-listings";
import ManageOffers from "./manage-offers";
import Profile from "./profile";
import SettingsScreen from "./settings";
import NotificationScreen from "../../(common)/notifications";
import AISuggestions from "../../(common)/AISuggestions";
import YouTubeScreen from "./youtube"; // Import the new YouTube screen
import TutorialScreen from "./tutorial";
import { Ionicons } from "@expo/vector-icons";
import FarmerHeader from "../../components/FarmerHeader";
import { useTranslation } from "react-i18next";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawer}>
      {/* User Profile Section */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: user?.profileImage || "https://via.placeholder.com/80" }} style={styles.profileImage} />
        <Text style={styles.profileName}>{user?.name || "Farmer Name"}</Text>
        <Text style={styles.profileDetails}>{user?.phone || "Phone"}</Text>
        <Text style={styles.profileDetails}>{user?.location || "Location"}</Text>
        <Text style={styles.profileDetails}>{user?.email || "Email"}</Text>
      </View>

      {/* Drawer Items */}
      <DrawerItem label={t("dashboard")} icon={() => <Ionicons name="home" size={24} color="#2D9CDB" />} onPress={() => props.navigation.navigate("Dashboard")} />
      <DrawerItem label={t("createListing")} icon={() => <Ionicons name="add-circle" size={24} color="#27AE60" />} onPress={() => props.navigation.navigate("Create Listing")} />
      <DrawerItem label={t("myListings")} icon={() => <Ionicons name="list" size={24} color="#F2994A" />} onPress={() => props.navigation.navigate("My Listings")} />
      <DrawerItem label={t("manageOffers")} icon={() => <Ionicons name="pricetag" size={24} color="#9B51E0" />} onPress={() => props.navigation.navigate("Manage Offers")} />
      <DrawerItem label={t("profile")} icon={() => <Ionicons name="person" size={24} color="#EB5757" />} onPress={() => props.navigation.navigate("Profile")} />
      <DrawerItem label={t("notifications")} icon={() => <Ionicons name="notifications" size={24} color="#F2C94C" />} onPress={() => props.navigation.navigate("Notifications")} />
      <DrawerItem
        label={t("Tutorial")}
        icon={() => <Ionicons name="book" size={24} color="#2F80ED" />}
        onPress={() => props.navigation.navigate("Tutorial")}
      />
      <DrawerItem label={t("settings")} icon={() => <Ionicons name="settings" size={24} color="#56CCF2" />} onPress={() => props.navigation.navigate("Settings")} />

      {/* AI Suggestions Feature */}
      <DrawerItem label={t("aiSuggestions")} icon={() => <Ionicons name="bulb" size={24} color="#FF5733" />} onPress={() => props.navigation.navigate("AI Suggestions")} />

      {/* YouTube Section */}
      <DrawerItem label={t("YouTube")} icon={() => <Ionicons name="logo-youtube" size={24} color="red" />} onPress={() => props.navigation.navigate("YouTube")} />

      {/* Logout Button */}
      <DrawerItem label={t("logout")} icon={() => <Ionicons name="log-out" size={24} color="red" />} onPress={logout} />
    </DrawerContentScrollView>
  );
};

export default function FarmerLayout() {
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />} 
      screenOptions={{ 
        header: () => <FarmerHeader />, 
        drawerActiveTintColor: "#2D9CDB",
        drawerLabelStyle: { fontSize: 16, fontWeight: "bold" },
      }}
    >
      <Drawer.Screen name="Dashboard" component={FarmerDashboard} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="Create Listing" component={CreateListing} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="My Listings" component={MyListings} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="Manage Offers" component={ManageOffers} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="Profile" component={Profile} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="Notifications" component={NotificationScreen} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="Tutorial" component={TutorialScreen} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="AI Suggestions" component={AISuggestions} options={{ drawerItemStyle: { display: "none" } }} />

      {/* YouTube Screen */}
      <Drawer.Screen name="YouTube" component={YouTubeScreen} options={{ drawerItemStyle: { display: "none" } }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    paddingTop: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: "#F2F2F2",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileDetails: {
    fontSize: 14,
    color: "#555",
  },
});