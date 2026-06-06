import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, Platform } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Bookmark, Star, ShieldCheck, Award, MessageCircle } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { companionsData } from '../../constants/companionsData';

export default function CompanionBioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const companion = companionsData.find(c => c.id === id) || companionsData[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header */}
        <View style={[styles.profileHeader, { paddingTop: Platform.OS === 'android' ? 40 : 16 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtnInline}>
            <ChevronLeft color={theme.colors.foreground} size={24} />
          </Pressable>

          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>{companion.initials}</Text>
          </View>
          
          <View style={styles.headerInfo}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{companion.name}</Text>
                <Text style={styles.title}>{companion.title}</Text>
              </View>
              <Pressable style={styles.iconBtnSmall}>
                <Bookmark color={theme.colors.foreground} size={20} />
              </Pressable>
            </View>
            
            <View style={styles.ratingRow}>
              <Star size={16} color={theme.colors.gold} fill={theme.colors.gold} />
              <Text style={styles.ratingText}>
                <Text style={styles.ratingValue}>{companion.rating} </Text>
                <Text style={styles.ratingCount}>({companion.reviewsCount})</Text>
              </Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.availabilityText}>{companion.availability}</Text>
            </View>
            
            <View style={styles.badgesRow}>
              {companion.isVerified && (
                <View style={styles.badge}>
                  <ShieldCheck size={14} color={theme.colors.primary} />
                  <Text style={styles.badgeText}>Verified</Text>
                </View>
              )}
              {companion.isCertified && (
                <View style={styles.badge}>
                  <Award size={14} color={theme.colors.gold} />
                  <Text style={styles.badgeText}>Certified</Text>
                </View>
              )}
              <Text style={styles.sessionsText}>{companion.sessionsCount}+ sessions</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {companion.name.split(' ')[0]}</Text>
          <Text style={styles.aboutText}>{companion.about}</Text>
          
          <View style={styles.tagsContainer}>
            {companion.tags.map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What people say</Text>
          
          {companion.reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerAvatar}>
                  <Text style={styles.reviewerAvatarText}>{review.userInitial}</Text>
                </View>
                <Text style={styles.reviewerName}>{review.userName}</Text>
                <View style={styles.reviewStars}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      color={i < review.rating ? theme.colors.gold : '#E2E8F0'} 
                      fill={i < review.rating ? theme.colors.gold : 'transparent'} 
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}
          
          <Pressable style={styles.seeAllReviewsBtn}>
            <Text style={styles.seeAllReviewsText}>See all {companion.reviewsCount} reviews</Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={styles.bottomBar}>
        <Pressable 
          style={styles.chatNowBtn}
          onPress={() => router.push(`/companions/chat/${companion.id}`)}
        >
          <MessageCircle size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.chatNowBtnText}>Chat Now (Free 5-Min)</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backBtnInline: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  iconBtnSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for bottom bar
  },
  profileHeader: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: theme.colors.healingGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontFamily: theme.typography.display,
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: theme.typography.display,
    fontSize: 22,
    color: theme.colors.foreground,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.mutedForeground,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
  },
  ratingValue: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 13,
    color: theme.colors.foreground,
  },
  ratingCount: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  dotSeparator: {
    marginHorizontal: 8,
    color: theme.colors.mutedForeground,
  },
  availabilityText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 13,
    color: theme.colors.primary,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  sessionsText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: theme.colors.foreground,
    fontWeight: '600',
    marginBottom: 16,
  },
  aboutText: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    color: theme.colors.foreground,
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EBEBEB',
  },
  tagText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewerAvatarText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.foreground,
  },
  reviewerName: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.foreground,
    flex: 1,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.mutedForeground,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  seeAllReviewsBtn: {
    paddingVertical: 8,
  },
  seeAllReviewsText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  chatNowBtn: {
    backgroundColor: theme.colors.healingGreen,
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatNowBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
