import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, Send, Sparkles } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ScreenContainer from "../components/ui/ScreenContainer";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { CompanionManager } from "../services/companion/CompanionManager";
import { ConversationMessage } from "../services/companion/types";
import { theme } from "../constants/theme";

const NIRVAHA_MENTOR_ID = 'nirvaha';

const INTRO_MESSAGE: ConversationMessage = {
  id: 'intro',
  role: 'assistant',
  content: "Hey, I'm here. Tell me what's been sitting on your mind.",
  timestamp: Date.now(),
};

export default function ChatScreen() {
  const listRef = useRef<FlatList<ConversationMessage>>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([INTRO_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [lengthPreference, setLengthPreference] = useState<"short" | "long">("short");

  const canSend = inputText.trim().length > 0 && !loading;

  const toggleLengthPreference = () => {
    setLengthPreference((prev) => (prev === "short" ? "long" : "short"));
  };

  const chatMessages = useMemo(() => messages, [messages]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || loading) return;

    // Optimistic UI update
    const userMessage: ConversationMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((current) => [...current, userMessage]);
    setInputText("");
    setLoading(true);
    scrollToEnd();

    try {
      const response = await CompanionManager.sendMessage(
        NIRVAHA_MENTOR_ID,
        trimmed,
        { lengthPreference },
      );

      const modelMessage: ConversationMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: response.message,
        timestamp: Date.now(),
      };

      setMessages((current) => [...current, modelMessage]);
    } catch (error) {
      console.error("Chat send error:", error);
      setMessages((current) => [
        ...current,
        {
          id: `error_${Date.now()}`,
          role: "assistant",
          content: "There was a little static there. Send it again, slowly.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
      scrollToEnd();
    }
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: ConversationMessage;
    index: number;
  }) => {
    const isUser = item.role === "user";

    return (
      <Animated.View
        entering={FadeInDown.duration(260).delay(Math.min(index * 20, 120))}
        style={[styles.messageRow, isUser ? styles.userRow : styles.modelRow]}
      >
        {!isUser && (
          <View style={styles.avatar}>
            <Sparkles size={14} color={theme.colors.gold} />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.modelBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.modelText,
            ]}
          >
            {item.content}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScreenContainer
      fullBleed
      avoidKeyboard
      keyboardOffset={Platform.OS === "ios" ? 8 : 20}
      statusBarStyle="light"
      background={
        <>
          <LinearGradient
            colors={["#111A17", "#0A0A0A"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.ambientOrb, styles.ambientOne]} />
          <View style={[styles.ambientOrb, styles.ambientTwo]} />
        </>
      }
    >

        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Nirvaha Chat</Text>
            <Text style={styles.subtitle}>
              A quiet space to say it honestly
            </Text>
          </View>
          <Pressable
            style={styles.toggleButton}
            onPress={toggleLengthPreference}
          >
            <Text style={styles.toggleButtonText}>
              {lengthPreference === "short" ? "Short" : "Long"}
            </Text>
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={chatMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={scrollToEnd}
        />

        {loading && (
          <Animated.View
            entering={FadeInUp.duration(220)}
            style={styles.typingRow}
          >
            <ActivityIndicator size="small" color={theme.colors.gold} />
            <Text style={styles.typingText}>Nirvaha is thinking...</Text>
          </Animated.View>
        )}

        <View style={styles.inputShell}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Say what's on your mind..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            multiline
            maxLength={1200}
          />
          <Pressable
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!canSend}
          >
            {loading ? (
              <ActivityIndicator
                color={theme.colors.primaryForeground}
                size="small"
              />
            ) : (
              <Send size={18} color={theme.colors.primaryForeground} />
            )}
          </Pressable>
        </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  keyboardView: {
    flex: 1,
  },
  ambientOrb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.14,
  },
  ambientOne: {
    width: 220,
    height: 220,
    top: 90,
    right: -80,
    backgroundColor: theme.colors.healingGreen,
  },
  ambientTwo: {
    width: 170,
    height: 170,
    bottom: 140,
    left: -70,
    backgroundColor: theme.colors.gold,
    opacity: 0.09,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: "rgba(255,255,255,0.48)",
    marginTop: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(212,175,55,0.15)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.3)",
  },
  toggleButtonText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.gold,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  modelRow: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(212,175,55,0.1)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 6,
  },
  modelBubble: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  userText: {
    color: theme.colors.primaryForeground,
  },
  modelText: {
    color: "rgba(255,255,255,0.86)",
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  typingText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: "rgba(255,255,255,0.52)",
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? 10 : 16,
    padding: 10,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 42,
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 10,
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: "#FFFFFF",
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
});
