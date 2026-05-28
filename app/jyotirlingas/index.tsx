import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText, Defs, LinearGradient, RadialGradient, Stop, Line } from 'react-native-svg';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Compass, ShieldCheck } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { jyotirlingas } from '../../constants/jyotirlingaData';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// SVG dimensions for rendering (viewBox is 0 0 500 620)
const mapWidth = 500;
const mapHeight = 620;

const getCoords = (xPercent: number, yPercent: number) => {
  return {
    cx: (xPercent / 100) * mapWidth,
    cy: (yPercent / 100) * mapHeight,
  };
};

const indiaPathPoints = [
  { x: 38.0, y: 4.5 }, { x: 39.5, y: 5.2 }, { x: 41.2, y: 7.0 }, { x: 42.5, y: 8.5 },
  { x: 44.5, y: 10.2 }, { x: 45.2, y: 12.5 }, { x: 43.5, y: 14.8 }, { x: 44.8, y: 16.2 },
  { x: 46.5, y: 18.0 }, { x: 48.8, y: 19.5 }, { x: 49.5, y: 21.5 }, { x: 48.8, y: 23.8 },
  { x: 47.0, y: 25.0 }, { x: 50.0, y: 27.2 }, { x: 52.8, y: 29.5 }, { x: 56.5, y: 32.5 },
  { x: 57.2, y: 31.2 }, { x: 58.2, y: 32.5 }, { x: 59.8, y: 32.2 }, { x: 62.0, y: 32.0 },
  { x: 63.8, y: 31.5 }, { x: 66.5, y: 29.2 }, { x: 69.5, y: 27.8 }, { x: 72.8, y: 27.2 },
  { x: 74.5, y: 29.8 }, { x: 74.0, y: 32.2 }, { x: 72.5, y: 34.0 }, { x: 73.2, y: 36.0 },
  { x: 74.0, y: 38.8 }, { x: 73.5, y: 41.2 }, { x: 71.5, y: 44.2 }, { x: 70.0, y: 43.2 },
  { x: 69.2, y: 44.8 }, { x: 68.4, y: 42.5 }, { x: 68.8, y: 40.8 }, { x: 67.2, y: 40.0 },
  { x: 65.5, y: 38.5 }, { x: 62.5, y: 39.2 }, { x: 61.2, y: 40.5 }, { x: 61.8, y: 43.0 },
  { x: 63.2, y: 44.8 }, { x: 64.0, y: 47.2 }, { x: 61.2, y: 48.0 }, { x: 59.8, y: 51.0 },
  { x: 58.8, y: 53.2 }, { x: 57.5, y: 55.8 }, { x: 55.0, y: 58.8 }, { x: 51.5, y: 63.0 },
  { x: 47.5, y: 69.2 }, { x: 44.8, y: 74.8 }, { x: 43.8, y: 79.0 }, { x: 43.2, y: 82.5 },
  { x: 43.5, y: 86.0 }, { x: 41.2, y: 87.8 }, { x: 39.8, y: 91.0 }, { x: 37.8, y: 93.5 },
  { x: 36.2, y: 92.0 }, { x: 35.5, y: 89.2 }, { x: 33.8, y: 84.8 }, { x: 32.2, y: 81.0 },
  { x: 30.5, y: 76.8 }, { x: 28.5, y: 73.5 }, { x: 26.5, y: 71.5 }, { x: 23.5, y: 67.0 },
  { x: 21.0, y: 62.2 }, { x: 19.5, y: 59.2 }, { x: 18.2, y: 56.8 }, { x: 17.5, y: 54.2 },
  { x: 15.2, y: 53.5 }, { x: 13.8, y: 54.8 }, { x: 12.0, y: 54.0 }, { x: 10.2, y: 52.2 },
  { x: 8.5, y: 52.0 }, { x: 6.8, y: 50.8 }, { x: 4.8, y: 49.0 }, { x: 3.2, y: 46.8 },
  { x: 5.5, y: 45.2 }, { x: 7.2, y: 44.5 }, { x: 5.0, y: 44.0 }, { x: 4.2, y: 42.2 },
  { x: 6.5, y: 41.0 }, { x: 9.8, y: 40.5 }, { x: 11.2, y: 37.8 }, { x: 12.5, y: 35.2 },
  { x: 14.8, y: 32.8 }, { x: 17.0, y: 30.0 }, { x: 18.5, y: 28.0 }, { x: 20.2, y: 25.2 },
  { x: 22.0, y: 23.0 }, { x: 24.2, y: 21.5 }, { x: 26.5, y: 19.8 }, { x: 27.5, y: 16.8 },
  { x: 29.5, y: 14.0 }, { x: 31.8, y: 10.8 }, { x: 34.5, y: 8.0 }
];

