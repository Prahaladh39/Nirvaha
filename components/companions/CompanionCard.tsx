import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../constants/theme';
import { Companion } from '../../constants/companionsData';
import { router } from 'expo-router';

interface CompanionCardProps {
  companion: Companion;
  width?: number;
  height?: number;
}

export default function CompanionCard({ companion, width = 140, height = 180 }: CompanionCardProps) {
  return (
    <Pressable 
      style={[styles.card, { width, height }]}
      onPress={() => router.push(`/companions/${companion.id}`)}
    >
      <Image
        source={typeof companion.imageUrl === 'string' ? { uri: companion.imageUrl } : companion.imageUrl}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <View style={styles.onlineIndicator} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{companion.name}</Text>
        <Text style={styles.category} numberOfLines={1}>{companion.title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#2A3B32',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  onlineIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  name: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  category: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
});
