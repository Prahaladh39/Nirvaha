import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TextInput, Pressable, FlatList, 
  KeyboardAvoidingView, Platform, SafeAreaView, Alert, ActivityIndicator,
  ScrollView
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Send, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { theme } from '../../../constants/theme';
import { companionsData } from '../../../constants/companionsData';
import { CompanionManager } from '../../../services/companion/CompanionManager';
import { ConversationMessage, ConversationSession } from '../../../services/companion/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_LIMIT_KEY = 'LAST_COMPANION_CHAT_DATE';
const SESSION_DURATION_SEC = 300; // 5 minutes

export default function CompanionChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const companion = companionsData.find(c => c.id === id) || companionsData[0];
  
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_SEC);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [lengthPreference, setLengthPreference] = useState<'short' | 'normal'>('normal');
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const handleSuggestionTap = (text: string) => {
    setInputText(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 80);
  };

  const canSend = inputText.trim().length > 0 && !loading && isSessionActive;

  // ── Initialize conversation ───────────────────────────────────

  useEffect(() => {
    initializeChat();
    loadPreference();
  }, [id]);

  const loadPreference = async () => {
    try {
      const stored = await AsyncStorage.getItem('nirvaha_length_preference');
      if (stored === 'short' || stored === 'normal') {
        setLengthPreference(stored);
      }
    } catch (e) {
      console.error('Failed to load length preference', e);
    }
  };

  const toggleLengthPreference = async (pref: 'short' | 'normal') => {
    setLengthPreference(pref);
    try {
      await AsyncStorage.setItem('nirvaha_length_preference', pref);
    } catch (e) {
      console.error('Failed to save length preference', e);
    }
  };

  const initializeChat = async () => {
    try {
      // Check daily limit
      const canChat = await checkDailyLimit();
      if (!canChat) return;

      // Start or resume conversation with this mentor
      const session = await CompanionManager.getOrCreateSession(companion.id);
      setConversationId(session.id);
      setMessages(session.messages);
    } catch (error) {
      console.error('[CompanionChat] Init error:', error);
      // Fallback greeting
      const greeting = CompanionManager.getGreeting(companion.id);
      const fallbackMsg: ConversationMessage = {
        id: 'greeting',
        role: 'assistant',
        content: greeting,
        timestamp: Date.now(),
      };
      setMessages([fallbackMsg]);
    } finally {
      setIsInitializing(false);
    }
  };

  // ── Session timer ─────────────────────────────────────────────

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isSessionActive && timeLeft > 0 && !isInitializing) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isSessionActive && timeLeft === 0) {
      endSession();
    }
    return () => clearInterval(timer);
  }, [timeLeft, isSessionActive, isInitializing]);

  const checkDailyLimit = async (): Promise<boolean> => {
    try {
      const lastDate = await AsyncStorage.getItem(CHAT_LIMIT_KEY);
      const today = new Date().toISOString().split('T')[0];
      if (lastDate === today) {
        Alert.alert(
          "Daily Limit Reached", 
          "Your free session is over for today. Please come back tomorrow.",
          [{ text: "OK", onPress: () => router.back() }]
        );
        setIsSessionActive(false);
        setIsInitializing(false);
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return true;
    }
  };

  const endSession = async () => {
    setIsSessionActive(false);
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(CHAT_LIMIT_KEY, today);
    } catch (e) {
      console.error(e);
    }
    Alert.alert(
      "Session Ended", 
      "Your 5-minute free session is over. Come back tomorrow for another conversation.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  // ── Message handling ──────────────────────────────────────────

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const sendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || loading || !isSessionActive) return;

    // Optimistic UI update — show user message immediately
    const optimisticUserMsg: ConversationMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, optimisticUserMsg]);
    setInputText('');
    setLoading(true);
    scrollToEnd();

    try {
      const response = await CompanionManager.sendMessage(companion.id, trimmed, {
        lengthPreference,
        conversationId: conversationId || undefined,
      });

      // Update conversation ID if new
      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      // Add the AI response to the UI
      const assistantMsg: ConversationMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: Date.now(),
        emotionalState: response.emotionalState.primary,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('[CompanionChat] Send error:', error);
      const errorMsg: ConversationMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "Something flickered for a moment there. Could you say that again?",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      scrollToEnd();
    }
  };

  // ── Timer formatting ──────────────────────────────────────────

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ── Render ────────────────────────────────────────────────────

  const renderMessage = ({ item, index }: { item: ConversationMessage; index: number }) => {
    const isUser = item.role === 'user';

    return (
      <Animated.View
        entering={FadeInDown.duration(260).delay(Math.min(index * 20, 120))}
        style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}
      >
        {!isUser && (
          <View style={styles.mentorAvatar}>
            <Text style={styles.mentorAvatarText}>{companion.initials}</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
            {item.content}
          </Text>
        </View>
      </Animated.View>
    );
  };

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.healingGreen} />
          <Text style={styles.loadingText}>Connecting with {companion.name.split(' ')[0]}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color={theme.colors.foreground} size={24} />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.companionName}>{companion.name}</Text>
            <Text style={styles.companionTitle}>{companion.title}</Text>
          </View>
          <View style={styles.timerContainer}>
            <Text style={[styles.timer, timeLeft <= 60 && styles.timerUrgent]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        {/* Segmented Control for Response Length */}
        <View style={styles.preferenceContainer}>
          <Text style={styles.preferenceLabel}>Response length preference:</Text>
          <View style={styles.segmentedControl}>
            <Pressable 
              style={[
                styles.segmentButton, 
                lengthPreference === 'normal' && styles.segmentButtonActive
              ]}
              onPress={() => toggleLengthPreference('normal')}
            >
              <Text style={[
                styles.segmentText, 
                lengthPreference === 'normal' && styles.segmentTextActive
              ]}>Normal</Text>
            </Pressable>
            <Pressable 
              style={[
                styles.segmentButton, 
                lengthPreference === 'short' && styles.segmentButtonActive
              ]}
              onPress={() => toggleLengthPreference('short')}
            >
              <Text style={[
                styles.segmentText, 
                lengthPreference === 'short' && styles.segmentTextActive
              ]}>Short</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={scrollToEnd}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Typing indicator */}
        {loading && (
          <Animated.View entering={FadeInUp.duration(220)} style={styles.typingRow}>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
            <Text style={styles.typingText}>
              {companion.name.split(' ')[0]} is thinking...
            </Text>
          </Animated.View>
        )}

        {/* Suggestion starters */}
        {isSessionActive && companion.suggestions && companion.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsContent}
              keyboardShouldPersistTaps="handled"
            >
              {companion.suggestions.map((suggestion, index) => (
                <Pressable
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestionTap(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input area */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={isSessionActive ? "Say what's on your mind..." : "Session ended"}
            placeholderTextColor={theme.colors.mutedForeground}
            value={inputText}
            onChangeText={setInputText}
            editable={isSessionActive && !loading}
            multiline
            maxLength={1200}
          />
          <Pressable 
            style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]} 
            onPress={sendMessage}
            disabled={!canSend}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send size={18} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    color: theme.colors.mutedForeground,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  preferenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  preferenceLabel: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F3F5',
    borderRadius: 16,
    padding: 3,
    width: 140,
    height: 32,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 1.5,
    elevation: 2,
  },
  segmentText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  segmentTextActive: {
    color: theme.colors.healingGreen,
    fontWeight: '600',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  companionName: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: theme.colors.foreground,
    fontWeight: '600',
  },
  companionTitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginTop: 1,
  },
  timerContainer: {
    width: 50,
    alignItems: 'flex-end',
  },
  timer: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.healingGreen,
  },
  timerUrgent: {
    color: '#E53935',
  },
  keyboardView: {
    flex: 1,
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  mentorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.healingGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  mentorAvatarText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.healingGreen,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  messageText: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: theme.colors.foreground,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingLeft: 56, // Align with message content (avatar width + gap)
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.healingGreenLight,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.6 },
  dot3: { opacity: 0.8 },
  typingText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#F1F3F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: theme.typography.body,
    fontSize: 15,
    color: theme.colors.foreground,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.healingGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#C0CEC6',
  },
  suggestionsContainer: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },
  suggestionsContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F3F5',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  suggestionText: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: theme.colors.foreground,
  },
});
