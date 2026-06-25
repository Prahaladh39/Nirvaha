import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import WellnessCard from './WellnessCard';
import AiHeroCard from './AiHeroCard';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // For this translation, we're just using the WellnessCard as the primary hero card,
  const slides = [<AiHeroCard key="1" />, <WellnessCard key="2" />];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slideComponent, index) => (
          <View key={index} style={styles.slideWrapper}>
            {slideComponent}
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot
            ]}
          />
        ))}
      </View>
      
      <Text style={styles.disclaimerText}>
        Private • Anonymous • Not a substitute for medical care
      </Text>
    </View>
  );
}

import { Text } from 'react-native'; // Added import for Text

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  slideWrapper: {
    width: width, // Full width to snap
    alignItems: 'center', // Center the card
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeDot: {
    width: 16,
    backgroundColor: theme.colors.healingGreen,
  },
  disclaimerText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 14,
  }
});
