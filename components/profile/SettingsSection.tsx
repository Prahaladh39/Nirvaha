import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LogOut, Mail, ShieldAlert, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { theme } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsSection() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // After signOut, the onAuthStateChanged listener in the root layout
      // will detect user === null and redirect to /pages/Auth automatically.
      // We also call router.replace as an immediate navigation fallback.
      router.replace('/pages/Auth');
    } catch (error) {
      console.error('[SettingsSection] Logout error:', error);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(350)}
      style={styles.container}
    >
      <View style={styles.quickActions}>
        <Pressable 
          style={styles.quickActionBtn}
          onPress={() => router.push('/chat')}
        >
          <LinearGradient
            colors={['rgba(50, 140, 140, 0.1)', 'rgba(235, 185, 80, 0.06)']}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.quickActionTextPrimary}>Talk to Nirvaha</Text>
        </Pressable>
        
        <Pressable 
          style={styles.quickActionBtn}
          onPress={() => router.push('/(tabs)/journal')}
        >
          <LinearGradient
            colors={['rgba(235, 185, 80, 0.1)', 'rgba(142, 164, 150, 0.06)']}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.quickActionText}>Write a journal</Text>
        </Pressable>
      </View>

      <View style={styles.menuList}>
        <Pressable 
          style={styles.menuItem}
          onPress={() => router.push('/pages/ContactUs' as any)}
        >
          <View style={styles.menuItemLeft}>
            <Mail size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.menuItemText}>Contact Us</Text>
          </View>
          <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
        </Pressable>

        <Pressable 
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
          onPress={() => router.push('/pages/DeletionPolicy' as any)}
        >
          <View style={styles.menuItemLeft}>
            <ShieldAlert size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.menuItemText}>Deletion Policy</Text>
          </View>
          <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
        </Pressable>
      </View>

      <Pressable 
        style={styles.logoutBtn}
        onPress={handleLogout}
      >
        <LogOut size={14} color="rgba(255,255,255,0.4)" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    marginBottom: 40,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  quickActionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  quickActionText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  quickActionTextPrimary: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  menuList: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  logoutText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },
});
