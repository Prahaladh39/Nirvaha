import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Video, Globe } from 'lucide-react-native';
import { EventDocument, getComputedEventStatus } from '../../types/events';
import { StatusBadge } from './StatusBadge';

interface EventCardProps {
  event: EventDocument;
  onPress?: () => void;
  variant?: 'default' | 'rail' | 'hero';
  style?: StyleProp<ViewStyle>;
}

const CATEGORY_LABELS: Record<string, string> = {
  yoga: 'Yoga',
  meditation: 'Meditation',
  sound_healing: 'Sound Healing',
  wellness_workshops: 'Workshop',
  retreats: 'Retreat',
  community_experiences: 'Community',
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  variant = 'default',
  style,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(('/events/' + event.id) as any);
    }
  };

  const computedStatus = getComputedEventStatus(event);

  // Format date & time nicely
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Upcoming';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Upcoming';
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Upcoming';
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  const dateStr = formatDate(event.schedule?.startDate);
  const timeStr = formatTime(event.schedule?.startDate);
  const dateTimeDisplay = timeStr ? `${dateStr} • ${timeStr}` : dateStr;

  // Format Location
  const isOnline = event.location?.type === 'online';
  const locationText = isOnline
    ? 'Online Experience'
    : event.location?.venueName || event.location?.address || 'In Person';

  // Format Price / Pricing Badge
  const renderPricingBadge = () => {
    if (event.listingType === 'free_booking') {
      return (
        <View style={styles.priceBadgeFree}>
          <Text style={styles.priceBadgeFreeText}>Free</Text>
        </View>
      );
    }
    if (event.listingType === 'paid_booking') {
      const currency = event.paymentConfig?.currency || '₹';
      const amount = event.paymentConfig?.amount ?? 0;
      return (
        <View style={styles.priceBadgePaid}>
          <Text style={styles.priceBadgePaidText}>
            {currency} {amount}
          </Text>
        </View>
      );
    }
    if (event.listingType === 'external_registration') {
      return (
        <View style={styles.priceBadgeNeutral}>
          <Text style={styles.priceBadgeNeutralText}>External</Text>
        </View>
      );
    }
    return null;
  };

  const categoryLabel =
    CATEGORY_LABELS[event.category] || event.category || 'Experience';

  const coverUrl =
    event.media?.coverImageUrl ||
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80';

  if (variant === 'rail') {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.railCard,
          pressed && styles.cardPressed,
          style,
        ]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={event.title}
      >
        <Image
          source={{ uri: coverUrl }}
          style={styles.railImage}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={['transparent', 'rgba(10, 10, 10, 0.4)', 'rgba(10, 10, 10, 0.95)']}
          locations={[0, 0.5, 1]}
          style={styles.railGradient}
        />

        <View style={styles.railTopRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{categoryLabel}</Text>
          </View>
          {renderPricingBadge()}
        </View>

        <View style={styles.railBottomContent}>
          {computedStatus !== 'published' && (
            <View style={styles.statusBadgeWrapper}>
              <StatusBadge status={computedStatus} size="sm" />
            </View>
          )}
          <Text style={styles.railTitle} numberOfLines={2}>
            {event.title}
          </Text>
          <View style={styles.railMetaRow}>
            <Calendar size={12} color="rgba(255, 255, 255, 0.65)" />
            <Text style={styles.railMetaText} numberOfLines={1}>
              {dateStr}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  if (variant === 'hero') {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.heroCard,
          pressed && styles.cardPressed,
          style,
        ]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={event.title}
      >
        <Image
          source={{ uri: coverUrl }}
          style={styles.heroImage}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={['rgba(10, 10, 10, 0.2)', 'rgba(10, 10, 10, 0.6)', 'rgba(10, 10, 10, 0.98)']}
          locations={[0, 0.45, 1]}
          style={styles.heroGradient}
        />

        <View style={styles.heroTopRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{categoryLabel}</Text>
          </View>
          <StatusBadge status="featured" size="md" />
        </View>

        <View style={styles.heroBottomContent}>
          <View style={styles.heroDateBadge}>
            <Calendar size={13} color="#D4AF37" />
            <Text style={styles.heroDateText}>{dateTimeDisplay}</Text>
          </View>

          <Text style={styles.heroTitle} numberOfLines={2}>
            {event.title}
          </Text>

          {event.shortDescription ? (
            <Text style={styles.heroDescription} numberOfLines={2}>
              {event.shortDescription}
            </Text>
          ) : null}

          <View style={styles.heroFooter}>
            <View style={styles.metaItem}>
              {isOnline ? (
                <Video size={13} color="rgba(255, 255, 255, 0.65)" />
              ) : (
                <MapPin size={13} color="rgba(255, 255, 255, 0.65)" />
              )}
              <Text style={styles.metaItemText} numberOfLines={1}>
                {locationText}
              </Text>
            </View>
            {renderPricingBadge()}
          </View>
        </View>
      </Pressable>
    );
  }

  // Default Variant
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        style,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={event.title}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: coverUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={['rgba(10, 10, 10, 0.1)', 'transparent', 'rgba(10, 10, 10, 0.8)']}
          locations={[0, 0.5, 1]}
          style={styles.imageGradient}
        />

        <View style={styles.topRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{categoryLabel}</Text>
          </View>
          {computedStatus !== 'published' ? (
            <StatusBadge status={computedStatus} size="sm" />
          ) : (
            renderPricingBadge()
          )}
        </View>

        <View style={styles.imageBottomRow}>
          <View style={styles.metaPill}>
            <Calendar size={12} color="#D4AF37" />
            <Text style={styles.metaPillText}>{dateTimeDisplay}</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        {event.shortDescription ? (
          <Text style={styles.description} numberOfLines={2}>
            {event.shortDescription}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <View style={styles.locationWrapper}>
            {isOnline ? (
              <Globe size={13} color="rgba(255, 255, 255, 0.6)" />
            ) : (
              <MapPin size={13} color="rgba(255, 255, 255, 0.6)" />
            )}
            <Text style={styles.locationText} numberOfLines={1}>
              {locationText}
            </Text>
          </View>

          {computedStatus !== 'published' && renderPricingBadge()}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  topRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageBottomRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  categoryPill: {
    backgroundColor: 'rgba(10, 10, 10, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  categoryPillText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.3,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  metaPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  body: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 19,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 12,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.65)',
    flexShrink: 1,
  },
  // Price Badges
  priceBadgeFree: {
    backgroundColor: 'rgba(45, 90, 76, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priceBadgeFreeText: {
    color: '#A3BDB1',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  priceBadgePaid: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priceBadgePaidText: {
    color: '#D4AF37',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  priceBadgeNeutral: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priceBadgeNeutralText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  // Rail Variant Styles
  railCard: {
    width: 220,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
  },
  railImage: {
    width: '100%',
    height: '100%',
  },
  railGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  railTopRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  railBottomContent: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 2,
  },
  statusBadgeWrapper: {
    marginBottom: 4,
  },
  railTitle: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 4,
  },
  railMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  railMetaText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  // Hero Variant Styles
  heroCard: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    position: 'relative',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTopRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  heroBottomContent: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    zIndex: 2,
  },
  heroDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  heroDateText: {
    color: '#D4AF37',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 6,
  },
  heroDescription: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 18,
    marginBottom: 10,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 10,
  },
  metaItemText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.75)',
    flexShrink: 1,
  },
});
