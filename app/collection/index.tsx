import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import ScreenContainer from '../../components/ui/ScreenContainer';
import { router, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronRight, ArrowLeft } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { collectionCategories } from '../../constants/collectionData';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CollectionOverview() {
  const insets = useSafeAreaInsets();

  return (
    <ScreenContainer statusBarStyle="light" style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.hero}>
        <Image 
          source={require('../../assets/images/collection-bg.png')} 
          style={styles.heroImage} 
          contentFit="cover"
          transition={500}
        />
        <LinearGradient 
          colors={['rgba(10,10,10,0.1)', 'rgba(10,10,10,0.85)']} 
          style={styles.heroOverlay} 
        />
        <View style={[styles.heroContent, { paddingTop: insets.top > 0 ? insets.top + 12 : 20 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          
          <View style={styles.heroText}>
            <Text style={styles.title}>The Collection</Text>
            <Text style={styles.subtitle}>Timeless wisdom for the modern mind</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {collectionCategories.map((category, index) => (
          <Animated.View 
            key={category.id} 
            entering={FadeInDown.duration(500).delay(index * 100)}
          >
            <Pressable 
              style={styles.categoryCard}
              onPress={() => router.push(`/collection/${category.id}`)}
            >
              <LinearGradient 
                colors={category.colors} 
                style={styles.cardBg}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              
              <View style={styles.cardContent}>
                <View style={styles.iconWrapper}>
                  <Text style={styles.iconText}>{category.icon}</Text>
                </View>
                
                <View style={styles.textWrapper}>
                  <View style={styles.tagRow}>
                    <View style={styles.moodPill}>
                      <Text style={styles.moodText}>{category.moodTag}</Text>
                    </View>
                    <Text style={styles.itemCount}>{category.itemCount} sessions</Text>
                  </View>
                  
                  <Text style={styles.cardTitle}>{category.title}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>{category.description}</Text>
                </View>
                
                <ChevronRight size={20} color="rgba(255,255,255,0.4)" />
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  hero: {
    height: 220,
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  heroText: {
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  categoryCard: {
    height: 140,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
  },
  textWrapper: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  moodPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  moodText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  itemCount: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  cardTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
  }
});
