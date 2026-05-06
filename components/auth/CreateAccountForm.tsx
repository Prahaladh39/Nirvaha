import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { theme } from '../../constants/theme';

export default function CreateAccountForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Please fill in all fields.' });
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
      // Clear form or redirect
      setEmail('');
      setPassword('');
      setName('');
      
      setTimeout(() => {
        router.replace('/pages/OnboardingIntro');
      }, 500);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Toast.show({ 
          type: 'error', 
          text1: 'Account exists', 
          text2: 'An account with this email already exists. Please sign in.' 
        });
      } else if (error.code === 'auth/network-request-failed') {
        Toast.show({ type: 'error', text1: 'Network error', text2: 'Please check your internet connection.' });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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

      <Pressable style={styles.submitButton} onPress={handleSignUp} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primaryForeground} />
        ) : (
          <Text style={styles.submitButtonText}>Create Account</Text>
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
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: theme.colors.primaryForeground,
  },
});
