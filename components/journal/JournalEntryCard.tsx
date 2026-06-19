import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Trash2, Pencil, Bookmark, BookmarkCheck } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { theme } from '../../constants/theme';
import { JournalEntry } from './JournalEditor';

interface JournalEntryCardProps {
  entry: JournalEntry;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (entry: JournalEntry) => void;
  onToggleSave: (id: string) => void;
  onPressCard?: (entry: JournalEntry) => void;
}

export default function JournalEntryCard({ entry, index, onDelete, onEdit, onToggleSave, onPressCard }: JournalEntryCardProps) {
  const date = new Date(entry.timestamp);
  
  // Format Date simple: MMM d, h:mm a
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
                        date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const renderRightActions = () => {
    return (
      <View style={styles.actionsContainer}>
        <Pressable 
          style={[styles.actionBtn, { backgroundColor: 'rgba(235, 185, 80, 0.15)' }]}
          onPress={() => onToggleSave(entry.id)}
        >
          {entry.saved ? (
            <BookmarkCheck size={18} color={theme.colors.gold} />
          ) : (
            <Bookmark size={18} color="rgba(255,255,255,0.6)" />
          )}
        </Pressable>
        <Pressable 
          style={[styles.actionBtn, { backgroundColor: 'rgba(42, 82, 77, 0.15)' }]}
          onPress={() => onEdit(entry)}
        >
          <Pencil size={18} color={theme.colors.primary} />
        </Pressable>
        <Pressable 
          style={[styles.actionBtn, { backgroundColor: 'rgba(255, 69, 58, 0.15)' }]}
          onPress={() => onDelete(entry.id)}
        >
          <Trash2 size={18} color="#FF453A" />
        </Pressable>
      </View>
    );
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(100 + index * 60)} style={styles.wrapper}>
      <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
        <Pressable onPress={() => onPressCard?.(entry)}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.moodRow}>
                <Text style={styles.emoji}>{entry.moodEmoji}</Text>
                <Text style={styles.moodText}>{entry.mood}</Text>
                {entry.saved && (
                  <BookmarkCheck size={14} color={theme.colors.gold} />
                )}
              </View>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
            
            {entry.title ? (
              <Text style={styles.titleText}>{entry.title}</Text>
            ) : null}
            
            <Text style={styles.bodyText} numberOfLines={4}>
              {entry.text}
            </Text>
            
            <Text style={styles.swipeHint}>← Swipe left for actions | Tap to read</Text>
          </View>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  card: {
    backgroundColor: 'rgba(30,30,35,0.85)',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 18,
  },
  moodText: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dateText: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  titleText: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bodyText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
  },
  swipeHint: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    gap: 8,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
