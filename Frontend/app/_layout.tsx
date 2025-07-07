import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ActivityIndicator, View } from "react-native";
import i18n from '../config/i18n'; // Import i18n config
import { I18nextProvider } from 'react-i18next';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name={user.role === "farmer" ? "(farmer)" : "(buyer)"} />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
};

export default function Layout() {
  return (
    <I18nextProvider i18n={i18n}>
    <AuthProvider>
      <NotificationProvider> 
        <AuthWrapper />
      </NotificationProvider>
    </AuthProvider>
    </I18nextProvider>
  );
}