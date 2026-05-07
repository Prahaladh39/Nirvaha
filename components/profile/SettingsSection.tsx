import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { 
  User, 
  Bell, 
  Globe, 
  Shield, 
  HelpCircle, 
  ChevronRight, 
  LogOut, 
  Moon, 
  Sun 
} from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsSection() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(350)}
      style={styles.container}
    >
      {/* Appearance */}
      <View style={styles.group}>
        <Text style={styles.groupTitle}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.item}>
            <View style={styles.iconWrapper}>
              {isDarkMode ? <Moon size={14} color="#FFFFFF" /> : <Sun size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.itemLabel}>Dark mode</Text>
            <Switch 
              value={isDarkMode} 
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#3e3e3e', true: theme.colors.healingGreen }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
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

      {/* Logout */}
      <Pressable 
        style={styles.logoutBtn}
        onPress={() => router.replace('/pages/Auth')}
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
  group: {
    marginBottom: 20,
  },
  groupTitle: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(142, 164, 150, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemLabel: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
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
