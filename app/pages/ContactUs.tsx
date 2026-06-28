import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Linking } from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

export default function ContactUsScreen() {
  const handleSendEmail = async () => {
    const email = 'nirvaha6@gmail.com';
    const subject = encodeURIComponent('NirVaha Support');
    const mailtoUrl = `mailto:${email}?subject=${subject}`;
    
    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (supported) {
        await Linking.openURL(mailtoUrl);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Could not open mail app',
          text2: 'Please email us directly at nirvaha6@gmail.com',
        });
      }
    } catch (error) {
      console.error('Error opening email client:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while opening the email application.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={['#0A0A0A', '#121C18']} style={StyleSheet.absoluteFill} />
      
      {/* Ambient Orbs */}
      <View style={[styles.orb, styles.orbOne]} />
      <View style={[styles.orb, styles.orbTwo]} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.iconContainer}>
          <View style={styles.mailIconWrapper}>
            <Mail size={32} color={theme.colors.gold} />
          </View>
        </Animated.View>

        <Animated.Text entering={FadeInDown.duration(600).delay(150)} style={styles.title}>
          Contact Us
        </Animated.Text>
        
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.card}>
          <Text style={styles.description}>
            Need assistance, have a question, found a bug, or want to share feedback? We'd love to hear from you.
          </Text>
          <Text style={styles.description}>
            Feel free to contact us anytime using the email below and we'll get back to you as soon as possible.
          </Text>
          
          <View style={styles.emailContainer}>
            <Text style={styles.emailLabel}>Support Email</Text>
            <Pressable onPress={handleSendEmail}>
              <Text style={styles.emailText}>nirvaha6@gmail.com</Text>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(450)} style={styles.btnWrapper}>
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
            ]} 
            onPress={handleSendEmail}
          >
            <Text style={styles.buttonText}>Send Email</Text>
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
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.08,
  },
  orbOne: {
    width: 300,
    height: 300,
    top: -50,
    right: -50,
    backgroundColor: theme.colors.gold,
  },
  orbTwo: {
    width: 250,
    height: 250,
    bottom: -50,
    left: -50,
    backgroundColor: theme.colors.healingGreen,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 20,
  },
  mailIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(212,175,55,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 32,
  },
  description: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  emailContainer: {
    marginTop: 12,
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  emailLabel: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  emailText: {
    fontFamily: theme.typography.body,
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.gold,
    textDecorationLine: 'underline',
  },
  btnWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
