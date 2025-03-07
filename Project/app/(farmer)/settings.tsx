// (farmer)/settings.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import i18n from "../../config/i18n";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const { t } = useTranslation();

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
        setSelectedLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Error loading language preference:", error);
    }
  };

  const handleLanguageChange = async (language: string) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
    try {
      await AsyncStorage.setItem("language", language);
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("settings")}</Text>
      <View style={styles.languageContainer}>
        <Text style={styles.label}>{t("language")}:</Text>
        <Picker
          selectedValue={selectedLanguage}
          style={styles.picker}
          onValueChange={handleLanguageChange}
        >
          <Picker.Item label={t("english")} value="en" />
          <Picker.Item label={t("marathi")} value="mr" />
          <Picker.Item label={t("hindi")} value="hi" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  languageContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  label: { fontSize: 16, marginRight: 10 },
  picker: { height: 55, width: 150 },
});

export default SettingsScreen;