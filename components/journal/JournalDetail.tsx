import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Pressable, SafeAreaView, Alert, Platform } from 'react-native';
import { ArrowLeft, Trash2, Pencil, X } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { JournalEntry } from './JournalEditor';

interface JournalDetailProps {
  visible: boolean;
  entry: JournalEntry | null;
  onClose: () => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export default function JournalDetail({
  visible,
  entry,
  onClose,
  onEdit,
  onDelete,
}: JournalDetailProps) {
  if (!entry) return null;

  const dateCreated = new Date(entry.timestamp);
  const formattedDateCreated =
    dateCreated.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
    ' at ' +
    dateCreated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const dateEdited = entry.lastEditedTimestamp ? new Date(entry.lastEditedTimestamp) : null;
  const formattedDateEdited = dateEdited
    ? dateEdited.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
      ' at ' +
      dateEdited.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null;

  const handleDelete = () => {
    Alert.alert(
      'Delete Reflection',
      'Are you sure you want to permanently delete this reflection? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(entry.id);
            onClose();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    onClose();
    setTimeout(() => {
      onEdit(entry);
    }, 100);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.iconButton}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Read reflection</Text>
          <Pressable onPress={onClose} style={[styles.iconButton, styles.closeButtonBg]}>
            <X size={16} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>

        {/* Scrollable Reading Content */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Mood Badge */}
          <View style={styles.moodBadge}>
            <Text style={styles.moodEmoji}>{entry.moodEmoji}</Text>
            <Text style={styles.moodLabel}>Feeling {entry.mood}</Text>
          </View>

          {/* Title */}
          <Text style={styles.titleText}>{entry.title}</Text>

          {/* Timestamps */}
          <View style={styles.timestampContainer}>
            <Text style={styles.timestampText}>Created: {formattedDateCreated}</Text>
            {formattedDateEdited && (
              <Text style={styles.timestampText}>Edited: {formattedDateEdited}</Text>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Reflection Body */}
          <Text style={styles.bodyText}>{entry.text}</Text>
        </ScrollView>

        {/* Action Buttons Footer */}
        <View style={styles.footer}>
          <Pressable style={styles.editButton} onPress={handleEdit}>
            <Pencil size={18} color={theme.colors.primaryForeground} />
            <Text style={styles.editButtonText}>Edit Reflection</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={18} color="#FF453A" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 20,
  },
  moodEmoji: {
    fontSize: 14,
  },
  moodLabel: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: '#FFFFFF',
  },
  titleText: {
    fontFamily: theme.typography.display,
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: 12,
  },
  timestampContainer: {
    gap: 4,
    marginBottom: 20,
  },
  timestampText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 24,
  },
  bodyText: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 26,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
    gap: 12,
    marginTop: 12,
  },
  editButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  editButtonText: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primaryForeground,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.2)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButtonText: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    fontWeight: '600',
    color: '#FF453A',
  },
});
