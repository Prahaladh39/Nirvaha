import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function TrustBar() {
  return (
    <View style={styles.container}>
      <ShieldCheck size={16} color={theme.colors.primary} />
      <Text style={styles.text}>Your data is secured and encrypted</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    opacity: 0.8,
  },
  text: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
});