const labelLayouts: Record<string, { xOffset: number; yOffset: number; anchor: 'start' | 'end' | 'middle' }> = {
  somnath: { xOffset: 12, yOffset: 4, anchor: 'start' },
  nageshwar: { xOffset: -12, yOffset: -5, anchor: 'end' },
  trimbakeshwar: { xOffset: -12, yOffset: 4, anchor: 'end' },
  bhimashankar: { xOffset: -12, yOffset: 12, anchor: 'end' },
  grishneshwar: { xOffset: 14, yOffset: 2, anchor: 'start' },
  mahakaleshwar: { xOffset: 0, yOffset: -22, anchor: 'middle' },
  omkareshwar: { xOffset: 12, yOffset: 4, anchor: 'start' },
  mallikarjuna: { xOffset: 12, yOffset: 0, anchor: 'start' },
  ramanathaswamy: { xOffset: -12, yOffset: 0, anchor: 'end' },
  kedarnath: { xOffset: 12, yOffset: 0, anchor: 'start' },
  'kashi-vishwanath': { xOffset: -12, yOffset: -8, anchor: 'end' },
  vaidyanath: { xOffset: -12, yOffset: 10, anchor: 'end' },
};

const getPathString = (points: { x: number; y: number }[]) => {
  return points.reduce((path, p, i) => {
    const { cx, cy } = getCoords(p.x, p.y);
    if (i === 0) return `M ${cx} ${cy}`;
    return `${path} L ${cx} ${cy}`;
  }, '') + ' Z';
};

const borderPath = getPathString(indiaPathPoints);

const regions = ['North', 'Central', 'East', 'West', 'South'];

