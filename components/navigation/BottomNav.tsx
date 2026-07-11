import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Home, Sparkles, Play, User } from 'lucide-react-native';
import { usePathname, router } from 'expo-router';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LAYOUT_TOKENS } from '../ui/ScreenContainer';

const { width } = Dimensions.get('window');

const navItems = [
  { label: 'Home', icon: Home, route: '/(tabs)' },
  { label: 'Inner Guide', icon: Sparkles, route: '/chat' },
  { label: 'Collection', icon: Play, route: '/collection' },
  { label: 'Profile', icon: User, route: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [containerWidth, setContainerWidth] = useState(0);
  const insets = useSafeAreaInsets();

  // We determine the active index based on route
  const getActiveIndex = () => {
    if (pathname.includes('chat')) return 1;
    if (pathname.includes('collection')) return 2;
    if (pathname.includes('profile')) return 3;
    return 0; // default to Home
  };

  const activeIndex = getActiveIndex();
  
  // The shared value for the position of the active pill
  const pillOffset = useSharedValue(0);
  const pillWidth = useSharedValue(0);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(pillOffset.value, { damping: 20, stiffness: 300 }) }],
    width: withSpring(pillWidth.value, { damping: 20, stiffness: 300 }),
  }));

  /* 
    Position the nav bar so it floats just above the system navigation area.
    - On gesture-nav / iOS (insets.bottom ≈ 0–24): keeps the original 20px design spacing.
    - On 3-button nav (insets.bottom ≈ 48): sits just above the system bar, not 20+48=68px up.
  */
  return (
    <View style={[styles.wrapper, { bottom: Math.max(LAYOUT_TOKENS.BOTTOM_NAV_MARGIN, insets.bottom + 4) }]}>
      <View 
        style={styles.container}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View style={[styles.activePill, animatedPillStyle]} />

        {navItems.map((item, index) => {
          const isActive = index === activeIndex;
          const Icon = item.icon;
          
          return (
            <Pressable
              key={item.label}
              style={styles.navItem}
              onLayout={(e) => {
                if (isActive && containerWidth > 0) {
                  const itemWidth = containerWidth / navItems.length;
                  pillWidth.value = itemWidth;
                  pillOffset.value = itemWidth * index;
                }
              }}
              onPress={() => {
                if (item.route === '/(tabs)') {
                  router.replace('/(tabs)');
                } else {
                  router.push(item.route as any);
                }
              }}
            >
              <Icon 
                size={22} 
                color={isActive ? theme.colors.background : 'rgba(255,255,255,0.7)'} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              {isActive && (
                <Text style={styles.activeText} numberOfLines={1}>
                  {item.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'rgba(30, 40, 35, 0.85)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingHorizontal: 4,
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  activePill: {
    position: 'absolute',
    left: 4,
    height: 52,
    backgroundColor: theme.colors.primary,
    borderRadius: 26,
    zIndex: 0,
  },
  navItem: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    gap: 6,
  },
  activeText: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.background,
  }
});
