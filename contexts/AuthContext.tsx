import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  profileName: string | null;
  isLoading: boolean;
  updateProfileState: (newName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profileName: null,
  isLoading: true,
  updateProfileState: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // 1. Immediately load from cache to avoid layout shift/delay
        const cachedName = await AsyncStorage.getItem(`cached_profile_name_${firebaseUser.uid}`);
        if (cachedName) {
          setProfileName(cachedName);
        } else if (firebaseUser.displayName) {
          setProfileName(firebaseUser.displayName);
        } else {
          setProfileName("Seeker");
        }

        // 2. Fetch fresh profile from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.name) {
              setProfileName(data.name);
              await AsyncStorage.setItem(`cached_profile_name_${firebaseUser.uid}`, data.name);
            }
          }
        } catch (error) {
          console.error('Failed to fetch Firestore user profile:', error);
        }
      } else {
        setProfileName(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateProfileState = async (newName: string) => {
    if (!user) throw new Error('No user is currently logged in.');

    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 50) {
      throw new Error('Name must be between 2 and 50 characters.');
    }

    // 1. Update Firebase Auth displayName
    await updateProfile(user, { displayName: trimmedName });

    // 2. Update Firestore user document
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { name: trimmedName }, { merge: true });

    // 3. Update Local cache and state
    await AsyncStorage.setItem(`cached_profile_name_${user.uid}`, trimmedName);
    setProfileName(trimmedName);
  };

  return (
    <AuthContext.Provider value={{ user, profileName, isLoading, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

