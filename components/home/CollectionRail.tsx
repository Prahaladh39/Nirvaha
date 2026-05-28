import { ChevronRight, Play } from "lucide-react-native";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import { collectionCategories } from "../../constants/collectionData";
import { theme } from "../../constants/theme";

export default function CollectionRail() {
  const visible = collectionCategories.slice(0, 6);

  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(400)}
      style={styles.container}
    >
      {/* Section Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>From the Collection</Text>
          <Text style={styles.subtitle}>Curated for this moment</Text>
        </View>
        <Pressable 
          style={styles.viewAllBtn}
          onPress={() => router.push('/collection')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={12} color={theme.colors.gold} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {visible.map((cat, i) => {
          const isRecommended = i === 0;
          return (
            <Pressable 
              key={cat.id} 
              style={styles.card}
              onPress={() => router.push('/collection')}
            >
              <View
                style={[
                  styles.cardContainer,
                  isRecommended && styles.recommendedBorder,
                ]}
              >
                {cat.coverImage ? (
                  <Image
                    source={{ uri: cat.coverImage }}
                    style={styles.coverImage}
                    contentFit="cover"
                    transition={500}
                  />
                ) : (
                  <View
                    style={[
                      styles.cardBackground,
                      { backgroundColor: cat.colors?.[0] || "#1E1E1E" },
                    ]}
                  />
                )}

                <View style={styles.gradientOverlay} />

                {isRecommended && (
                  <View style={styles.forYouPill}>
                    <Text style={styles.forYouText}>FOR YOU</Text>
                  </View>
                )}

                <View style={styles.playButton}>
                  <Play
                    size={14}
                    color="#FFFFFF"
                    fill="#FFFFFF"
                  />
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {cat.title}
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {cat.itemCount} sessions · {cat.moodTag}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(235, 185, 80, 0.1)", // Gold tint
    borderColor: "rgba(235, 185, 80, 0.3)",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  viewAllText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: theme.colors.gold,
    fontWeight: "500",
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: 156,
  },
  cardContainer: {
    width: 156,
    height: 112,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    justifyContent: "flex-end",
    padding: 10,
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  recommendedBorder: {
    borderWidth: 1,
    borderColor: "rgba(235, 185, 80, 0.6)",
  },
  forYouPill: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(235, 185, 80, 0.95)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  forYouText: {
    fontFamily: theme.typography.body,
    fontSize: 8,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.5,
  },
  playButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    marginTop: "auto",
  },
  cardTitle: {
    fontFamily: theme.typography.display,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
  },
});
