import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Camera, User as UserIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../constants/theme';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileHeader() {
  const [name] = useState("Seeker");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const savedUri = await AsyncStorage.getItem('profile_avatar_uri');
        if (savedUri) {
          const fileInfo = await FileSystem.getInfoAsync(savedUri);
          if (fileInfo.exists) {
            setAvatarUri(`${savedUri}?t=${Date.now()}`);
          }
        }
      } catch (error) {
        console.error('Failed to load avatar:', error);
      }
    };
    loadAvatar();
  }, []);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const originalUri = result.assets[0].uri;

        // Resize the image to 250x250 and compress it to 70% quality (0.7)
        // This ensures the file size is extremely small (~10-15KB) and doesn't bloat local storage or app size.
        const manipResult = await ImageManipulator.manipulateAsync(
          originalUri,
          [{ resize: { width: 250 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        const destUri = `${FileSystem.documentDirectory}avatar.jpg`;
        const fileInfo = await FileSystem.getInfoAsync(destUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(destUri, { idempotent: true });
        }
        await FileSystem.copyAsync({
          from: manipResult.uri,
          to: destUri
        });

        await AsyncStorage.setItem('profile_avatar_uri', destUri);
        setAvatarUri(`${destUri}?t=${Date.now()}`);
      }
    } catch (error) {
      console.error('Failed to pick or process image:', error);
      alert('An error occurred while uploading your profile picture.');
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(600)}
      style={styles.container}
    >
      {/* Avatar Area */}
      <Pressable onPress={handlePickImage} style={styles.avatarWrapper}>
        {/* Outer glow ring */}
        <View style={styles.outerGlow} />
        
        {/* Inner gradient ring */}
        <LinearGradient
          colors={[theme.colors.healingGreen, theme.colors.gold]}
          style={styles.gradientRing}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Avatar circle */}
        <View style={styles.avatarCircle}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <>
              <LinearGradient
                colors={['rgba(50, 140, 140, 0.15)', 'rgba(142, 164, 150, 0.2)']}
                style={StyleSheet.absoluteFill}
              />
              <UserIcon size={48} color={theme.colors.healingGreen} strokeWidth={1} style={{ opacity: 0.7 }} />
            </>
          )}
          
          {/* Camera overlay */}
          <View style={styles.cameraBtn}>
            <Camera size={12} color="#000000" />
          </View>
        </View>
      </Pressable>

      {/* Name & Info */}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.subtitle}>On your journey to clarity</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerGlow: {
    position: 'absolute',
    top: -8,
    bottom: -8,
    left: -8,
    right: -8,
    borderRadius: 60,
    backgroundColor: 'rgba(50, 140, 140, 0.05)',
  },
  gradientRing: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    left: -4,
    right: -4,
    borderRadius: 52,
    opacity: 0.3,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(50, 140, 140, 0.1)',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontFamily: theme.typography.display,
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
});
