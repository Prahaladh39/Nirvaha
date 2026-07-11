import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import ScreenContainer from '../ui/ScreenContainer';
import { Mail, X, CheckCircle } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { theme } from '../../constants/theme';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ visible, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Email format validator
  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  };

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendReset = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Toast.show({
        type: 'error',
        text1: 'Required Field',
        text2: 'Please enter your email address.',
      });
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      });
      return;
    }

    if (cooldown > 0) {
      Toast.show({
        type: 'error',
        text1: 'Please wait',
        text2: `You can request another link in ${cooldown} seconds.`,
      });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setIsSent(true);
      setCooldown(60); // 60 seconds rate limit cooldown
      
      console.log(`[SECURITY] Password reset requested for format-verified email.`);
      
      Toast.show({
        type: 'success',
        text1: 'Verification Sent',
        text2: 'If an account exists with this email address, a password reset link has been sent.',
      });
    } catch (error: any) {
      console.error('Password Reset Error:', error);
      
      // Suppress auth/user-not-found error to prevent account enumeration
      if (error.code === 'auth/user-not-found') {
        setIsSent(true);
        setCooldown(60);
        console.log(`[SECURITY] Password reset request suppressed auth/user-not-found for enumeration protection.`);
        Toast.show({
          type: 'success',
          text1: 'Verification Sent',
          text2: 'If an account exists with this email address, a password reset link has been sent.',
        });
        setLoading(false);
        return;
      }
      
      let userFriendlyMessage = 'Could not send reset email. Please try again.';
      if (error.code === 'auth/invalid-email') {
        userFriendlyMessage = 'The email address is formatted incorrectly.';
      } else if (error.code === 'auth/too-many-requests') {
        userFriendlyMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        userFriendlyMessage = 'Network error. Please check your internet connection.';
      }

      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: userFriendlyMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMailApp = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('message:');
      } else {
        await Linking.openURL('mailto:');
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Could not open mail app',
        text2: 'Please open your email client manually.',
      });
    }
  };

  const handleModalClose = () => {
    setIsSent(false);
    setEmail('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleModalClose}
    >
      <ScreenContainer
        avoidKeyboard
        statusBarStyle="dark"
        style={styles.safeArea}
      >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Password Recovery</Text>
            <Pressable onPress={handleModalClose} style={styles.closeButton} accessibilityLabel="Close recovery modal">
              <X size={22} color={theme.colors.foreground} />
            </Pressable>
          </View>

          {/* Body Content */}
          <View style={styles.container}>
            {!isSent ? (
              <View style={styles.formContent}>
                <Text style={styles.title}>Forgot Password?</Text>
                
                <Text style={styles.subtitle}>
                  Enter the email address associated with your Nirvaha account, and we{"'"}ll send you a secure link to reset your password.
                </Text>

                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={[
                    styles.inputContainer,
                    email.length > 0 && !isValidEmail(email) && styles.inputErrorBorder,
                    email.length > 0 && isValidEmail(email) && styles.inputSuccessBorder
                  ]}>
                    <Mail size={18} color={theme.colors.mutedForeground} style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="your@email.com"
                      placeholderTextColor={theme.colors.mutedForeground}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!loading}
                    />
                  </View>
                  {email.length > 0 && !isValidEmail(email) && (
                    <Text style={styles.errorText}>Invalid email format</Text>
                  )}
                  {email.length > 0 && isValidEmail(email) && (
                    <Text style={styles.successText}>Valid email format</Text>
                  )}
                </View>

                {/* Submit button */}
                <Pressable
                  style={[
                    styles.submitButton,
                    (!email || !isValidEmail(email)) && styles.submitButtonDisabled,
                    cooldown > 0 && styles.submitButtonCooldown,
                  ]}
                  onPress={handleSendReset}
                  disabled={loading || !isValidEmail(email) || cooldown > 0}
                >
                  {loading ? (
                    <ActivityIndicator color={theme.colors.primaryForeground} />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {cooldown > 0 ? `Request link in ${cooldown}s` : 'Send Reset Link'}
                    </Text>
                  )}
                </Pressable>
              </View>
            ) : (
              <View style={styles.successContent}>
                <CheckCircle size={64} color={theme.colors.primary} style={styles.successIcon} />
                
                <Text style={styles.successTitle}>Check Your Email</Text>
                
                <Text style={styles.successSubtitle}>
                  If an account exists with this email address, a password reset link has been sent to:
                </Text>
                <Text style={styles.successEmail}>{email.trim()}</Text>

                <View style={styles.instructionsContainer}>
                  <Text style={styles.successDetailText}>• The link may take a few minutes to arrive.</Text>
                  <Text style={styles.successDetailText}>• Please check your Spam or Junk folders if you do not see it.</Text>
                  <Text style={styles.successDetailText}>• Ensure you use the exact email address associated with your Nirvaha account.</Text>
                  <Text style={styles.successDetailText}>• The link expires automatically after a short period for security.</Text>
                </View>

                {/* Open Mail Client */}
                <Pressable style={styles.mailButton} onPress={handleOpenMailApp}>
                  <Text style={styles.mailButtonText}>Open Mail App</Text>
                </Pressable>

                {/* Resend Email Button */}
                <Pressable
                  style={[styles.resendButton, cooldown > 0 && styles.resendButtonDisabled]}
                  onPress={handleSendReset}
                  disabled={cooldown > 0}
                >
                  <Text style={styles.resendButtonText}>
                    {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend Email'}
                  </Text>
                </Pressable>

                {/* Return to login */}
                <Pressable style={styles.backButton} onPress={handleModalClose}>
                  <Text style={styles.backButtonText}>Back to Sign In</Text>
                </Pressable>
              </View>
            )}
          </View>
      </ScreenContainer>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(45, 90, 76, 0.1)',
    backgroundColor: '#F8F6F0',
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    color: theme.colors.foreground,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(45, 90, 76, 0.05)',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formContent: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 28,
    color: theme.colors.foreground,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.mutedForeground,
    lineHeight: 22,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 28,
  },
  label: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.foreground,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF1EB',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputErrorBorder: {
    borderColor: theme.colors.error,
  },
  inputSuccessBorder: {
    borderColor: theme.colors.primary,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: theme.typography.body,
    fontSize: 15,
    color: theme.colors.foreground,
  },
  errorText: {
    fontFamily: theme.typography.body,
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  successText: {
    fontFamily: theme.typography.body,
    color: theme.colors.primary,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonCooldown: {
    backgroundColor: theme.colors.border,
  },
  submitButtonText: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: theme.colors.primaryForeground,
  },
  successContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontFamily: theme.typography.display,
    fontSize: 26,
    color: theme.colors.foreground,
    marginBottom: 8,
  },
  successSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 20,
  },
  successEmail: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 15,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(45, 90, 76, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  successDetailText: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: theme.colors.mutedForeground,
    lineHeight: 18,
    marginBottom: 6,
  },
  mailButton: {
    backgroundColor: '#EEF1EB',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  mailButtonText: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: theme.colors.primary,
  },
  resendButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  backButtonText: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: theme.colors.primaryForeground,
  },
});
