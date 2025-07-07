import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as Speech from "expo-speech";
import i18n from "../config/i18n";

const genAI = new GoogleGenerativeAI("AIzaSyDHSqtbTgyu2DuAHhIHYB_H8Nzs8_Hf1hA");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const languageMap = {
  English: { code: "en", tts: "en-US" },
  हिन्दी: { code: "hi", tts: "hi-IN" },
  मराठी: { code: "mr", tts: "mr-IN" },
};

const AISuggestions = () => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("English");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [_, forceRender] = useState(0);

  useFocusEffect(
    useCallback(() => {
      forceRender((prev) => prev + 1); // Triggers a re-render on focus
    }, [])
  );

  const handleAskAI = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponse("");

    const prompt = `Answer in ${language}: How can the following agricultural waste be used or recycled? Waste: ${query}`;

    try {
      const result = await model.generateContent(prompt);
      const aiText = result.response.text() || i18n.t("no_response");
      setResponse(formatResponse(aiText));
    } catch (error) {
      setResponse(i18n.t("error_response"));
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text: string) => {
    return text
      .replace(/\n(\d+\.)\s/g, "\n\n$1 ")
      .replace(/\n\*\s\*\*(.*?)\*\*/g, "\n🔹 $1:")
      .replace(/\n\*\s(.*?)/g, "\n⏺️ $1")
      .replace(/\*\*(.*?)\*\*/g, "$1");
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else if (response) {
      Speech.speak(response, {
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        language: languageMap[language].tts,
      });
      setIsSpeaking(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{i18n.t("ai_suggestions_title")}</Text>
        <MaterialIcons name="eco" size={28} color="#28a745" />
      </View>

      {/* Language Selection */}
      <View style={styles.languageSelector}>
        {Object.keys(languageMap).map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[styles.languageButton, language === lang && styles.selectedLanguage]}
            onPress={() => {
              setLanguage(lang);
              i18n.locale = languageMap[lang].code;
            }}
          >
            <Text style={styles.languageText}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <FontAwesome name="leaf" size={22} color="#28a745" />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("waste_input_placeholder")}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Ask AI Button */}
      <TouchableOpacity style={styles.askButton} onPress={handleAskAI}>
        <Ionicons name="chatbubbles" size={24} color="white" />
        <Text style={styles.askButtonText}>{i18n.t("ask_ai_button")}</Text>
      </TouchableOpacity>

      {/* Response Area */}
      <ScrollView style={styles.responseContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          response ? <Text style={styles.responseText}>{response}</Text> : <Text style={styles.hintText}>{i18n.t("ai_response_placeholder")}</Text>
        )}
      </ScrollView>

      {/* Speak Button */}
      {response !== "" && !loading && (
        <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
          <Entypo name={isSpeaking ? "controller-stop" : "controller-play"} size={24} color="#fff" />
          <Text style={styles.speakButtonText}>{isSpeaking ? i18n.t("stop") : i18n.t("listen")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 15 },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#333", marginRight: 10 },
  languageSelector: { flexDirection: "row", justifyContent: "center", marginBottom: 15 },
  languageButton: { padding: 10, marginHorizontal: 5, backgroundColor: "#ddd", borderRadius: 20 },
  selectedLanguage: { backgroundColor: "#007bff" },
  languageText: { fontSize: 16, fontWeight: "bold", color: "white" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "white", padding: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 15 },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  askButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#007bff", padding: 12, borderRadius: 8, marginBottom: 20 },
  askButtonText: { color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 8 },
  responseContainer: { backgroundColor: "white", padding: 15, borderRadius: 10, minHeight: 150, maxHeight: 300 },
  responseText: { fontSize: 16, color: "#333" },
  hintText: { fontSize: 16, color: "#888", textAlign: "center" },
  speakButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#28a745", padding: 12, borderRadius: 8, marginTop: 20 },
  speakButtonText: { color: "white", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
});

export default AISuggestions;