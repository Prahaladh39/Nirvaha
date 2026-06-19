import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { theme } from '../../constants/theme';

export interface ShareCardProps {
  name: string;
  label: string;
  oneLiner: string;
  artwork: any;
  percentage: string;
  themeColor: string;
  accentDark: string;
}

export const ShareCardGenerator = React.forwardRef<ViewShot, ShareCardProps>(
  ({ name, label, oneLiner, artwork, percentage, themeColor, accentDark }, ref) => {
    return (
      <View style={styles.offscreenContainer}>
        <ViewShot
          ref={ref}
          options={{
            format: 'png',
            quality: 1.0,
            result: 'tmpfile',
          }}
        >
          <View style={[styles.card, { backgroundColor: accentDark || '#0A0A0A' }]}>
            {/* Elegant Outer Gold Border Gradient */}
            <LinearGradient
              colors={['#DFB86C', '#9F783C', '#F3E5AB', '#9F783C', '#DFB86C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.borderGradient}
            >
              <View style={[styles.innerCard, { backgroundColor: `${accentDark}EE` || '#0A0A0A' }]}>
                
                {/* Sacred Geometry SVG Pattern Overlay */}
                <View style={StyleSheet.absoluteFill}>
                  <Svg height="100%" width="100%" viewBox="0 0 1080 1350">
                    <G stroke={themeColor || '#DFB86C'} strokeWidth="1" fill="none" opacity="0.08">
                      {/* Central Flower of Life Pattern */}
                      <Circle cx="540" cy="450" r="180" />
                      <Circle cx="540" cy="270" r="180" />
                      <Circle cx="540" cy="630" r="180" />
                      <Circle cx="360" cy="450" r="180" />
                      <Circle cx="720" cy="450" r="180" />
                      
                      <Circle cx="450" cy="360" r="180" />
                      <Circle cx="630" cy="360" r="180" />
                      <Circle cx="450" cy="540" r="180" />
                      <Circle cx="630" cy="540" r="180" />
                      
                      <Circle cx="540" cy="450" r="360" />
                      <Circle cx="540" cy="450" r="540" strokeWidth="2" strokeDasharray="10, 10" />

                      {/* Sacred Rays / Diagonals */}
                      <Path d="M0 0 L1080 1350" />
                      <Path d="M1080 0 L0 1350" />
                      <Path d="M540 0 L540 1350" strokeWidth="0.5" />
                      <Path d="M0 675 L1080 675" strokeWidth="0.5" />
                    </G>
                  </Svg>
                </View>

                {/* Card Glowing Highlights */}
                <View style={[styles.glowLeft, { backgroundColor: `${themeColor}15` }]} />
                <View style={[styles.glowRight, { backgroundColor: `${themeColor}10` }]} />

                {/* Top Branding Section */}
                <View style={styles.header}>
                  <Text style={[styles.brandText, { color: themeColor }]}>NIRVAHA</Text>
                  <View style={[styles.brandDivider, { backgroundColor: themeColor }]} />
                  <Text style={styles.cardType}>ANCIENT archetype COLLECTIBLE</Text>
                </View>

                {/* Character Artwork with Golden Frame */}
                <View style={styles.artworkWrapper}>
                  {/* Subtle Background Glow behind the Artwork */}
                  <View style={[styles.artworkGlow, { shadowColor: themeColor }]} />
                  <LinearGradient
                    colors={['#DFB86C', '#503810', '#DFB86C']}
                    style={styles.artworkBorder}
                  >
                    <View style={styles.artworkInner}>
                      {artwork ? (
                        <Image source={artwork} style={styles.artworkImage} />
                      ) : (
                        <View style={[styles.artworkPlaceholder, { backgroundColor: '#1A1A1A' }]} />
                      )}
                    </View>
                  </LinearGradient>

                  {/* Sleek Match Percentage Badge */}
                  <View style={[styles.matchBadge, { borderColor: themeColor, backgroundColor: accentDark }]}>
                    <Text style={[styles.matchBadgeText, { color: themeColor }]}>{percentage}% MATCH</Text>
                  </View>
                </View>

                {/* Character Details & Description */}
                <View style={styles.detailsContainer}>
                  <Text style={[styles.characterName, { color: themeColor }]}>{name.toUpperCase()}</Text>
                  <Text style={styles.characterLabel}>{label.toUpperCase()}</Text>
                  
                  {/* Luxury Accent Line */}
                  <View style={styles.accentSeparator}>
                    <View style={[styles.accentLine, { backgroundColor: themeColor }]} />
                    <View style={[styles.accentDiamond, { backgroundColor: themeColor }]} />
                    <View style={[styles.accentLine, { backgroundColor: themeColor }]} />
                  </View>

                  <Text style={styles.description}>{oneLiner}</Text>
                </View>

                {/* Footer Branding & App Link */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Discover your Ancient Character — A Spiritual Wellness Experience
                  </Text>
                  <Text style={[styles.appLinkText, { color: themeColor }]}>
                    nirvaha-app.vercel.app
                  </Text>
                </View>

              </View>
            </LinearGradient>
          </View>
        </ViewShot>
      </View>
    );
  }
);

ShareCardGenerator.displayName = 'ShareCardGenerator';

const styles = StyleSheet.create({
  offscreenContainer: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    opacity: 0,
  },
  card: {
    width: 1080,
    height: 1350,
  },
  borderGradient: {
    flex: 1,
    padding: 12, // The 12px outer gold border
  },
  innerCard: {
    flex: 1,
    padding: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  glowLeft: {
    position: 'absolute',
    left: -100,
    top: 200,
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  glowRight: {
    position: 'absolute',
    right: -100,
    bottom: 200,
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  brandText: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontWeight: '700',
    letterSpacing: 8,
  },
  brandDivider: {
    width: 80,
    height: 1,
    marginVertical: 12,
    opacity: 0.5,
  },
  cardType: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 4,
    fontWeight: '600',
  },
  artworkWrapper: {
    position: 'relative',
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkGlow: {
    position: 'absolute',
    width: 580,
    height: 580,
    borderRadius: 290,
    opacity: 0.25,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
  },
  artworkBorder: {
    width: 560,
    height: 560,
    padding: 4,
    borderRadius: 16,
  },
  artworkInner: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0A0A0A',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  artworkPlaceholder: {
    width: '100%',
    height: '100%',
  },
  matchBadge: {
    position: 'absolute',
    bottom: -15,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  matchBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    fontWeight: '700',
    letterSpacing: 2,
  },
  detailsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  characterName: {
    fontSize: 54,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 4,
  },
  characterLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
    letterSpacing: 4,
    textAlign: 'center',
    opacity: 0.8,
  },
  accentSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 24,
    marginVertical: 14,
  },
  accentLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  accentDiamond: {
    width: 6,
    height: 6,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 10,
    opacity: 0.7,
  },
  description: {
    fontSize: 24,
    fontFamily: 'Inter_400Regular',
    color: '#D1D5DB',
    lineHeight: 36,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: 6,
  },
  appLinkText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    fontWeight: '600',
    letterSpacing: 2,
  },
});
