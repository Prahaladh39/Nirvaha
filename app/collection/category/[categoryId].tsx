import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Play, PlayCircle } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  collectionCategories,
  CollectionItem,
  collectionItems,
} from "../../../constants/collectionData";
import { theme } from "../../../constants/theme";

export default function CollectionCategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const [activeItem, setActiveItem] = useState<CollectionItem | null>(null);

  const category = useMemo(
    () => collectionCategories.find((item) => item.id === categoryId),
    [categoryId],
  );
  const items = collectionItems[categoryId || ""] || [];

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.missingState}>
          <Text style={styles.missingTitle}>Collection unavailable</Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.replace("/(tabs)/collection" as any)}
          >
            <Text style={styles.primaryButtonText}>Back to collection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.ambientOrb, styles.ambientOne]} />
      <View style={[styles.ambientOrb, styles.ambientTwo]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          entering={FadeInDown.duration(450)}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.replace("/(tabs)/collection" as any)}
            >
              <ArrowLeft size={18} color="#FFFFFF" />
            </Pressable>
            <PlayCircle size={16} color="rgba(255,255,255,0.5)" />
          </View>

          <View
            style={[
              styles.heroCard,
              { backgroundColor: "rgba(255,255,255,0.04)" },
            ]}
          >
            <LinearGradient
              colors={category.colors}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroOrb} />
            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <Text style={styles.heroEmoji}>{category.icon}</Text>
              </View>
              <View style={styles.heroCopy}>
                <Text style={styles.title}>{category.title}</Text>
                <Text style={styles.description}>{category.description}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.moodPill}>
                    <Text style={styles.moodText}>{category.moodTag}</Text>
                  </View>
                  <Text style={styles.trackMeta}>{items.length} videos</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(450).delay(120)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>All Videos</Text>
          <View style={styles.trackList}>
            {items.map((item, index) => (
              <Pressable
                key={item.id}
                style={styles.trackCard}
                onPress={() => setActiveItem(item)}
              >
                <View style={styles.trackIcon}>
                  <Text style={styles.trackEmoji}>{item.icon}</Text>
                </View>
                <View style={styles.trackCopy}>
                  <Text style={styles.trackTitle}>{item.title}</Text>
                  <Text style={styles.trackDescription} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <View style={styles.trackMetaRow}>
                    <View style={styles.trackMoodPill}>
                      <Text style={styles.trackMoodText}>{item.moodTag}</Text>
                    </View>
                    <Text style={styles.trackDuration}>{item.duration}</Text>
                  </View>
                </View>
                <View style={styles.playButton}>
                  <Play
                    size={16}
                    color="#FFFFFF"
                    fill="#FFFFFF"
                    style={styles.playOffset}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(450).delay(280)}
          style={styles.tipCard}
        >
          <Text style={styles.tipText}>
            Find a quiet space and use headphones for the best experience.
          </Text>
        </Animated.View>
      </ScrollView>

      {activeItem && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.videoPreview}
        >
          <View style={styles.videoPreviewContent}>
            <View style={styles.videoPlaceholder}>
              <PlayCircle size={48} color={theme.colors.gold} />
              <Text style={styles.videoPlaceholderText}>Video Player</Text>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{activeItem.title}</Text>
              <Text style={styles.videoDuration}>{activeItem.duration}</Text>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={() => setActiveItem(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  ambientOrb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.13,
  },
  ambientOne: {
    width: 200,
    height: 200,
    top: "8%",
    right: -70,
    backgroundColor: theme.colors.healingGreen,
  },
  ambientTwo: {
    width: 150,
    height: 150,
    bottom: "32%",
    left: -55,
    backgroundColor: theme.colors.gold,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 130,
  },
  header: {
    marginBottom: 26,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    borderRadius: 24,
    overflow: "hidden",
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  heroOrb: {
    position: "absolute",
    top: -34,
    right: -34,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroEmoji: {
    fontSize: 32,
  },
  heroCopy: {
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  description: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: "rgba(255,255,255,0.68)",
    lineHeight: 18,
    marginTop: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  moodPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  moodText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: "#FFFFFF",
  },
  trackMeta: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 14,
  },
  trackList: {
    gap: 12,
  },
  trackCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  trackIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(45,90,76,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  trackEmoji: {
    fontSize: 22,
  },
  trackCopy: {
    flex: 1,
  },
  trackTitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  trackDescription: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    marginTop: 3,
  },
  trackMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 7,
  },
  trackMoodPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "rgba(45,90,76,0.12)",
  },
  trackMoodText: {
    fontFamily: theme.typography.body,
    fontSize: 9,
    color: theme.colors.healingGreenLight,
  },
  trackDuration: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  playOffset: {
    marginLeft: 2,
  },
  tipCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(45,90,76,0.08)",
    borderWidth: 1,
    borderColor: "rgba(45,90,76,0.16)",
    alignItems: "center",
  },
  tipText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    lineHeight: 18,
  },
  missingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  missingTitle: {
    fontFamily: theme.typography.display,
    fontSize: 22,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryButtonText: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primaryForeground,
  },
  videoPreview: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(10,10,10,0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    padding: 16,
  },
  videoPreviewContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  videoPlaceholder: {
    width: 80,
    height: 60,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  videoPlaceholderText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    marginTop: 4,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  videoDuration: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});
