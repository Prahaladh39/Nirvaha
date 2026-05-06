import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInLeft, FadeInRight, FadeInUp, FadeOutLeft, FadeOutRight } from 'react-native-reanimated';
import { ParticleOverlay } from '../../components/ParticleOverlay';
import CreateAccountForm from '../../components/auth/CreateAccountForm';

import SignInForm from '../../components/auth/SignInForm';
import TrustBar from '../../components/auth/TrustBar';
import { theme } from '../../constants/theme';
import o1 from './images/nirvaha-logo.png';
const { width } = Dimensions.get('window');

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'create'>('signin');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Stack.Screen options={{ headerShown: false }} />

          <ParticleOverlay />

          {/* Ambient orbs */}
          <View style={[styles.ambientOrb, { width: 340, height: 340, top: '10%', left: '5%', backgroundColor: theme.colors.healingGreen }]} />
          <View style={[styles.ambientOrb, { width: 280, height: 280, bottom: '5%', right: '8%', backgroundColor: theme.colors.gold }]} />
          <View style={[styles.ambientOrb, { width: 180, height: 180, top: '50%', right: '25%', backgroundColor: theme.colors.healingGreenLight, opacity: 0.1 }]} />

          <Animated.View entering={FadeInUp.duration(700)} style={styles.contentWrapper}>

            {/* Logo & Welcome */}
            <View style={styles.headerContainer}>
              <Image
                source={o1}
                style={styles.logo}
                resizeMode="contain"
              />
              <Animated.Text
                key={activeTab}
                entering={FadeInUp.duration(400).delay(100)}
                style={styles.subtitle}
              >
                {activeTab === 'signin'
                  ? 'Welcome back to your inner balance'
                  : 'Begin your journey with clarity and calm'}
              </Animated.Text>
            </View>

            {/* Demo Notice
            <View style={styles.demoNotice}>
              <Text style={styles.demoNoticeText}>
                <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>Demo mode: </Text>
                Authentication is not yet connected. Credentials you enter here are validated locally and are <Text style={{ textDecorationLine: 'underline' }}>not stored or sent anywhere</Text>.
              </Text>
            </View> */}

            {/* Glass Card */}
            <View style={styles.glassCard}>

              {/* Tab Switcher */}
              <View style={styles.tabSwitcher}>
                <Pressable
                  onPress={() => setActiveTab('signin')}
                  style={[styles.tabItemContainer, activeTab === 'signin' && styles.tabItemContainerActive]}
                >
                  <Text style={[styles.tabItemText, activeTab === 'signin' && styles.tabItemTextActive]}>
                    Sign In
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab('create')}
                  style={[styles.tabItemContainer, activeTab === 'create' && styles.tabItemContainerActive]}
                >
                  <Text style={[styles.tabItemText, activeTab === 'create' && styles.tabItemTextActive]}>
                    Create Account
                  </Text>
                </Pressable>
              </View>

              {/* Form Area */}
              <View style={styles.formContainer}>
                {activeTab === 'signin' ? (
                  <Animated.View key="signin" entering={FadeInLeft.duration(300)} exiting={FadeOutRight.duration(300)}>
                    <SignInForm />
                  </Animated.View>
                ) : (
                  <Animated.View key="create" entering={FadeInRight.duration(300)} exiting={FadeOutLeft.duration(300)}>
                    <CreateAccountForm />
                  </Animated.View>
                )}
              </View>
            </View>


            <TrustBar />

          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
    minHeight: '100%',
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
    filter: 'blur(60px)',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 420,
    zIndex: 10,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 160,
    height: 64,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: theme.colors.mutedForeground,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  demoNotice: {
    backgroundColor: 'rgba(45, 90, 76, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    width: '100%',
  },
  demoNoticeText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: theme.colors.foreground,
    opacity: 0.9,
    lineHeight: 18,
  },
  glassCard: {
    backgroundColor: '#EEF1EB', // Match the solid card color from the image instead of transparent glass
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  tabSwitcher: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#E6EBE4', // A slightly darker shade than the card
    borderRadius: 20,
    padding: 4,
  },
  tabItemContainer: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemContainerActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tabItemText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 15,
    color: theme.colors.mutedForeground,
  },
  tabItemTextActive: {
    color: theme.colors.foreground,
  },
  formContainer: {
    minHeight: 250, // To prevent layout jumps when switching tabs
  },
});
