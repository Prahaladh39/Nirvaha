import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import GreetingHeader from '../../components/home/GreetingHeader';
import EmotionChips from '../../components/home/EmotionChips';
import HeroCarousel from '../../components/home/HeroCarousel';
import CollectionRail from '../../components/home/CollectionRail';
import SoundRail from '../../components/home/SoundRail';
import CompactTilesGrid from '../../components/home/CompactTile';
import SmartActions from '../../components/home/SmartActions';

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <GreetingHeader />
        <EmotionChips />
        <HeroCarousel />
        <CollectionRail />
        <SoundRail />
        <CompactTilesGrid />
        <SmartActions />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Dark theme background
  },
  scrollContent: {
    paddingBottom: 40,
  }
});
