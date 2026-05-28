import re

file_path = r'c:\Users\venkat66\OneDrive\Desktop\NirVahaApp\app\wisdom-selfie\index.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    old_content = f.read()

new_content = """import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Dimensions } from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { useVideoPlayer, VideoView } from 'expo-video';

const { width } = Dimensions.get('window');

export default function WisdomSelfieComingSoon() {
  const videoPlayer = useVideoPlayer(require('../../assets/videos/wisdom-demo.mp4'), vp => {
    vp.loop = true;
    vp.muted = true;
    vp.play();
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Wisdom Selfie</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.videoContainer}>
          <VideoView 
            player={videoPlayer} 
            style={StyleSheet.absoluteFill} 
            nativeControls={false}
            contentFit="cover"
          />
        </View>
        <Text style={styles.comingSoonText}>Coming Soon...</Text>
        
        <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#000" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Go Back</Text>
        </Pressable>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  videoContainer: {
    width: width - 80,
    height: width - 80,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 40,
  },
  comingSoonText: {
    fontFamily: theme.typography.display,
    fontSize: 32,
    color: theme.colors.gold,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 40,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
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

""" + old_content.replace('*/', '* /') + """

*/
"""

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Replaced wisdom-selfie/index.tsx')
