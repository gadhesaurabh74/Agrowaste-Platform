import React from "react";
import * as Speech from "expo-speech";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import i18n from "../config/i18n"; // Adjust the path if necessary

interface TextToSpeechProps {
  text: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text }) => {
  const speak = () => {
    Speech.speak(text, {
      language: i18n.language,
      pitch: 1,
      rate: 1,
    });
  };

  return (
    <TouchableOpacity onPress={speak} style={styles.button}>
      <MaterialIcons name="volume-up" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2D9CDB", // Blue color for visibility
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    elevation: 5, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default TextToSpeech;