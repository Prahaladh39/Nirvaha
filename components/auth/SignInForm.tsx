import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Mail, Lock, Eye, EyeOff, Square, CheckSquare } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { theme } from '../../constants/theme';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Please fill in all fields.' });
      return;
    }
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      Toast.show({ type: 'success', text1: 'Signed In', text2: 'Welcome back to your inner balance.' });
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      setTimeout(() => {
        if (userDoc.exists() && userDoc.data().onboardingCompleted) {
          router.replace('/(tabs)');
        } else {
          router.replace('/pages/OnboardingIntro');
        }
      }, 500);
    } catch (error: any) {
      console.error("Sign In Error:", error);
      Toast.show({ 
        type: 'error', 
        text1: 'Sign In Error', 
        text2: error?.message || 'An unknown error occurred.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Lock size={18} color={theme.colors.mutedForeground} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
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
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
          {rememberMe ? (
            <CheckSquare size={18} color={theme.colors.mutedForeground} />
          ) : (
            <Square size={18} color={theme.colors.mutedForeground} />
          )}
          <Text style={styles.checkboxLabel}>Remember me</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </Pressable>
      </View>

      <Pressable style={styles.submitButton} onPress={handleSignIn} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primaryForeground} />
        ) : (
          <Text style={styles.submitButtonText}>Sign In</Text>
        )}
      </Pressable>
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
    backgroundColor: '#F8F9F6', // Lighter inside the input
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.15)', // Subtle green border
    borderRadius: 16,
    paddingHorizontal: 16,
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.mutedForeground,
    marginLeft: 8,
  },
  forgotPasswordText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.primary,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: theme.colors.primaryForeground,
  },
});