export default function JyotirlingaMapScreen() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const initialScale = Dimensions.get('window').width / mapWidth * 0.95;
  
  const scale = useSharedValue(initialScale);
  const savedScale = useSharedValue(initialScale);
  const translateX = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(initialScale * 0.5, Math.min(savedScale.value * e.scale, 5));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onUpdate((e) => {
      // Limit panning a bit based on scale if needed, or just let it free pan
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ExpoLinearGradient colors={['#0A0A0A', '#12100E']} style={StyleSheet.absoluteFill} />
      
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 12 : 32 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>
            <Compass size={12} color={theme.colors.gold} style={{marginRight: 4}} /> SACRED GEOGRAPHY
          </Text>
          <Text style={styles.headerTitle}>12 Jyotirlingas</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          <Pressable 
            onPress={() => setActiveRegion(null)}
            style={[styles.filterBtn, activeRegion === null && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, activeRegion === null && styles.filterTextActive]}>
              All India ({jyotirlingas.length})
            </Text>
          </Pressable>
          {regions.map(r => (
            <Pressable 
              key={r}
              onPress={() => setActiveRegion(r)}
              style={[styles.filterBtn, activeRegion === r && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, activeRegion === r && styles.filterTextActive]}>
                {r} ({jyotirlingas.filter(t => t.region === r).length})
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          <View style={{ width: mapWidth, height: mapHeight }}>
            <Svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} width="100%" height="100%" style={styles.svg}>
          <Defs>
            <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.colors.gold} />
              <Stop offset="100%" stopColor="#b23b1e" />
            </LinearGradient>
            <RadialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={theme.colors.gold} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={theme.colors.gold} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Grid lines */}
          <G stroke="rgba(211,180,80,0.04)" strokeWidth="1" strokeDasharray="3,3">
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(pct => {
              const xPos = (pct / 100) * mapWidth;
              const yPos = (pct / 100) * mapHeight;
              return (
                <G key={`grid-${pct}`}>
                  <Line x1={xPos} y1={0} x2={xPos} y2={mapHeight} />
                  <Line x1={0} y1={yPos} x2={mapWidth} y2={yPos} />
                </G>
              );
            })}
          </G>

          {/* Base India Map */}
          <Path
            d={borderPath}
            fill="#12141a"
            stroke="rgba(212, 175, 55, 0.15)"
            strokeWidth="2"
          />

          {/* Sea Labels */}
          <SvgText x="8%" y="76%" fill="rgba(212, 175, 55, 0.15)" fontSize="12" fontFamily="monospace" letterSpacing="2">
            ARABIAN SEA
          </SvgText>
          <SvgText x="70%" y="76%" fill="rgba(212, 175, 55, 0.15)" fontSize="12" fontFamily="monospace" letterSpacing="2">
            BAY OF BENGAL
          </SvgText>
          <SvgText x="40%" y="98%" fill="rgba(212, 175, 55, 0.15)" fontSize="12" fontFamily="monospace" letterSpacing="2">
            INDIAN OCEAN
          </SvgText>

          {/* Markers */}
          {jyotirlingas.map((temple) => {
            const { cx, cy } = getCoords(temple.x, temple.y);
            const isDimmed = activeRegion !== null && temple.region !== activeRegion;
            const layout = labelLayouts[temple.id] || { xOffset: 0, yOffset: -16, anchor: 'middle' };
            const shortLocName = temple.location.split(',')[0];

            return (
              <G 
                key={temple.id} 
                opacity={isDimmed ? 0.2 : 1}
              >
                {/* Hit area */}
                <Circle cx={cx} cy={cy} r="25" fill="transparent" />

                <G transform={`translate(${cx}, ${cy})`}>
                  <G transform="scale(1.2) translate(-9, -16)">
                    <Path d="M 1 16 Q 9 11 17 16 Z" fill="#4e342e" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="0.5" />
                    <Path d="M 2 16 Q 9 12 16 16 Z" fill="#8d6e63" opacity="0.85" />
                    <Rect x="5.5" y="10" width="7" height="6" rx="0.5" fill="#c84b11" stroke="#111827" strokeWidth="0.5" />
                    <Rect x="7.5" y="12" width="3" height="4" fill="#111827" rx="0.3" />
                    <Path d="M 4.5 10 Q 9 1 13.5 10 Z" fill="#ef4444" stroke="#111827" strokeWidth="0.5" />
                    <Line x1="9" y1="2" x2="9" y2="-2" stroke="#d4af37" strokeWidth="0.8" />
                    <Path d="M 9 -2 L 13.5 -0.5 L 9 1 Z" fill="#ff9800" stroke="#111827" strokeWidth="0.3" />
                  </G>
                </G>

                <G transform={`translate(${cx + layout.xOffset}, ${cy + layout.yOffset})`}>
                  <SvgText
                    x="0"
                    y="0"
                    textAnchor={layout.anchor}
                    fill="#FFF"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily={theme.typography.serif}
                  >
                    {temple.name}
                  </SvgText>
                  <SvgText
                    x="0"
                    y="10"
                    textAnchor={layout.anchor}
                    fill="#cbd5e1"
                    fontSize="8"
                    fontFamily={theme.typography.body}
                  >
                    {shortLocName}
                  </SvgText>
                </G>
              </G>
            );
          })}
          </Svg>

          {/* Invisible Native Overlays for Reliable Touches */}
          {jyotirlingas.map((temple) => {
            const { cx, cy } = getCoords(temple.x, temple.y);
            const isDimmed = activeRegion !== null && temple.region !== activeRegion;

            return (
              <Pressable
                key={`touch-${temple.id}`}
                style={{
                  position: 'absolute',
                  left: cx - 25,
                  top: cy - 25,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
                onPress={() => {
                  if (!isDimmed) {
                    router.push(`/jyotirlingas/${temple.id}`);
                  }
                }}
              />
            );
          })}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
    </GestureHandlerRootView>
  );
}

// React Native SVG doesn't have <Rect> exported by default in some older versions but we can import it.
// Let's import Rect just to be safe.
import { Rect } from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: theme.colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
  },
  filtersWrapper: {
    paddingVertical: 12,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: theme.colors.gold,
  },
  filterText: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  filterTextActive: {
    color: theme.colors.gold,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    shadowColor: theme.colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  }
});
