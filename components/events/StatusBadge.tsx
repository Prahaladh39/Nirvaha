import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Sparkles, Ban, Archive, AlertCircle, Clock } from 'lucide-react-native';
import { ComputedEventStatus, EventPublicationStatus } from '../../types/events';

interface StatusBadgeProps {
  status: ComputedEventStatus | EventPublicationStatus;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  style,
}) => {
  if (!status || status === 'published' || status === 'draft') {
    return null;
  }

  const isSmall = size === 'sm';
  const iconSize = isSmall ? 10 : 12;

  switch (status) {
    case 'featured':
      return (
        <View style={[styles.badge, styles.featuredBadge, isSmall && styles.badgeSm, style]}>
          <Sparkles size={iconSize} color="#D4AF37" />
          <Text style={[styles.badgeText, styles.featuredText, isSmall && styles.textSm]}>
            Featured
          </Text>
        </View>
      );

    case 'fully_booked':
      return (
        <View style={[styles.badge, styles.soldOutBadge, isSmall && styles.badgeSm, style]}>
          <AlertCircle size={iconSize} color="#F87171" />
          <Text style={[styles.badgeText, styles.soldOutText, isSmall && styles.textSm]}>
            Sold Out
          </Text>
        </View>
      );

    case 'registration_closed':
      return (
        <View style={[styles.badge, styles.closedBadge, isSmall && styles.badgeSm, style]}>
          <Clock size={iconSize} color="#9CA3AF" />
          <Text style={[styles.badgeText, styles.closedText, isSmall && styles.textSm]}>
            Registration Closed
          </Text>
        </View>
      );

    case 'cancelled':
      return (
        <View style={[styles.badge, styles.cancelledBadge, isSmall && styles.badgeSm, style]}>
          <Ban size={iconSize} color="#EF4444" />
          <Text style={[styles.badgeText, styles.cancelledText, isSmall && styles.textSm]}>
            Cancelled
          </Text>
        </View>
      );

    case 'archived':
      return (
        <View style={[styles.badge, styles.archivedBadge, isSmall && styles.badgeSm, style]}>
          <Archive size={iconSize} color="#9CA3AF" />
          <Text style={[styles.badgeText, styles.archivedText, isSmall && styles.textSm]}>
            Concluded
          </Text>
        </View>
      );

    case 'unavailable':
      return (
        <View style={[styles.badge, styles.archivedBadge, isSmall && styles.badgeSm, style]}>
          <AlertCircle size={iconSize} color="#9CA3AF" />
          <Text style={[styles.badgeText, styles.archivedText, isSmall && styles.textSm]}>
            Unavailable
          </Text>
        </View>
      );

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    gap: 4,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  badgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: 10,
  },
  featuredBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  featuredText: {
    color: '#D4AF37',
  },
  soldOutBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  soldOutText: {
    color: '#F87171',
  },
  closedBadge: {
    backgroundColor: 'rgba(156, 163, 175, 0.15)',
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  closedText: {
    color: '#9CA3AF',
  },
  cancelledBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  cancelledText: {
    color: '#EF4444',
  },
  archivedBadge: {
    backgroundColor: 'rgba(107, 114, 128, 0.15)',
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
  archivedText: {
    color: '#9CA3AF',
  },
});
