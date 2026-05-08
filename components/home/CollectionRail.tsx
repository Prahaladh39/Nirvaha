import { ChevronRight, Clock, Play } from "lucide-react-native";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import { collectionItems } from "../../constants/collectionData";
import { theme } from "../../constants/theme";

// Flatten all collection items and shuffle for variety
const getAllCollectionItems = () => {
  const allItems = Object.values(collectionItems).flat().filter(item => !!item.coverImage);
  // Shuffle array
  return allItems.sort(() => Math.random() - 0.5);
};

export default function CollectionRail() {
  const visible = getAllCollectionItems().slice(0, 6);

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
        {visible.map((item, i) => {
          const isRecommended = i === 0;
          return (
            <Pressable 
              key={item.id} 
              style={styles.card}
              onPress={() => router.push('/collection')}
            >
              <View
                style={[
                  styles.imageContainer,
                  isRecommended && styles.recommendedBorder,
                ]}
              >
                {item.coverImage ? (
                  <Image
                    source={{ uri: item.coverImage }}
                    style={styles.coverImage}
                    contentFit="cover"
                    transition={500}
                  />
                ) : (
                  <View
                    style={[
                      styles.imagePlaceholder,
                      {
                        backgroundColor: isRecommended
                          ? "#4A3B2C"
                          : item.category === "yogasutras"
                            ? "#4A3F55"
                            : item.category === "gita"
                              ? "#5A4422"
                              : item.category === "reset"
                                ? "#273A57"
                                : item.category === "lifestyle"
                                  ? "#2D5A4C"
                                  : "#684B25",
                      },
                    ]}
                  />
                )}

                <View style={styles.gradientOverlay} />

                {isRecommended && (
                  <View style={styles.forYouPill}>
                    <Text style={styles.forYouText}>FOR YOU</Text>
                  </View>
                )}

                {item.duration && (
                  <View style={styles.durationPill}>
                    <Clock size={10} color="#2A3B32" />
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                )}

                <View style={styles.playButton}>
                  <Play
                    size={12}
                    color={theme.colors.background}
                    fill={theme.colors.background}
                    style={{ marginLeft: 2 }}
                  />
                </View>
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
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
    width: 140,
  },
  imageContainer: {
    width: 140,
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
    position: "relative",
    backgroundColor: "#1E1E1E",
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  recommendedBorder: {
    borderWidth: 1,
    borderColor: "rgba(235, 185, 80, 0.6)",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  forYouPill: {
    position: "absolute",
    top: 6,
    left: 6,
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
  },
  durationPill: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  durationText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    fontWeight: "600",
    color: "#2A3B32",
  },
  playButton: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
    lineHeight: 16,
  },
});
