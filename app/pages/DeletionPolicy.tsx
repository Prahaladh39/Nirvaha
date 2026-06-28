import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView, Linking, Platform, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Constants from 'expo-constants';

const BulletItem = ({ text }: { text: string }) => (
  <View style={styles.bulletItemContainer}>
    <Text style={styles.bulletPoint}>•</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

export default function DeletionPolicyScreen() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) {
        setFetchingProfile(false);
        return;
      }
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (err) {
        console.error('Error fetching Firestore user profile:', err);
      } finally {
        setFetchingProfile(false);
      }
    }
    fetchUserData();
  }, [user]);

  const handleSendDeletionRequest = async () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Sign in required',
        text2: 'Please sign in to submit a deletion request.',
      });
      return;
    }

    const email = 'nirvaha6@gmail.com';
    const subject = encodeURIComponent('Account Deletion Request');

    const fullName = userData?.name || user.displayName || 'Not Provided';
    const registeredEmail = user.email || userData?.email || 'Not Provided';
    const registeredPhone = user.phoneNumber || userData?.phone || userData?.phoneNumber || 'Not Provided';
    const uid = user.uid;
    
    let creationDate = 'Not Provided';
    if (user.metadata.creationTime) {
      creationDate = new Date(user.metadata.creationTime).toLocaleString();
    } else if (userData?.createdAt) {
      creationDate = new Date(userData.createdAt).toLocaleString();
    }

    const currentDate = new Date().toLocaleString();
    const platform = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : Platform.OS;
    const appVersion = Constants.expoConfig?.version || 'Not Provided';

    const bodyText = `Full Name: ${fullName}
Registered Email Address: ${registeredEmail}
Registered Phone Number (if available): ${registeredPhone}
Firebase UID: ${uid}
Account Creation Date: ${creationDate}
Current Date: ${currentDate}
Device Platform (Android/iOS): ${platform}
App Version: ${appVersion}

Reason for deletion:

____________________________________`;

    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;

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
        <Text style={styles.headerTitle}>Deletion Policy</Text>
        <View style={{ width: 40 }} /> {/* spacer to balance back button */}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.card}>
          <Text style={styles.policyTitle}>Request Account Deletion</Text>
          <Text style={styles.paragraph}>
            At Nirvaha, we respect your privacy and your right to control your personal data.
          </Text>
          <Text style={styles.paragraph}>
            If you no longer wish to use Nirvaha, you can permanently delete your account and the personal data associated with it.
          </Text>

          <Text style={styles.sectionTitle}>Delete Your Account Through the App</Text>
          <Text style={styles.paragraph}>
            The quickest way to delete your account is directly within the Nirvaha app.
          </Text>
          <Text style={styles.boldLabel}>Go to:</Text>
          <Text style={styles.codeBlock}>Profile → Delete Account</Text>
          <Text style={styles.paragraph}>
            Follow the on-screen instructions to permanently delete your account.
          </Text>

          <Text style={styles.sectionTitle}>Can't Access Your Account?</Text>
          <Text style={styles.paragraph}>
            If you're unable to log in or access the app, you can request account deletion by contacting our support team.
          </Text>
          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>nirvaha6@gmail.com</Text>
            <Text style={styles.infoLabel}>Subject</Text>
            <Text style={styles.infoValue}>Account Deletion Request</Text>
          </View>
          
          <Text style={styles.boldLabel}>Please include:</Text>
          <BulletItem text="Full Name" />
          <BulletItem text="Registered Email Address" />
          <BulletItem text="Registered Phone Number (if applicable)" />
          <BulletItem text="Reason for deletion (Optional)" />
          
          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            To protect your privacy, we may ask you to verify your identity before processing your request.
          </Text>

          <Text style={styles.sectionTitle}>What Will Be Deleted</Text>
          <Text style={styles.paragraph}>
            Once your deletion request is verified and processed, the following information will be permanently deleted from Nirvaha:
          </Text>
          <BulletItem text="Your account profile" />
          <BulletItem text="Name" />
          <BulletItem text="Email address" />
          <BulletItem text="Phone number (if provided)" />
          <BulletItem text="Profile photo" />
          <BulletItem text="Mood tracking history" />
          <BulletItem text="Journal entries and reflections" />
          <BulletItem text="Wellness progress and activity history" />
          <BulletItem text="Session history" />
          <BulletItem text="App preferences" />
          <BulletItem text="Uploaded files or media linked to your account" />
          <BulletItem text="Authentication credentials" />
          <BulletItem text="Any other personal information associated with your account" />

          <Text style={styles.sectionTitle}>Data That May Be Retained</Text>
          <Text style={styles.paragraph}>
            Some limited information may be retained where required to:
          </Text>
          <BulletItem text="Comply with applicable laws and regulations" />
          <BulletItem text="Prevent fraud or abuse" />
          <BulletItem text="Resolve disputes" />
          <BulletItem text="Enforce our Terms of Service" />
          <BulletItem text="Maintain security and system integrity" />
          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            Any retained information will only be kept for these legal or security purposes and will not be used for advertising or marketing.
          </Text>

          <Text style={styles.sectionTitle}>Processing Time</Text>
          <Text style={styles.paragraph}>
            We aim to process verified account deletion requests within <Text style={styles.boldText}>30 days</Text>.
          </Text>
          <Text style={styles.paragraph}>
            Once your request has been completed, you will receive a confirmation email informing you that your account has been permanently deleted.
          </Text>

          <Text style={styles.sectionTitle}>Important Information</Text>
          <Text style={styles.paragraph}>
            Please note that account deletion is <Text style={styles.boldText}>permanent</Text>.
          </Text>
          <Text style={styles.paragraph}>
            After your account has been deleted:
          </Text>
          <BulletItem text="Your account cannot be recovered." />
          <BulletItem text="Your personal data cannot be restored." />
          <BulletItem text="Your journals, mood history, and wellness records will be permanently removed." />
          <BulletItem text="You will need to create a new account if you wish to use Nirvaha again in the future." />
          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            If you have an active subscription purchased through <Text style={styles.boldText}>Google Play</Text> or the <Text style={styles.boldText}>Apple App Store</Text>, deleting your account does <Text style={styles.boldText}>not</Text> automatically cancel your subscription. Please cancel your subscription through the platform where it was purchased before deleting your account.
          </Text>

          <Text style={styles.sectionTitle}>Need Assistance?</Text>
          <Text style={styles.paragraph}>
            If you have any questions regarding account deletion or your personal data, we're here to help.
          </Text>
          <Text style={[styles.paragraph, { fontWeight: '600', color: theme.colors.gold }]}>
            Email: nirvaha6@gmail.com
          </Text>
          <Text style={styles.paragraph}>
            Thank you for being part of the Nirvaha community.
          </Text>
        </Animated.View>

        {fetchingProfile ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={theme.colors.gold} />
          </View>
        ) : user ? (
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.buttonContainer}>
            <Pressable 
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
              ]} 
              onPress={handleSendDeletionRequest}
            >
              <Text style={styles.buttonText}>Send Deletion Request</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              Please sign in to submit an account deletion request.
            </Text>
            <Pressable 
              style={[styles.primaryButton, styles.disabledButton]} 
              disabled={true}
            >
              <Text style={[styles.buttonText, { color: 'rgba(255,255,255,0.3)' }]}>Send Deletion Request</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
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
    opacity: 0.06,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
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
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 24,
  },
  policyTitle: {
    fontFamily: theme.typography.display,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.healingGreenLight,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  boldLabel: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  codeBlock: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.gold,
    backgroundColor: 'rgba(212,175,55,0.08)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
  },
  infoGroup: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  infoLabel: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 10,
  },
  bulletItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 4,
  },
  bulletPoint: {
    color: theme.colors.gold,
    fontSize: 16,
    marginRight: 8,
    lineHeight: 20,
  },
  bulletText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    flex: 1,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButton: {
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
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disclaimerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  disclaimerText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 12,
  },
});
