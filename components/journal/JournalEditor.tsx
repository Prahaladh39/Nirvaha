import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Modal, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import Toast from 'react-native-toast-message';


const moodOptions = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "🙏", label: "Grateful" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "🎯", label: "Focused" },
  { emoji: "😴", label: "Tired" },
];

export interface JournalEntry {
  id: string;
  title: string;
  text: string;
  mood: string;
  moodEmoji: string;
  timestamp: string;
  lastEditedTimestamp: string;
  saved?: boolean;
}

interface JournalEditorProps {
  visible: boolean;
  onSave: (entry: JournalEntry) => Promise<void>;
  onClose: () => void;
  editEntry?: JournalEntry | null;
}


export default function JournalEditor({ visible, onSave, onClose, editEntry }: JournalEditorProps) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const maxLength = 1000;

  useEffect(() => {
    if (visible) {
      setTitle(editEntry?.title || '');
      setText(editEntry?.text || '');
      setSelectedMood(editEntry?.mood || null);
      setSaving(false);
    }
  }, [visible, editEntry]);

  const selectedMoodData = moodOptions.find((m) => m.label === selectedMood);
  const isEditing = !!editEntry;

  const handleSave = async (customEntry?: JournalEntry) => {
    const trimmed = customEntry ? customEntry.text.trim() : text.trim();
    const mood = customEntry ? customEntry.mood : selectedMood;
    const moodEmoji = customEntry ? customEntry.moodEmoji : (selectedMoodData?.emoji || "📝");
    const entryTitle = customEntry ? customEntry.title : title.trim();

    if (!trimmed || !mood) return;
    if (trimmed.length > maxLength) return;

    setSaving(true);
    try {
      const entry: JournalEntry = {
        id: editEntry?.id || Math.random().toString(36).substring(2, 15),
        title: entryTitle,
        text: trimmed,
        mood: mood,
        moodEmoji: moodEmoji,
        timestamp: editEntry?.timestamp || new Date().toISOString(),
        lastEditedTimestamp: new Date().toISOString(),
        saved: editEntry?.saved || false,
      };
      
      await onSave(entry);
    } catch (error) {
      console.error("Save error", error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not save reflection.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRequestClose = () => {
    const isTitleChanged = title.trim() !== (editEntry?.title || '').trim();
    const isBodyChanged = text.trim() !== (editEntry?.text || '').trim();
    const isMoodChanged = selectedMood !== (editEntry?.mood || null);
    
    const hasUnsavedChanges = isTitleChanged || isBodyChanged || isMoodChanged;
    const isContentEmpty = !title.trim() && !text.trim() && !selectedMood;

    if (hasUnsavedChanges && !isContentEmpty) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes in your reflection. What would you like to do?",
        [
          { text: "Keep Editing", style: "cancel" },
          { 
            text: "Discard", 
            style: "destructive", 
            onPress: onClose 
          },
          { 
            text: "Save Draft", 
            onPress: async () => {
              if (!text.trim() || !selectedMood) {
                Toast.show({
                  type: 'error',
                  text1: 'Cannot Save Draft',
                  text2: 'Please write a reflection and select a feeling first.',
                });
                return;
              }
              const draftEntry: JournalEntry = {
                id: editEntry?.id || Math.random().toString(36).substring(2, 15),
                title: title.trim(),
                text: text.trim(),
                mood: selectedMood,
                moodEmoji: selectedMoodData?.emoji || "📝",
                timestamp: editEntry?.timestamp || new Date().toISOString(),
                lastEditedTimestamp: new Date().toISOString(),
                saved: editEntry?.saved || false,
              };
              await handleSave(draftEntry);
            } 
          }
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet" // Works nicely on iOS, normal slide on Android
      onRequestClose={handleRequestClose}
    >
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={handleRequestClose} style={styles.iconButton}>
              <ArrowLeft size={20} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.headerTitle}>
              {isEditing ? "Edit reflection" : "New reflection"}
            </Text>
            <Pressable onPress={handleRequestClose} style={[styles.iconButton, styles.closeButtonBg]}>
              <X size={16} color="rgba(255,255,255,0.7)" />
            </Pressable>
          </View>


          {/* Mood Picker */}
          <View style={styles.moodSection}>
            <Text style={styles.moodLabel}>How are you feeling?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodScroll}>
              {moodOptions.map((mood) => {
                const isSelected = selectedMood === mood.label;
                return (
                  <Pressable
                    key={mood.label}
                    onPress={() => setSelectedMood(mood.label)}
                    style={[
                      styles.moodPill,
                      isSelected && styles.moodPillSelected
                    ]}
                  >
                    <Text style={styles.moodPillEmoji}>{mood.emoji}</Text>
                    <Text style={[styles.moodPillText, isSelected && styles.moodPillTextSelected]}>
                      {mood.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Text Area */}
          <View style={styles.editorSection}>
            <View style={styles.editorCard}>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Title (optional)"
                placeholderTextColor="rgba(255,255,255,0.4)"
                maxLength={80}
              />
              <View style={styles.titleSeparator} />

              <TextInput
                style={styles.textInput}
                value={text}
                onChangeText={(val) => {
                  if (val.length <= maxLength) setText(val);
                }}
                placeholder="What's on your mind? Write freely — this is your safe space..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                autoFocus={!editEntry?.title}
                textAlignVertical="top"
              />

              <View style={styles.editorFooter}>
                <Text style={styles.charCount}>
                  {text.length}/{maxLength}
                </Text>
                {selectedMoodData && (
                  <Text style={styles.feelingLabel}>
                    Feeling {selectedMoodData.emoji} {selectedMoodData.label}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.saveSection}>
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                (!text.trim() || !selectedMood) && styles.saveButtonDisabled,
                pressed && styles.saveButtonPressed
              ]}
              onPress={() => handleSave()}
              disabled={!text.trim() || !selectedMood || saving}
            >
              {saving ? (
                <ActivityIndicator color={theme.colors.primaryForeground} />
              ) : (
                <Text style={styles.saveButtonText}>
                  {isEditing ? "Update reflection" : "Save reflection"}
                </Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  closeButtonBg: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  moodSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  moodLabel: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 10,
  },
  moodScroll: {
    gap: 8,
    paddingRight: 20, // Extra padding for scrolling
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  moodPillSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  moodPillEmoji: {
    fontSize: 14,
  },
  moodPillText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: '#FFFFFF',
  },
  moodPillTextSelected: {
    color: theme.colors.primaryForeground,
    fontWeight: '600',
  },
  editorSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  editorCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 16,
  },
  textInput: {
    flex: 1,
    fontFamily: theme.typography.body,
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  editorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  charCount: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  feelingLabel: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  saveSection: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primaryForeground,
  },
  titleInput: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingBottom: 8,
    marginBottom: 2,
  },
  titleSeparator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
  },
});
