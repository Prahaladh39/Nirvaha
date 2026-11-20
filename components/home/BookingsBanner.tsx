import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TicketCheck, Sparkles, ChevronRight, Calendar } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function BookingsBanner() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#16281E', '#0E1A14', '#0A120E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        {/* Top Tag & Sparkle */}
        <View style={styles.topRow}>
          <View style={styles.tagBadge}>
            <Sparkles size={12} color={theme.colors.gold} />
            <Text style={styles.tagText}>COMMUNITY GATHERINGS</Text>
          </View>
          <View style={styles.ticketIconBox}>
            <TicketCheck size={20} color={theme.colors.gold} />
          </View>
        </View>

        {/* Headline & Subhead */}
        <Text style={styles.title}>Experiences & Bookings Platform</Text>
        <Text style={styles.subtitle}>
          Immerse in sound healing sessions, mindful retreats, and sacred community satsangs.
        </Text>

        {/* Direct Action Buttons */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            onPress={() => router.push('/events' as any)}
          >
            <Calendar size={14} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Explore Gatherings</Text>
            <ChevronRight size={14} color="#FFFFFF" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            onPress={() => router.push('/(tabs)/bookings' as any)}
          >
            <TicketCheck size={14} color={theme.colors.gold} />
            <Text style={styles.secondaryBtnText}>My Passbook</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 14,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  tagText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 10,
    color: theme.colors.gold,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  ticketIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(45, 90, 76, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 19,
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 18,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  primaryBtn: {
    flex: 1.2,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.healingGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: theme.colors.gold,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

