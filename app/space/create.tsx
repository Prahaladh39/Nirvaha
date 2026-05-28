import { router } from 'expo-router';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { auth, db } from '../../config/firebase';
import { theme } from '../../constants/theme';

const emotions = [
  { label: 'Emotional Health', icon: '💚' },
  { label: 'Anxiety', icon: '⚡' },
  { label: 'Self-Discovery', icon: '🔮' },
  { label: 'Relationships', icon: '🤝' },
  { label: 'Mindfulness', icon: '🧘' },
  { label: 'Healing', icon: '🌿' },
  { label: 'Sleep', icon: '🌙' },
  { label: 'Gratitude', icon: '✨' },
];

export default function CreateSpacePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = auth.currentUser;

  const handlePost = async () => {
    if (!title.trim() || !content.trim() || !selectedEmotion) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Please fill in all details to post.' });
      return;
    }

    if (!currentUser) {
      Toast.show({ type: 'error', text1: 'Not logged in', text2: 'You must be logged in to share.' });
      return;
    }

    setIsSubmitting(true);

    try {
      let authorName = 'Anonymous Soul';
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data()?.name) {
          authorName = userDoc.data().name;
        } else if (currentUser.displayName) {
          authorName = currentUser.displayName;
        } else if (currentUser.email) {
          authorName = currentUser.email.split('@')[0];
        }
      } catch (e) {
        console.warn("Could not fetch user doc for name:", e);
        if (currentUser.displayName) authorName = currentUser.displayName;
        else if (currentUser.email) authorName = currentUser.email.split('@')[0];
      }

      await addDoc(collection(db, 'spacePosts'), {
        authorId: currentUser.uid,
        authorName: authorName,
        title: title.trim(),
        content: content.trim(),
        emotionType: selectedEmotion,
        likesCount: 0,
        likedBy: [],
        createdAt: serverTimestamp()
      });

      Toast.show({ type: 'success', text1: 'Shared with the universe' });
      router.back();
    } catch (error) {
      console.error("Error creating post:", error);
      Toast.show({ type: 'error', text1: 'Failed to share', text2: 'Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Share your wisdom</Text>
          <Pressable
            style={[styles.postButton, (!title || !content || !selectedEmotion || isSubmitting) && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={!title || !content || !selectedEmotion || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#0A0A0A" />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <Animated.View entering={FadeInDown.duration(400)}>
            <TextInput
              style={styles.titleInput}
              placeholder="Give it a title..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <Text style={styles.promptText}>What wisdom your heart is seeking today?</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Share your thoughts..."
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.emotionSection}>
            <Text style={styles.sectionLabel}>How are you feeling?</Text>
            <View style={styles.chipsContainer}>
              {emotions.map((emotion) => {
                const isSelected = selectedEmotion === emotion.label;
                return (
                  <Pressable
                    key={emotion.label}
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelected
                    ]}
                    onPress={() => setSelectedEmotion(emotion.label)}
                  >
                    <Text style={styles.chipIcon}>{emotion.icon}</Text>
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {emotion.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  postButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#0A0A0A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 60,
  },
  titleInput: {
    fontFamily: theme.typography.display,
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 12,
  },
  promptText: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: theme.colors.gold,
    textAlign: 'center',
    marginBottom: 16,
  },
  contentInput: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    minHeight: 150,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emotionSection: {
    marginTop: 40,
  },
  sectionLabel: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  chipSelected: {
    backgroundColor: 'rgba(50, 140, 140, 0.2)',
    borderColor: theme.colors.healingGreen,
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  chipTextSelected: {
    color: theme.colors.healingGreenLight,
    fontWeight: '600',
  },
});