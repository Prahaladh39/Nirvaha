import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  ChevronRight,
  Globe,
  BookOpen,
  Camera,
  TrendingUp,
} from "lucide-react-native";
import { theme } from "../../constants/theme";
import { router } from "expo-router";

const tiles = [
  {
    id: "community",
    title: "Nirvaha Space",
    subtitle: "Anonymous sharing",
    icon: Globe,
    label: "CONNECT",
    route: "/coming-soon",
    colors: {
      bg: "#122A22",
      iconBg: "rgba(42, 82, 77, 0.4)",
      accent: theme.colors.healingGreenLight,
    },
  },
  {
    id: "journal",
    title: "Journal",
    subtitle: "Reflect & release",
    icon: BookOpen,
    label: "REFLECT",
    route: "/(tabs)/journal",
    colors: {
      bg: "#332616",
      iconBg: "rgba(180, 140, 60, 0.25)",
      accent: theme.colors.gold,
    },
  },
  {
    id: "selfie",
    title: "Wisdom Selfie",
    subtitle: "Meet your guides",
    icon: Camera,
    label: "DISCOVER",
    route: "/coming-soon",
    colors: {
      bg: "#251633",
      iconBg: "rgba(120, 70, 160, 0.25)",
      accent: "#B088D6",
    },
  },
  {
    id: "wellness",
    title: "Wellness",
    subtitle: "Your weekly insights",
    icon: TrendingUp,
    label: "TRACK",
    route: "/(tabs)/wellness",
    colors: {
      bg: "#162A33",
      iconBg: "rgba(50, 120, 140, 0.25)",
      accent: "#88C6D6",
    },
  },
];

export default function CompactTilesGrid() {
  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(600)}
      style={styles.container}
    >
      <Text style={styles.sectionTitle}>Your Tools</Text>
      <Text style={styles.sectionSubtitle}>Reflect, explore, and track</Text>

      <View style={styles.grid}>
        {tiles.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <Pressable
              key={tile.id}
              style={[styles.tile, { backgroundColor: tile.colors.bg }]}
              onPress={() => {
                if (tile.route) router.push(tile.route as any);
              }}
            >
              <View style={styles.topRow}>
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: tile.colors.iconBg },
                  ]}
                >
                  <Icon size={18} color={tile.colors.accent} />
                </View>
                <View
                  style={[
                    styles.labelBadge,
                    { borderColor: tile.colors.accent },
                  ]}
                >
                  <Text
                    style={[styles.labelText, { color: tile.colors.accent }]}
                  >
                    {tile.label}
                  </Text>
                </View>
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.textContainer}>
                  <Text style={styles.tileTitle} numberOfLines={1}>
                    {tile.title}
                  </Text>
                  <Text style={styles.tileSubtitle} numberOfLines={1}>
                    {tile.subtitle}
                  </Text>
                </View>
                <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
              </View>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  tile: {
    width: "48%", // Approx half minus gap
    height: 120,
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  labelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  labelText: {
    fontFamily: theme.typography.body,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  tileTitle: {
    fontFamily: theme.typography.display,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  tileSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
  },
});
