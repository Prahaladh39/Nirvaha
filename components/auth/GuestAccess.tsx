import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { router } from 'expo-router';

export default function GuestAccess() {
  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      <Pressable style={styles.guestButton} onPress={() => router.replace('/')}>
        <Text style={styles.guestButtonText}>Continue as Guest</Text>
        <ArrowRight size={16} color={theme.colors.foreground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
  },
  dividerText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: theme.colors.mutedForeground,
    paddingHorizontal: 16,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  guestButtonText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.foreground,
  },
});
