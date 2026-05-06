import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import Toast from 'react-native-toast-message';
import { theme } from '../../constants/theme';

interface EmotionDef {
  label: string;
  color: string;
  shape: "circle" | "flower" | "blob" | "square" | "arch" | "hex" | "triangle" | "rounded-sq";
  face: "happy" | "serene" | "smile" | "sleepy" | "worried" | "spiral" | "bored" | "stressed" | "angry" | "side-eye" | "hurt" | "guilty";
}

const emotions: EmotionDef[] = [
  { label: "Excited", color: "hsl(330, 70%, 75%)", shape: "circle", face: "happy" },
  { label: "Joyful", color: "hsl(330, 80%, 68%)", shape: "flower", face: "serene" },
  { label: "Grateful", color: "hsl(270, 40%, 68%)", shape: "blob", face: "smile" },
  { label: "Calm", color: "hsl(270, 35%, 72%)", shape: "square", face: "sleepy" },
  { label: "Sensitive", color: "hsl(200, 85%, 60%)", shape: "arch", face: "worried" },
  { label: "Confused", color: "hsl(220, 70%, 55%)", shape: "hex", face: "spiral" },
  { label: "Bored", color: "hsl(150, 55%, 35%)", shape: "circle", face: "bored" },
  { label: "Stressed", color: "hsl(150, 50%, 40%)", shape: "triangle", face: "stressed" },
  { label: "Angry", color: "hsl(15, 80%, 55%)", shape: "rounded-sq", face: "angry" },
  { label: "Insecure", color: "hsl(20, 85%, 55%)", shape: "circle", face: "side-eye" },
  { label: "Hurt", color: "hsl(35, 80%, 60%)", shape: "blob", face: "hurt" },
  { label: "Guilty", color: "hsl(40, 85%, 58%)", shape: "square", face: "guilty" },
];

const getFaceElements = (face: EmotionDef["face"]) => {
  const color = "rgba(255,255,255,0.85)";
  const bg = "rgba(0,0,0,0.8)";
  switch (face) {
    case "happy":
      return (
        <G stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round">
          <Path d="M16 18 C16 18 18 14 22 14 C26 14 28 18 28 18" />
          <Path d="M14 22 C14 22 18 28 22 28 C26 28 30 22 30 22" />
        </G>
      );
    case "serene":
      return (
        <G stroke={color} strokeWidth="2" fill="none" strokeLinecap="round">
          <Path d="M15 19 C15 19 17 16 20 16" />
          <Path d="M29 19 C29 19 27 16 24 16" />
          <Path d="M17 25 C17 25 20 28 27 25" />
        </G>
      );
    case "smile":
      return (
        <G stroke={color} strokeWidth="2" fill="none" strokeLinecap="round">
          <Path d="M15 19 C15 19 17 16 20 16" />
          <Path d="M29 19 C29 19 27 16 24 16" />
          <Path d="M16 24 C16 24 19 28 22 28 C25 28 28 24 28 24" />
        </G>
      );
    case "sleepy":
      return (
        <G stroke={color} strokeWidth="2" fill="none" strokeLinecap="round">
          <Path d="M15 19 C15 19 17 16 20 16" />
          <Path d="M29 19 C29 19 27 16 24 16" />
          <Path d="M18 25 C18 25 20 27 22 27 C24 27 26 25 26 25" />
        </G>
      );
    case "worried":
      return (
        <G stroke={color} strokeWidth="2" strokeLinecap="round">
          <Line x1="16" y1="17" x2="20" y2="19" />
          <Line x1="28" y1="17" x2="24" y2="19" />
          <Path d="M18 26 C18 26 20 24 22 24 C24 24 26 26 26 26" fill="none" />
        </G>
      );
    case "spiral":
      return (
        <G>
          <Circle cx="17" cy="20" r="3" fill={color} opacity="0.8" />
          <Circle cx="17" cy="20" r="1.5" fill={bg} />
          <Circle cx="27" cy="20" r="3" fill={color} opacity="0.8" />
          <Path d="M27 20 C27 18 26 19 27 20 C28 21 26 22 27 20" stroke={color} strokeWidth="1.2" fill="none" />
          <Path d="M18 27 C18 27 20 25 22 25 C24 25 26 27 26 27" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
        </G>
      );
    case "bored":
      return (
        <G stroke={color} strokeLinecap="round">
          <Circle cx="17" cy="19" r="3" fill={bg} strokeWidth="1.5" />
          <Circle cx="17" cy="19" r="1.5" fill={color} strokeWidth="0" />
          <Circle cx="27" cy="19" r="3" fill={bg} strokeWidth="1.5" />
          <Circle cx="27" cy="19" r="1.5" fill={color} strokeWidth="0" />
          <Path d="M19 26 L25 26" strokeWidth="2" />
        </G>
      );
    case "stressed":
      return (
        <G stroke={color} strokeWidth="2" strokeLinecap="round">
          <Line x1="15" y1="16" x2="19" y2="19" />
          <Line x1="19" y1="16" x2="15" y2="19" />
          <Line x1="25" y1="16" x2="29" y2="19" />
          <Line x1="29" y1="16" x2="25" y2="19" />
          <Path d="M18 26 C18 28 22 28 22 26 C22 28 26 28 26 26" strokeWidth="1.8" fill="none" />
        </G>
      );
    case "angry":
      return (
        <G stroke={color} strokeWidth="2.2" strokeLinecap="round">
          <Line x1="14" y1="16" x2="19" y2="18" />
          <Line x1="30" y1="16" x2="25" y2="18" />
          <Path d="M19 26 L25 26" />
        </G>
      );
    case "side-eye":
      return (
        <G>
          <Circle cx="17" cy="20" r="3.5" fill={bg} stroke={color} strokeWidth="1.5" />
          <Circle cx="19" cy="20" r="1.8" fill={color} />
          <Circle cx="27" cy="20" r="3.5" fill={bg} stroke={color} strokeWidth="1.5" />
          <Circle cx="29" cy="20" r="1.8" fill={color} />
          <Path d="M20 27 L24 27" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </G>
      );
    case "hurt":
      return (
        <G stroke={color} strokeWidth="2" fill="none" strokeLinecap="round">
          <Path d="M15 18 C15 18 17 15 20 15" />
          <Path d="M29 18 C29 18 27 15 24 15" />
          <Path d="M18 27 C18 25 22 23 26 27" />
        </G>
      );
    case "guilty":
      return (
        <G>
          <Circle cx="17" cy="19" r="3" fill={bg} stroke={color} strokeWidth="1.5" />
          <Circle cx="18" cy="20" r="1.5" fill={color} />
          <Circle cx="27" cy="19" r="3" fill={bg} stroke={color} strokeWidth="1.5" />
          <Circle cx="28" cy="20" r="1.5" fill={color} />
          <Path d="M19 26 C19 26 21 28 22 28 C23 28 25 26 25 26" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </G>
      );
    default:
      return null;
  }
};

