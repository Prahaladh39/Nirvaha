import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { User, Mail, Lock, Eye, EyeOff, Square, CheckSquare, Check, AlertCircle } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { theme } from '../../constants/theme';

import { TERMS_AND_CONDITIONS, PRIVACY_POLICY, DPDP_ACT_COMPLIANCE, GLOBAL_PRIVACY_PRINCIPLES } from '../../constants/consentData';
import ConsentModal from './ConsentModal';

export default function CreateAccountForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [viewTerms, setViewTerms] = useState(false);
  const [viewPrivacy, setViewPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password strength validation criteria
  const isMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = isMinLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;

  // Passwords match validation
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const showMismatchError = confirmPasswordTouched && confirmPassword.length > 0 && password !== confirmPassword;
  const showSuccessMatch = confirmPasswordTouched && passwordsMatch;

  // Form validity check
  const isFormValid = 
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    isPasswordValid &&
    passwordsMatch &&
    consentAccepted;

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Please fill in all fields.' });
      return;
    }

    if (!isPasswordValid) {
      Toast.show({ type: 'error', text1: 'Weak Password', text2: 'Password does not meet all strength criteria.' });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords mismatch', text2: 'Passwords do not match.' });
      return;
    }

    if (!consentAccepted) {
      Toast.show({
        type: 'error',
        text1: 'Consent Required',
        text2: 'You must accept the Terms & Conditions and Privacy Policy before continuing.',
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
      });



      Toast.show({ type: 'success', text1: 'Account Created', text2: 'Welcome to Nirvaha!' });
      
      // Clear password fields from memory immediately for security
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setPasswordTouched(false);
      setConfirmPasswordTouched(false);
    } catch (error: any) {
      let errorMessage = 'An error occurred during account creation. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please sign in.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak. Please use a stronger password.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else {
        errorMessage = error.message;
      }
      Toast.show({ type: 'error', text1: 'Sign Up Failed', text2: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Full Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputContainer}>
          <User size={18} color={theme.colors.mutedForeground} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            placeholderTextColor={theme.colors.mutedForeground}
          />
        </View>
      </View>

      {/* Email Address */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <Mail size={18} color={theme.colors.mutedForeground} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={theme.colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={[
          styles.inputContainer,
          passwordTouched && !isPasswordValid && styles.inputErrorBorder
        ]}>
          <Lock size={18} color={theme.colors.mutedForeground} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordTouched(true);
            }}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.mutedForeground}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            {showPassword ? (
              <EyeOff size={18} color={theme.colors.mutedForeground} />
            ) : (
              <Eye size={18} color={theme.colors.mutedForeground} />
            )}
          </Pressable>
        </View>

        {/* Password Strength Checklist */}
        {passwordTouched && (
          <View style={styles.checklistContainer}>
            <Text style={styles.checklistTitle}>Password requirements:</Text>
            <View style={styles.checklistItem}>
              <View style={[styles.checklistIcon, isMinLength ? styles.checkSuccess : styles.checkMuted]}>
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text style={[styles.checklistText, isMinLength ? styles.textSuccess : styles.textMuted]}>
                Minimum 8 characters
              </Text>
            </View>
            <View style={styles.checklistItem}>
              <View style={[styles.checklistIcon, hasUppercase ? styles.checkSuccess : styles.checkMuted]}>
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text style={[styles.checklistText, hasUppercase ? styles.textSuccess : styles.textMuted]}>
                At least one uppercase letter (A-Z)
              </Text>
            </View>
            <View style={styles.checklistItem}>
              <View style={[styles.checklistIcon, hasLowercase ? styles.checkSuccess : styles.checkMuted]}>
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text style={[styles.checklistText, hasLowercase ? styles.textSuccess : styles.textMuted]}>
                At least one lowercase letter (a-z)
              </Text>
            </View>
            <View style={styles.checklistItem}>
              <View style={[styles.checklistIcon, hasDigit ? styles.checkSuccess : styles.checkMuted]}>
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text style={[styles.checklistText, hasDigit ? styles.textSuccess : styles.textMuted]}>
                At least one number (0-9)
              </Text>
            </View>
            <View style={styles.checklistItem}>
              <View style={[styles.checklistIcon, hasSpecialChar ? styles.checkSuccess : styles.checkMuted]}>
                <Check size={10} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text style={[styles.checklistText, hasSpecialChar ? styles.textSuccess : styles.textMuted]}>
                At least one special character (e.g. @, #, $, !)
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Confirm Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={[
          styles.inputContainer,
          showSuccessMatch && styles.inputSuccessBorder,
          showMismatchError && styles.inputErrorBorder
        ]}>
          <Lock size={18} color={theme.colors.mutedForeground} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordTouched(true);
            }}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.mutedForeground}
            secureTextEntry={!showConfirmPassword}
          />
          <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            {showConfirmPassword ? (
              <EyeOff size={18} color={theme.colors.mutedForeground} />
            ) : (
              <Eye size={18} color={theme.colors.mutedForeground} />
            )}
          </Pressable>
        </View>
        {showMismatchError && (
          <View style={styles.feedbackRow}>
            <AlertCircle size={14} color="#D32F2F" />
            <Text style={styles.feedbackErrorText}>Passwords do not match.</Text>
          </View>
        )}
        {showSuccessMatch && (
          <View style={styles.feedbackRow}>
            <Check size={14} color="#2E7D32" strokeWidth={3} />
            <Text style={styles.feedbackSuccessText}>Passwords match.</Text>
          </View>
        )}
      </View>

      {/* Consent Checkbox */}
      <View style={styles.consentRow}>
        <Pressable style={styles.consentCheckbox} onPress={() => setConsentAccepted(!consentAccepted)}>
          {consentAccepted ? (
            <CheckSquare size={18} color={theme.colors.primary} />
          ) : (
            <Square size={18} color={theme.colors.mutedForeground} />
          )}
        </Pressable>
        <Text style={styles.consentText}>
          I have read and agree to the{' '}
          <Text style={styles.linkText} onPress={() => setViewTerms(true)}>Terms & Conditions</Text>
          {' '}and{' '}
          <Text style={styles.linkText} onPress={() => setViewPrivacy(true)}>Privacy Policy</Text>.
        </Text>
      </View>

      {/* Submit Button */}
      <Pressable 
        style={[
          styles.submitButton,
          !isFormValid && styles.submitButtonDisabled
        ]} 
        onPress={handleSignUp} 
        disabled={loading || !isFormValid}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.primaryForeground} />
        ) : (
          <Text style={styles.submitButtonText}>Create Account</Text>
        )}
      </Pressable>

      <ConsentModal
        visible={viewTerms}
        onClose={() => setViewTerms(false)}
        title="Terms & Conditions"
        sections={[...TERMS_AND_CONDITIONS, DPDP_ACT_COMPLIANCE]}
      />

      <ConsentModal
        visible={viewPrivacy}
        onClose={() => setViewPrivacy(false)}
        title="Privacy Policy"
        sections={[...PRIVACY_POLICY, DPDP_ACT_COMPLIANCE, GLOBAL_PRIVACY_PRINCIPLES]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
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
    backgroundColor: '#F8F9F6',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputErrorBorder: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFEBEE',
  },
  inputSuccessBorder: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  icon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: theme.typography.body,
    fontSize: 15,
    color: theme.colors.foreground,
  },
  checklistContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  checklistTitle: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginBottom: 4,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checklistIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  checkSuccess: {
    backgroundColor: '#2E7D32',
  },
  checkMuted: {
    backgroundColor: '#BDBDBD',
  },
  checklistText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
  },
  textSuccess: {
    color: '#2E7D32',
  },
  textMuted: {
    color: theme.colors.mutedForeground,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 8,
    gap: 4,
  },
  feedbackErrorText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: '#D32F2F',
  },
  feedbackSuccessText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: '#2E7D32',
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  consentCheckbox: {
    marginRight: 10,
    marginTop: 2,
  },
  consentText: {
    flex: 1,
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: theme.colors.mutedForeground,
    lineHeight: 18,
  },
  linkText: {
    fontFamily: theme.typography.bodyMedium,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(45, 90, 76, 0.4)',
    opacity: 0.8,
  },
  submitButtonText: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: theme.colors.primaryForeground,
  },
});
