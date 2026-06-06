import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, Pressable, FlatList, 
  KeyboardAvoidingView, Platform, SafeAreaView, Alert 
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Send } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../../constants/theme';
import { companionsData } from '../../../constants/companionsData';
import { chatBotData, defaultBotAnswer } from '../../../constants/chatBotData';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const CHAT_LIMIT_KEY = 'LAST_COMPANION_CHAT_DATE';
const SESSION_DURATION_SEC = 300; // 5 minutes

export default function CompanionChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const companion = companionsData.find(c => c.id === id) || companionsData[0];
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: `Hi, I'm ${companion.name}. We have 5 minutes together. What's on your mind?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_SEC);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    checkDailyLimit();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSessionActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isSessionActive && timeLeft === 0) {
      endSession();
    }
    return () => clearInterval(timer);
  }, [timeLeft, isSessionActive]);

  const checkDailyLimit = async () => {
    try {
      const lastDate = await AsyncStorage.getItem(CHAT_LIMIT_KEY);
      const today = new Date().toISOString().split('T')[0];
      if (lastDate === today) {
        Alert.alert(
          "Daily Limit Reached", 
          "Your free session is over for today. You cannot talk to any other companion. Please come back tomorrow.",
          [{ text: "OK", onPress: () => router.back() }]
        );
        setIsSessionActive(false);
      }
    } catch (e) {
      console.error(e);
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
      "Your 5-minute free session is over. For the rest of the day, you cannot talk to any other companion.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const generateBotResponse = (userText: string) => {
    const lowerText = userText.toLowerCase();
    
    for (const qa of chatBotData) {
      if (qa.keywords.some(keyword => lowerText.includes(keyword))) {
        return qa.answer;
      }
    }
    return defaultBotAnswer;
  };

  const sendMessage = () => {
    if (!inputText.trim() || !isSessionActive) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate typing delay
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(userMsg.text),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.botBubble]}>
      <Text style={[styles.messageText, item.isUser ? styles.userText : styles.botText]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color={theme.colors.foreground} size={24} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.companionName}>{companion.name}</Text>
          <Text style={[styles.timer, timeLeft <= 60 && styles.timerUrgent]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
        <View style={{ width: 40 }} />
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
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor={theme.colors.mutedForeground}
            value={inputText}
            onChangeText={setInputText}
            editable={isSessionActive}
            multiline
          />
          <Pressable 
            style={[styles.sendBtn, (!inputText.trim() || !isSessionActive) && styles.sendBtnDisabled]} 
            onPress={sendMessage}
          >
            <Send size={20} color="#FFFFFF" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
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
  timer: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.healingGreen,
    marginTop: 2,
  },
  timerUrgent: {
    color: '#E53935',
  },
  keyboardView: {
    flex: 1,
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
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
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    alignItems: 'flex-end',
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
    marginRight: 12,
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
});
