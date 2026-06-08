import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import Toast from 'react-native-toast-message';
import { theme } from '../../constants/theme';

interface EmotionDef {
  label: string;
  image: any;
}

const emotions: EmotionDef[] = [
  { label: "Balance", image: require('../../assets/images/moods/balance.jpg') },
  { label: "Bliss", image: require('../../assets/images/moods/bliss.jpg') },
  { label: "Calm", image: require('../../assets/images/moods/calm.jpg') },
  { label: "Clarity", image: require('../../assets/images/moods/clarity.jpg') },
  { label: "Energy", image: require('../../assets/images/moods/energy.jpg') },
  { label: "Focus", image: require('../../assets/images/moods/focus.jpg') },
  { label: "Gratitude", image: require('../../assets/images/moods/gratitude.jpg') },
  { label: "Reflection", image: require('../../assets/images/moods/refelection.jpg') },
];

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
        <Image 
          source={emotion.image} 
          style={[styles.emotionImage, isSelected && styles.selectedImage]} 
        />
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
  emotionImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedImage: {
    borderColor: 'rgba(212, 175, 55, 0.8)',
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
