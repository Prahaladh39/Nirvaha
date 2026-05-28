import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import { Download, RefreshCw } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import Toast from 'react-native-toast-message';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function WisdomSelfieResult() {
  const { resultUrl } = useLocalSearchParams<{ resultUrl: string }>();
  const [saving, setSaving] = useState(false);

  const handleSaveToGallery = async () => {
    try {
      setSaving(true);
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'We need permission to save photos.' });
        return;
      }

      // Download the file from Replicate's URL to a temporary local file
      const fileUri = `${FileSystem.documentDirectory}wisdom_selfie_${Date.now()}.jpg`;
      const { uri } = await FileSystem.downloadAsync(resultUrl, fileUri);

      // Save to gallery
      await MediaLibrary.saveToLibraryAsync(uri);
      
      Toast.show({ type: 'success', text1: 'Saved Successfully', text2: 'The image is now in your gallery.' });
    } catch (err) {
      console.error(err);
      Toast.show({ type: 'error', text1: 'Save Failed', text2: 'Something went wrong.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTryAnother = () => {
    // Navigate back to the index screen of wisdom-selfie
    router.replace('/wisdom-selfie');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Wisdom Selfie</Text>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.imageWrapper}>
          <Image source={{ uri: resultUrl }} style={styles.resultImage} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.actions}>
          <Pressable 
            style={[styles.primaryBtn, saving && styles.primaryBtnDisabled]} 
            onPress={handleSaveToGallery}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#0A0A0A" />
            ) : (
              <>
                <Download size={20} color="#0A0A0A" />
                <Text style={styles.primaryBtnText}>Save to Gallery</Text>
              </>
            )}
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={handleTryAnother}>
            <RefreshCw size={20} color="#FFF" />
            <Text style={styles.secondaryBtnText}>Try Another Being</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 40,
    shadowColor: theme.colors.gold,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  resultImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actions: {
    gap: 16,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gold,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#0A0A0A',
    fontFamily: theme.typography.body,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontFamily: theme.typography.body,
    fontSize: 16,
    fontWeight: '600',
  }
});
