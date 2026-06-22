import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '../../constants/theme';
import { CHARACTERS } from '../../constants/ancientCharacterQuizData';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Sparkles, ArrowRight, ChevronLeft, Share2, Copy } from 'lucide-react-native';
import ViewShot from 'react-native-view-shot';
import { ShareCardGenerator } from '../../components/sharing/ShareCardGenerator';
import { ShareService } from '../../components/sharing/ShareService';
import Toast from 'react-native-toast-message';


export default function QuizResultScreen() {
  const { primary, secondary, percentage } = useLocalSearchParams<{ primary: string; secondary: string; percentage: string }>();
  
  const primaryChar = CHARACTERS[primary] || CHARACTERS['rama'];
  const secondaryChar = CHARACTERS[secondary] || CHARACTERS['sita'];

  const [sharing, setSharing] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  const handleShare = async () => {
    try {
      setSharing(true);
      await ShareService.shareCard(viewShotRef, primaryChar.name);
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Sharing Failed',
        text2: err.message || 'Something went wrong while generating the card.',
      });
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = async () => {
    await ShareService.copyShareText(
      `Discover your Ancient Character with Nirvaha — a modern spiritual wellness app inspired by ancient Indian wisdom.`
    );
  };


  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: primaryChar.accentDark }]}>
      <View style={[styles.navBar, { paddingTop: Platform.OS === 'android' ? 50 : 20 }]}>
        <Pressable onPress={() => router.push('/')} style={styles.backBtnTop}>
          <ChevronLeft color={primaryChar.themeColor} size={24} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.headerBlock}>
          <View style={styles.matchBadgeContainer}>
            <View style={[styles.matchBadge, { backgroundColor: `${primaryChar.themeColor}20`, borderColor: primaryChar.themeColor }]}>
              <Sparkles size={14} color={primaryChar.themeColor} />
              <Text style={[styles.matchBadgeText, { color: primaryChar.themeColor }]}>{percentage}% match</Text>
            </View>
          </View>
          
          <Text style={styles.introText}>You most strongly resonate with...</Text>
          <Text style={[styles.characterName, { color: primaryChar.themeColor }]}>{primaryChar.name}</Text>
          <Text style={styles.characterLabel}>{primaryChar.label}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.section}>
          <Text style={styles.description}>{primaryChar.desc}</Text>
          
          <View style={styles.qualitiesContainer}>
            {primaryChar.qualities.map((quality, idx) => (
              <View key={idx} style={[styles.qualityPill, { borderColor: `${primaryChar.themeColor}40` }]}>
                <Text style={styles.qualityText}>{quality}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(450)} style={styles.shareSection}>
          <Pressable 
            style={[
              styles.shareBtn, 
              { 
                backgroundColor: primaryChar.themeColor,
                shadowColor: primaryChar.themeColor,
              }
            ]} 
            onPress={handleShare}
            disabled={sharing}
          >
            {sharing ? (
              <ActivityIndicator color={primaryChar.accentDark} size="small" />
            ) : (
              <>
                <Share2 size={20} color={primaryChar.accentDark} />
                <Text style={[styles.shareBtnText, { color: primaryChar.accentDark }]}>Share Resonance Card</Text>
              </>
            )}
          </Pressable>

          <Pressable style={styles.copyBtn} onPress={handleCopy}>
            <Copy size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.copyBtnText}>Copy Share Text</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Suggestions</Text>
          <View style={styles.growthContainer}>
            {primaryChar.growth.map((tip, idx) => (
              <View key={idx} style={styles.growthItem}>
                <View style={[styles.growthBullet, { backgroundColor: primaryChar.themeColor }]} />
                <Text style={styles.growthText}>{tip}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(750)} style={styles.footerBlock}>

          <View style={styles.secondaryCard}>
            <Text style={styles.secondaryLabel}>Secondary Resonance</Text>
            <View style={styles.secondaryRow}>
              <Text style={styles.secondaryName}>{secondaryChar.name}</Text>
              <Text style={styles.secondarySubLabel}> — {secondaryChar.label}</Text>
            </View>
          </View>
        </Animated.View>

      </ScrollView>

      <ShareCardGenerator
        ref={viewShotRef}
        name={primaryChar.name}
        label={primaryChar.label}
        oneLiner={primaryChar.oneLiner}
        artwork={primaryChar.artwork}
        percentage={percentage || '0'}
        themeColor={primaryChar.themeColor}
        accentDark={primaryChar.accentDark}
      />

      <View style={styles.bottomBar}>
        <Pressable 
          style={[styles.retakeBtn, { borderColor: primaryChar.themeColor }]}
          onPress={() => router.push('/ancient-character-quiz')}
        >
          <Text style={[styles.retakeBtnText, { color: primaryChar.themeColor }]}>Retake Quiz</Text>
          <ArrowRight size={18} color={primaryChar.themeColor} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  shareSection: {
    marginVertical: 10,
    alignItems: 'center',
    gap: 12,
    marginBottom: 36,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    borderRadius: 16,
    gap: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  shareBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  copyBtnText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  navBar: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  backBtnTop: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10, // Reduced since navBar has the top padding
    paddingBottom: 120, // space for bottom bar
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 40,
  },
  matchBadgeContainer: {
    marginBottom: 24,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  matchBadgeText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    fontWeight: '600',
  },
  introText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  characterName: {
    fontFamily: theme.typography.display,
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  characterLabel: {
    fontFamily: theme.typography.body,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 40,
  },
  description: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 26,
    marginBottom: 24,
    textAlign: 'center',
  },
  qualitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  qualityPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  qualityText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  growthContainer: {
    gap: 16,
  },
  growthItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 16,
  },
  growthBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },
  growthText: {
    flex: 1,
    fontFamily: theme.typography.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
  },
  footerBlock: {
    marginTop: 10,
  },
  secondaryCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  secondaryLabel: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryName: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondarySubLabel: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    gap: 8,
  },
  retakeBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 16,
    fontWeight: '600',
  },
});
