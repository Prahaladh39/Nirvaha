import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Play, Clock } from 'lucide-react-native';
import { theme } from '../../../constants/theme';
import { collectionCategories, collectionItems } from '../../../constants/collectionData';
import { LinearGradient } from 'expo-linear-gradient';

export default function CategoryDetail() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const category = collectionCategories.find(c => c.id === categoryId);
  const items = collectionItems[categoryId as string] || [];

  if (!category) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.hero}>
        {category.coverImage ? (
          <Image 
            source={{ uri: category.coverImage }} 
            style={styles.heroImage} 
            contentFit="cover"
            transition={500}
          />
        ) : (
          <LinearGradient colors={category.colors} style={styles.heroBg} />
        )}
        <LinearGradient 
          colors={['rgba(10,10,10,0.2)', 'rgba(10,10,10,0.8)']} 
          style={styles.heroOverlay} 
        />
        <View style={styles.heroContent}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          
          <View style={styles.heroText}>
            <View style={styles.iconWrapper}>
              <Text style={styles.iconText}>{category.icon}</Text>
            </View>
            <Text style={styles.title}>{category.title}</Text>
            <Text style={styles.description}>{category.description}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>All Sessions</Text>
          <Text style={styles.sessionCount}>{items.length} tracks</Text>
        </View>

        {items.map((item, index) => (
          <Animated.View 
            key={item.id} 
            entering={FadeInDown.duration(400).delay(index * 50)}
          >
            <Pressable 
              style={styles.trackCard}
              onPress={() => router.push(`/collection/${categoryId}/${item.id}`)}
            >
              <View style={styles.trackInfo}>
                <View style={styles.trackIcon}>
                  <Text style={styles.trackIconText}>{item.icon}</Text>
                </View>
                <View style={styles.trackText}>
                  <Text style={styles.trackTitle}>{item.title}</Text>
                  <View style={styles.trackMeta}>
                    <View style={styles.moodPill}>
                      <Text style={styles.moodText}>{item.moodTag}</Text>
                    </View>
                    <View style={styles.durationRow}>
                      <Clock size={10} color="rgba(255,255,255,0.4)" />
                      <Text style={styles.durationText}>{item.duration}</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.playBtn}>
                <Play size={14} color="#000000" fill="#000000" style={{ marginLeft: 2 }} />
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  hero: {
    height: 280,
    position: 'relative',
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    paddingBottom: 20,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  listTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sessionCount: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  trackInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  trackIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackIconText: {
    fontSize: 20,
  },
  trackText: {
    flex: 1,
  },
  trackTitle: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moodPill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  moodText: {
    fontFamily: theme.typography.body,
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
