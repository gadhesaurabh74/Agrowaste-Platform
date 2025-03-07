// components/TextToSpeech.tsx
import React from 'react';
import * as Speech from 'expo-speech';
import { View, Button } from 'react-native';
import i18n from '../config/i18n'; // Adjust the path as necessary

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
    <View>
      <Button title="Speak" onPress={speak} />
    </View>
  );
};

export default TextToSpeech;