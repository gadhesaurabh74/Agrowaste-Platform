import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Speech from "expo-speech";

const TutorialScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const slides = [
    {
      key: "one",
      title: t("tutorial.title1"),
      text: t("tutorial.text1"),
      image: require("../../assets/tutorial1.png"),
      backgroundColor: "#59b2ab",
    },
    {
      key: "two",
      title: t("tutorial.title2"),
      text: t("tutorial.text2"),
      image: require("../../assets/tutorial2.png"),
      backgroundColor: "#febe29",
    },
    {
      key: "three",
      title: t("tutorial.title3"),
      text: t("tutorial.text3"),
      image: require("../../assets/tutorial3.png"),
      backgroundColor: "#22bcb5",
    },
    {
      key: "four",
      title: t("tutorial.title4"),
      text: t("tutorial.text4"),
      image: require("../../assets/tutorial4.png"),
      backgroundColor: "#3399ff",
    },
  ];

  const speakCurrentSlide = () => {
    const current = slides[currentSlide];
    if (current) {
      Speech.stop();
      Speech.speak(`${current.title}. ${current.text}`, {
        language: i18n.language === "hi" ? "hi-IN" : "en-US",
        onDone: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
  };

  const handlePlayPause = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      speakCurrentSlide();
    }
  };

  const _renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />

          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>

            {/* Play/Pause Button */}
            <TouchableOpacity style={styles.speechButton} onPress={handlePlayPause}>
              <Ionicons name={isSpeaking ? "pause" : "play"} size={28} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  const _onDone = () => {
    Speech.stop();
    navigation.navigate("Dashboard");
  };

  const _onSlideChange = (index) => {
    setCurrentSlide(index);
    Speech.stop();
    setIsSpeaking(false);
  };

  return (
    <AppIntroSlider
      renderItem={_renderItem}
      data={slides}
      onDone={_onDone}
      onSlideChange={_onSlideChange}
      showSkipButton
      onSkip={_onDone}
      renderNextButton={() => <Ionicons name="arrow-forward" size={28} color="white" />}
      renderDoneButton={() => <Ionicons name="checkmark-done" size={28} color="white" />}
      activeDotStyle={{ backgroundColor: "white" }}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 80,
  },
  image: {
    width: Dimensions.get("window").width * 0.7,
    height: 350,
    marginBottom: 30,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingBottom: 40, // Extra space to avoid overlap with edges
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 30,
  },
  speechButton: {
    marginTop: 10,
    backgroundColor: "#00000070",
    padding: 15,
    borderRadius: 50,
    alignSelf: "center",
  },
});

export default TutorialScreen;