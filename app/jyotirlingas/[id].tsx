import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, BookOpen, 
  MapPin, Sparkles, Milestone, History, Award, Compass, Activity, CheckCircle2 
} from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { jyotirlingas } from '../../constants/jyotirlingaData';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function JyotirlingaDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const currentIndex = jyotirlingas.findIndex(t => t.id === id);
  const currentTemple = jyotirlingas[currentIndex] || jyotirlingas[0];
  
  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + jyotirlingas.length) % jyotirlingas.length;
    router.replace(`/jyotirlingas/${jyotirlingas[prevIndex].id}`);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % jyotirlingas.length;
    router.replace(`/jyotirlingas/${jyotirlingas[nextIndex].id}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={['#0A0A0A', '#12100E']} style={StyleSheet.absoluteFill} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 12 : 32 }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <ArrowLeft size={20} color="#FFF" />
          </Pressable>
          <BookOpen size={16} color={theme.colors.gold} style={{ marginLeft: 12, marginRight: 6 }} />
          <Text style={styles.headerTitle}>SACRED CHRONICLES</Text>
        </View>

        <View style={styles.headerRight}>
          <Pressable onPress={handlePrev} style={styles.iconBtnSmall}>
            <ChevronLeft size={16} color="#FFF" />
          </Pressable>
          <Text style={styles.counter}>{currentIndex + 1} / 12</Text>
          <Pressable onPress={handleNext} style={styles.iconBtnSmall}>
            <ChevronRight size={16} color="#FFF" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Block */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.titleBlock}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentTemple.region} Region • {currentTemple.state}</Text>
            </View>
          </View>
          
          <Text style={styles.name}>{currentTemple.name}</Text>
          <Text style={styles.sanskritName}>{currentTemple.sanskritName} • ज्योतिर्लिङ्ग</Text>
          
          <View style={styles.locationRow}>
            <MapPin size={14} color="#c84b1e" />
            <Text style={styles.locationText}>{currentTemple.location}, {currentTemple.state}</Text>
          </View>
        </Animated.View>

        {/* Quick Facts Grid */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.factsGrid}>
          <View style={styles.factCard}>
            <Text style={styles.factLabel}>RIVER / BASIN</Text>
            <View style={styles.factValueRow}>
              <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.factValue}>{currentTemple.river}</Text>
            </View>
          </View>
          
          <View style={styles.factCard}>
            <Text style={styles.factLabel}>SPIRITUAL THEME</Text>
            <View style={styles.factValueRow}>
              <Sparkles size={12} color={theme.colors.gold} />
              <Text style={[styles.factValue, { color: theme.colors.gold }]}>{currentTemple.primaryTheme}</Text>
            </View>
          </View>
          
          <View style={[styles.factCard, { borderRightWidth: 0, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', width: '100%' }]}>
            <Text style={styles.factLabel}>ARCHITECTURAL IDENTITY</Text>
            <View style={styles.factValueRow}>
              <Milestone size={12} color="#c84b1e" />
              <Text style={styles.factValue}>{currentTemple.architecturalStyle}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Sections */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <History size={16} color="#c84b1e" />
            <Text style={styles.sectionTitle}>Historical Legacy</Text>
          </View>
          <Text style={styles.sectionText}>{currentTemple.history}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={16} color={theme.colors.gold} />
            <Text style={[styles.sectionTitle, { color: theme.colors.gold }]}>Spiritual Symbolism</Text>
          </View>
          <Text style={styles.sectionText}>{currentTemple.significance}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Compass size={16} color="#38bdf8" />
            <Text style={[styles.sectionTitle, { color: '#38bdf8' }]}>Contemporary Lens</Text>
          </View>
          <Text style={styles.sectionText}>{currentTemple.contemporary}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Activity size={16} color="#c84b1e" />
            <Text style={[styles.sectionTitle, { color: '#c84b1e' }]}>Living Heritage</Text>
          </View>
          <Text style={styles.sectionText}>{currentTemple.relevance}</Text>
        </Animated.View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconBtnSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.serif,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.gold,
    letterSpacing: 1,
  },
  counter: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    fontWeight: '500',
    color: '#FFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  titleBlock: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: theme.colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  name: {
    fontFamily: theme.typography.display,
    fontSize: 32,
    color: '#FFF',
    marginBottom: 4,
  },
  sanskritName: {
    fontFamily: theme.typography.serif,
    fontSize: 16,
    color: theme.colors.gold,
    opacity: 0.9,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
    overflow: 'hidden',
  },
  factCard: {
    width: '50%',
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.05)',
  },
  factLabel: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  factValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  factValue: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: '#FFF',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: theme.typography.serif,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  sectionText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  }
});
