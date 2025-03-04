import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ActivityIndicator, View } from "react-native";

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
    <AuthProvider>
      <NotificationProvider> 
        <AuthWrapper />
      </NotificationProvider>
    </AuthProvider>
  );
}