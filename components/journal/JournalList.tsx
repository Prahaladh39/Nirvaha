import React from 'react';
import { View, StyleSheet } from 'react-native';
import JournalEntryCard from './JournalEntryCard';
import { JournalEntry } from './JournalEditor';

interface JournalListProps {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: JournalEntry) => void;
  onToggleSave: (id: string) => void;
  onPressCard: (entry: JournalEntry) => void;
}

export default function JournalList({
  entries,
  onDelete,
  onEdit,
  onToggleSave,
  onPressCard,
}: JournalListProps) {
  return (
    <View style={styles.container}>
      {entries.map((entry, index) => (
        <JournalEntryCard
          key={entry.id}
          entry={entry}
          index={index}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleSave={onToggleSave}
          onPressCard={onPressCard}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
