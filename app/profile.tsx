import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import ProfileHeader from '../components/profile/ProfileHeader';
import JourneyCard from '../components/profile/JourneyCard';
import PersonalStats from '../components/profile/PersonalStats';
import SettingsSection from '../components/profile/SettingsSection';
import BottomNav from '../components/navigation/BottomNav';
import { theme } from '../constants/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Animated.View 
        entering={FadeIn.duration(400)}
        style={styles.content}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileHeader />
          <JourneyCard />
          <PersonalStats />
          <SettingsSection />

          <Text style={styles.footerQuote}>
            "Your space, your pace"
          </Text>
        </ScrollView>
      </Animated.View>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // For BottomNav
  },
  footerQuote: {
    fontFamily: theme.typography.display,
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: 40,
  }
});
