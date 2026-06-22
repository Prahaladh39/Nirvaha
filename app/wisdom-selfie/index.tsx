import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Dimensions, Platform, ScrollView } from 'react-native';
import { router, Stack } from 'expo-router';
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Responsive dimensions for the Instagram Reel / YouTube Shorts style preview card
const cardWidth = Math.min(width * 0.7, 280);
const videoHeight = cardWidth * (16 / 9); // Perfect 9:16 aspect ratio for the video container
const cardHeight = videoHeight + 64; // Video height plus the bottom status section height

export default function WisdomSelfieComingSoon() {
  const videoPlayer = useVideoPlayer(require('../../assets/videos/wisdom-selfie.mp4'), vp => {
    vp.loop = true;
    vp.muted = true;
    vp.play();
  });

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundGradientEnd]}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Background glow effect behind the card */}
      <View style={styles.glowCircle} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header containing back button */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.colors.foreground} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Centered Heading and Subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Coming Soon</Text>
            <Text style={styles.subtitle}>
              Experience a new way of reflecting through AI-powered Wisdom Selfies.
            </Text>
          </View>

          {/* Phone-style preview card (Instagram Reel / YouTube Shorts style) */}
          <View style={styles.card}>
            {/* Video container resized to fit 9:16 video naturally */}
            <View style={styles.videoWrapper}>
              <VideoView
                player={videoPlayer}
                style={styles.video}
                nativeControls={false}
                contentFit="contain"
              />
            </View>

            {/* Bottom info section of the phone card */}
            <View style={styles.cardBottom}>
              <View style={styles.cardBottomRow}>
                <Text style={styles.cardBottomText}>Reflection AI Active</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={styles.progressActive} />
              </View>
            </View>
          </View>

          {/* Understated informational text */}
          <View style={styles.bottomInfoContainer}>
            <Text style={styles.bottomInfoText}>
              An immersive AI reflection experience is currently under development. This preview offers a glimpse of what's coming.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  glowCircle: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    backgroundColor: 'rgba(163, 189, 177, 0.22)',
    top: height * 0.22,
    left: -width * 0.1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 8,
    flexDirection: 'row',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 28,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 28,
    color: theme.colors.foreground,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  card: {
    width: cardWidth,
    height: cardHeight,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    shadowColor: '#2D5A4C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
    overflow: 'hidden',
    marginBottom: 32,
  },
  videoWrapper: {
    width: '100%',
    height: videoHeight,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  cardBottom: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardBottomText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: theme.colors.foreground,
    marginLeft: 6,
    fontWeight: '600',
    opacity: 0.9,
  },
  progressBar: {
    width: '80%',
    height: 3,
    backgroundColor: 'rgba(45, 90, 76, 0.1)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressActive: {
    width: '35%',
    height: '100%',
    backgroundColor: theme.colors.gold,
    borderRadius: 1.5,
  },
  bottomInfoContainer: {
    paddingHorizontal: 36,
    alignItems: 'center',
  },
  bottomInfoText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.85,
  },
});




/* =========================================================================
   OLD IMPLEMENTATION COMMENTED OUT BELOW
   =========================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ArrowLeft, Camera, Upload, Sparkles, MonitorUp } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import Animated, { FadeInUp } from 'react-native-reanimated';

const TEMPLATES = [
  { id: 'shiva', name: 'Shiva', image: require('../../assets/images/shiva.png') },
  { id: 'krishna', name: 'Krishna', image: require('../../assets/images/krishna.png') },
  { id: 'rama', name: 'Rama', image: require('../../assets/images/rama.png') },
  { id: 'ganesh', name: 'Ganesh', image: require('../../assets/images/ganesh.png') },
];

export default function WisdomSelfieIndex() {
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelfieUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelfieUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelfieUri(result.assets[0].uri);
    }
  };

  const isReady = selfieUri !== null && selectedTemplate !== null;

  const handleGenerate = () => {
    if (!isReady) return;
    
    // Pass the local asset reference and the user's selfie to the processing screen
    const templateObj = TEMPLATES[selectedTemplate];
    
    router.push({
      pathname: '/wisdom-selfie/processing',
      params: {
        selfieUri,
        templateId: templateObj.id
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Wisdom Selfie</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>1. Choose Your Guide</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
          {TEMPLATES.map((item, index) => (
            <Pressable 
              key={item.id} 
              style={[styles.templateCard, selectedTemplate === index && styles.templateCardSelected]}
              onPress={() => setSelectedTemplate(index)}
            >
              <Image source={item.image} style={styles.templateImage} />
              <View style={[styles.templateOverlay, selectedTemplate === index && styles.templateOverlaySelected]}>
                <Text style={styles.templateName}>{item.name}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>2. Add Your Photo</Text>
        <View style={styles.uploadZone}>
          {selfieUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: selfieUri }} style={styles.previewImage} />
              <View style={styles.previewActions}>
                <Pressable style={styles.actionBtn} onPress={takePhoto}>
                  <Camera size={20} color="#FFF" />
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={pickImage}>
                  <Upload size={20} color="#FFF" />
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={pickDocument}>
                  <MonitorUp size={20} color="#FFF" />
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.emptyZone}>
              <View style={styles.emptyIconContainer}>
                <Camera size={32} color={theme.colors.healingGreen} opacity={0.8} />
              </View>
              <Text style={styles.emptyTitle}>Capture your essence</Text>
              <Text style={styles.emptySubtitle}>Upload a clear, front-facing selfie</Text>
              
              <View style={styles.emptyActions}>
                <Pressable style={styles.primaryBtn} onPress={takePhoto}>
                  <Text style={styles.primaryBtnText}>Take Photo</Text>
                </Pressable>
                <Pressable style={styles.secondaryBtn} onPress={pickImage}>
                  <Text style={styles.secondaryBtnText}>Upload from Gallery</Text>
                </Pressable>
                <Pressable style={styles.secondaryBtn} onPress={pickDocument}>
                  <Text style={styles.secondaryBtnText}>Upload from Desktop</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <Animated.View entering={FadeInUp.duration(400)}>
          <Pressable 
            style={[styles.generateButton, !isReady && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            disabled={!isReady}
          >
            <Sparkles size={20} color={isReady ? '#FFF' : 'rgba(255,255,255,0.4)'} />
            <Text style={[styles.generateText, !isReady && styles.generateTextDisabled]}>
              Generate Wisdom
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    marginTop: 8,
  },
  templatesScroll: {
    marginBottom: 32,
  },
  templateCard: {
    width: 120,
    height: 160,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templateCardSelected: {
    borderColor: theme.colors.gold,
  },
  templateImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  templateOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  templateOverlaySelected: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  templateName: {
    color: '#FFF',
    fontFamily: theme.typography.display,
    fontWeight: '600',
    fontSize: 14,
  },
  uploadZone: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 4,
    marginBottom: 32,
    minHeight: 280,
  },
  previewContainer: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewActions: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  emptyZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(50, 140, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: '#FFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: theme.colors.healingGreen,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#1A2F25',
    fontFamily: theme.typography.body,
    fontWeight: '600',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryBtnText: {
    color: '#FFF',
    fontFamily: theme.typography.body,
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: theme.colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  generateButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  generateText: {
    color: '#332616',
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
  },
  generateTextDisabled: {
    color: 'rgba(255,255,255,0.4)',
  }
});


*/
