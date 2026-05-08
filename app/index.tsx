import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
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
