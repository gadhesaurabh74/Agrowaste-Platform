import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useTranslation } from "react-i18next";

export default function YouTubeScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: "https://www.youtube.com/results?search_query=agricultural+waste+usage" }} 
        style={{ flex: 1 }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});