const getShapePath = (shape: EmotionDef["shape"]) => {
  switch (shape) {
    case "circle": return "M22 2 C33 2 42 11 42 22 C42 33 33 42 22 42 C11 42 2 33 2 22 C2 11 11 2 22 2Z";
    case "flower": return "M22 2 C28 2 30 8 32 12 C36 8 42 8 42 14 C42 20 36 22 32 22 C36 22 42 24 42 30 C42 36 36 36 32 32 C30 36 28 42 22 42 C16 42 14 36 12 32 C8 36 2 36 2 30 C2 24 8 22 12 22 C8 22 2 20 2 14 C2 8 8 8 12 12 C14 8 16 2 22 2Z";
    case "blob": return "M22 2 C32 2 38 6 40 14 C42 22 40 30 36 36 C32 42 24 42 18 40 C12 38 6 34 4 28 C2 22 2 14 6 8 C10 2 16 2 22 2Z";
    case "square": return "M8 2 L36 2 C40 2 42 4 42 8 L42 36 C42 40 40 42 36 42 L8 42 C4 42 2 40 2 36 L2 8 C2 4 4 2 8 2Z";
    case "arch": return "M6 42 L6 18 C6 9 13 2 22 2 C31 2 38 9 38 18 L38 42 Z";
    case "hex": return "M22 2 L38 12 L38 32 L22 42 L6 32 L6 12 Z";
    case "triangle": return "M22 2 L42 38 C42 40 41 42 39 42 L5 42 C3 42 2 40 2 38 Z";
    case "rounded-sq": return "M10 2 L34 2 C38 2 42 6 42 10 L42 34 C42 38 38 42 34 42 L10 42 C6 42 2 38 2 34 L2 10 C2 6 6 2 10 2Z";
    default: return "M22 2 C33 2 42 11 42 22 C42 33 33 42 22 42 C11 42 2 33 2 22 C2 11 11 2 22 2Z";
  }
};

export default function EmotionChips() {
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  
  const handleSelect = async (label: string) => {
    setSelected(label);
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, `users/${user.uid}/moodLogs`), {
          mood: label,
          timestamp: new Date().toISOString()
        });
        Toast.show({ type: 'success', text1: 'Mood logged', text2: 'Added to your wellness journey.' });
      } catch (e) {
        console.error("Error saving mood", e);
      }
    }
  };

  const visibleEmotions = expanded ? emotions : emotions.slice(0, 4);

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {visibleEmotions.map((e, i) => {
          const isSelected = selected === e.label;
          return <EmotionItem key={e.label} emotion={e} isSelected={isSelected} onPress={() => handleSelect(e.label)} />;
        })}

        <Pressable 
          style={styles.moreButtonWrapper}
          onPress={() => setExpanded(!expanded)}
        >
          <View style={styles.moreButton}>
            <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
          </View>
          <Text style={styles.emotionText}>{expanded ? "Less" : "More"}</Text>
        </Pressable>
      </ScrollView>
    </Animated.View>
  );
}

function EmotionItem({ emotion, isSelected, onPress }: { emotion: EmotionDef, isSelected: boolean, onPress: () => void }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isSelected ? 1.15 : 1, { damping: 15 }) },
        { translateY: withSpring(isSelected ? -4 : 0, { damping: 15 }) }
      ]
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.emotionWrapper}>
      <Animated.View style={[animatedStyle, { opacity: isSelected ? 1 : 0.85 }]}>
        <Svg width="56" height="56" viewBox="0 0 44 44">
          <Path 
            d={getShapePath(emotion.shape)} 
            fill={emotion.color} 
            stroke={isSelected ? "rgba(255,255,255,0.3)" : "none"}
            strokeWidth={isSelected ? "1.5" : "0"}
          />
          {getFaceElements(emotion.face)}
        </Svg>
      </Animated.View>
      <Text style={[
        styles.emotionText, 
        isSelected && { color: '#FFFFFF', fontWeight: '600' }
      ]}>
        {emotion.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 8,
  },
  emotionWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  emotionText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  moreButtonWrapper: {
    alignItems: 'center',
    gap: 8,
    marginLeft: 4,
  },
  moreButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
