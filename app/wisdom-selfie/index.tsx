import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Dimensions } from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function WisdomSelfieComingSoon() {
  const [showText, setShowText] = useState(false);

  const videoPlayer = useVideoPlayer(require('../../assets/videos/wisdom-selfie.mp4'), vp => {
    vp.loop = true;
    vp.muted = false;
    vp.play();
  });

  useEffect(() => {
    const subscription = videoPlayer.addListener('playToEnd', () => {
      setShowText(true);
    });
    return () => {
      subscription.remove();
    };
  }, [videoPlayer]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={StyleSheet.absoluteFill}>
        <VideoView 
          player={videoPlayer} 
          style={StyleSheet.absoluteFill} 
          nativeControls={false}
          contentFit="contain"
        />
        <LinearGradient 
          colors={['rgba(0,0,0,0.8)', 'transparent', 'transparent', 'rgba(0,0,0,0.9)']}
          locations={[0, 0.2, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Wisdom Selfie</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {showText && (
            <Animated.Text entering={FadeIn.duration(1000)} style={styles.comingSoonText}>
              Coming Soon...
            </Animated.Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 60,
  },
  comingSoonText: {
    fontFamily: theme.typography.display,
    fontSize: 32,
    color: theme.colors.gold,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 30,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryBtnText: {
    color: '#000',
    fontFamily: theme.typography.body,
    fontWeight: '600',
    fontSize: 16,
  }
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
