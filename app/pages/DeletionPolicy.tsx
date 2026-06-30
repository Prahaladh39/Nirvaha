import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  SafeAreaView, 
  ScrollView, 
  Linking, 
  Platform, 
  ActivityIndicator, 
  Modal, 
  TextInput, 
  Alert 
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Trash2, ShieldAlert, Eye, EyeOff } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  deleteUser, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  writeBatch 
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
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
  
  // Deletion state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Check if user requires password re-authentication
  const requiresPasswordReauth = (): boolean => {
    if (!user) return false;
    return user.providerData.some(provider => provider.providerId === 'password');
  };

  const initiateDeleteFlow = () => {
    if (!user) return;
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmModal(false);
    if (requiresPasswordReauth()) {
      setPassword('');
      setShowPasswordModal(true);
    } else {
      executeDeletion();
    }
  };

  const handlePasswordSubmit = () => {
    if (!password.trim()) {
      Alert.alert("Password Required", "Please enter your password to confirm deletion.");
      return;
    }
    setShowPasswordModal(false);
    executeDeletion(password.trim());
  };

  const executeDeletion = async (authPassword?: string) => {
    if (!user) return;
    setIsDeleting(true);

    try {
      // 1. Re-authenticate if password is provided
      if (authPassword && user.email) {
        const credential = EmailAuthProvider.credential(user.email, authPassword);
        await reauthenticateWithCredential(user, credential);
      }

      console.warn(`[SECURITY AUDIT] Commencing complete data wipe for user UID: ${user.uid}`);

      // 2. Transactional Firestore Wipe
      const batch = writeBatch(db);
      const uid = user.uid;

      // Delete Profile Doc
      const userDocRef = doc(db, 'users', uid);
      batch.delete(userDocRef);

      // Delete Mood Logs
      const moodLogsRef = collection(db, `users/${uid}/moodLogs`);
      const moodLogsSnap = await getDocs(moodLogsRef);
      moodLogsSnap.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Delete Notifications
      const notificationsRef = collection(db, `users/${uid}/notifications`);
      const notificationsSnap = await getDocs(notificationsRef);
      notificationsSnap.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Delete User-authored community posts
      const spacePostsRef = collection(db, 'spacePosts');
      const userPostsQuery = query(spacePostsRef, where('authorId', '==', uid));
      const userPostsSnap = await getDocs(userPostsQuery);
      userPostsSnap.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Commit Firestore deletes
      await batch.commit();
      console.warn(`[SECURITY AUDIT] Firestore records successfully purged for UID: ${user.uid}`);

      // 3. Clear all AsyncStorage data
      await AsyncStorage.clear();
      console.warn(`[SECURITY AUDIT] Local AsyncStorage successfully cleared`);

      // 4. Delete user record in Firebase Auth
      await deleteUser(user);
      console.warn(`[SECURITY AUDIT] Firebase Auth account successfully deleted`);

      Toast.show({
        type: 'success',
        text1: 'Account Deleted',
        text2: 'Your account and personal data have been completely erased.',
      });

      // 5. Redirect back to Welcome screen
      setTimeout(() => {
        router.replace('/pages/Welcome');
      }, 1000);

    } catch (error: any) {
      console.error('[SECURITY ERROR] Account deletion failed:', error);
      let errorMsg = 'An unexpected error occurred. Please verify your internet connection and try again.';
      
      if (error.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password. Re-authentication failed.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMsg = 'For security reasons, please sign out and sign back in before deleting your account.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMsg = 'Network connection failed. Please check your internet connection.';
      }

      Alert.alert(
        "Deletion Failed",
        errorMsg,
        [
          { 
            text: "Retry", 
            onPress: () => {
              if (requiresPasswordReauth()) {
                setShowPasswordModal(true);
              } else {
                executeDeletion();
              }
            } 
          },
          { text: "Cancel", style: "cancel" }
        ]
      );
    } finally {
      setIsDeleting(false);
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
            The quickest way to delete your account and instantly purge all of your private records is directly within this screen.
          </Text>
          <Text style={styles.paragraph}>
            Clicking the red button below will start the secure in-app deletion process.
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
            In-app deletion requests are processed **instantly**. Your database documents and local sessions are cleared on the spot. Manual requests via email may take up to <Text style={styles.boldText}>30 days</Text>.
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

        {fetchingProfile || isDeleting ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={theme.colors.gold} />
            {isDeleting && <Text style={styles.deletingText}>Purging account data...</Text>}
          </View>
        ) : user ? (
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.buttonContainer}>
            <Pressable 
              style={({ pressed }) => [
                styles.primaryButton,
                styles.dangerButton,
                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
              ]} 
              onPress={initiateDeleteFlow}
            >
              <Text style={styles.buttonText}>Delete My Account</Text>
            </Pressable>
            
            <Pressable 
              style={({ pressed }) => [
                styles.secondaryMailButton,
                pressed && { opacity: 0.8 }
              ]} 
              onPress={handleSendDeletionRequest}
            >
              <Text style={styles.secondaryMailButtonText}>Request Deletion Via Email</Text>
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
              <Text style={[styles.buttonText, { color: 'rgba(255,255,255,0.3)' }]}>Delete My Account</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>

      {/* ─── MODALS ─────────────────────────────────────────────────── */}

      {/* 1. Confirm Deletion Warning Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ShieldAlert size={48} color="#D32F2F" style={{ marginBottom: 16 }} />
            <Text style={styles.modalTitle}>Permanent Action Warning</Text>
            <Text style={styles.modalText}>
              Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone. All journals, progress stats, settings, and conversations will be deleted forever.
            </Text>
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelBtn]} 
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelBtnText}>Keep Account</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.confirmBtn]} 
                onPress={handleConfirmDelete}
              >
                <Text style={styles.confirmBtnText}>Delete Permanently</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. Password Re-authentication Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 360 }]}>
            <Trash2 size={40} color="#D32F2F" style={{ marginBottom: 12 }} />
            <Text style={styles.modalTitle}>Confirm Your Identity</Text>
            <Text style={styles.modalText}>
              Please enter your password to authorize this action.
            </Text>

            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor="rgba(255,255,255,0.3)"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoFocus={true}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? (
                  <EyeOff size={18} color="rgba(255,255,255,0.6)" />
                ) : (
                  <Eye size={18} color="rgba(255,255,255,0.6)" />
                )}
              </Pressable>
            </View>

            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelBtn]} 
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.confirmBtn]} 
                onPress={handlePasswordSubmit}
              >
                <Text style={styles.confirmBtnText}>Confirm Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
    gap: 8,
  },
  deletingText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
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
  dangerButton: {
    backgroundColor: '#D32F2F',
    shadowColor: '#D32F2F',
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
  secondaryMailButton: {
    paddingVertical: 10,
  },
  secondaryMailButtonText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'underline',
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
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#161B19',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  modalTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cancelBtnText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  confirmBtn: {
    backgroundColor: '#D32F2F',
  },
  confirmBtnText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Password prompt specific styles
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: '#FFFFFF',
  },
  eyeIcon: {
    padding: 8,
  },
});
