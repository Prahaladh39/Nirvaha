import React from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' }}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  // If user is logged in, send them to the main app (tabs)
  // Otherwise, send them to the Welcome/Onboarding screen
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/pages/Welcome" />;
}
