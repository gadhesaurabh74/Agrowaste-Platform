import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import i18n from "../../config/i18n";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons"; // Importing icon

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
      {/* Header with Icon */}
      <View style={styles.header}>
        <MaterialIcons name="settings" size={28} color="white" />
        <Text style={styles.title}>{t("settings")}</Text>
      </View>

      {/* Language Selection Card */}
      <View style={styles.card}>
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
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },

  /* Header */
  header: { 
    backgroundColor: "#2980b9", 
    paddingVertical: 15, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 10,
    borderRadius: 8
  },
  title: { 
    color: "white", 
    fontSize: 20, 
    fontWeight: "bold" 
  },

  /* Language Picker Card */
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  picker: { height: 55, width: "100%" },
});

export default SettingsScreen;