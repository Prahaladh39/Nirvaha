import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import ScreenContainer from '../../components/ui/ScreenContainer';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Plus, Bookmark } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import Toast from 'react-native-toast-message';

import JournalEditor, { JournalEntry } from '../../components/journal/JournalEditor';
import JournalEntryCard from '../../components/journal/JournalEntryCard';
import JournalEmptyState from '../../components/journal/JournalEmptyState';
import JournalList from '../../components/journal/JournalList';
import JournalDetail from '../../components/journal/JournalDetail';
import { JournalRepository } from '../../services/journal/JournalRepository';


export default function JournalScreen() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [selectedDetailEntry, setSelectedDetailEntry] = useState<JournalEntry | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filter, setFilter] = useState<'all' | 'saved'>('all');
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load journals from local repository on mount
  useEffect(() => {
    const loadJournals = async () => {
      try {
        const localEntries = await JournalRepository.getAll();
        setEntries(localEntries);
      } catch (error) {
        console.error("Error loading journals:", error);
      } finally {
        setLoading(false);
      }
    };
    loadJournals();
  }, []);

  const handleSave = async (entry: JournalEntry) => {
    try {
      const saved = await JournalRepository.save(entry);
      
      // Update local state reactively
      setEntries((prev) => {
        const existingIdx = prev.findIndex((e) => e.id === saved.id);
        if (existingIdx > -1) {
          const next = [...prev];
          next[existingIdx] = saved;
          return next;
        } else {
          return [saved, ...prev];
        }
      });

      setShowEditor(false);
      setEditingEntry(null);
      Toast.show({ type: 'success', text1: 'Journal saved successfully' });
    } catch (error) {
      console.error("Error saving entry:", error);
      Toast.show({ type: 'error', text1: 'Save Failed', text2: 'Could not save entry locally.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await JournalRepository.delete(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      Toast.show({ type: 'success', text1: 'Journal deleted' });
    } catch (error) {
      console.error("Error deleting entry:", error);
      Toast.show({ type: 'error', text1: 'Delete Failed', text2: 'Could not delete entry.' });
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowEditor(true);
  };

  const handlePressCard = (entry: JournalEntry) => {
    setSelectedDetailEntry(entry);
    setShowDetail(true);
  };

  const handleToggleSave = async (id: string) => {
    try {
      const updated = await JournalRepository.toggleSave(id);
      if (updated) {
        setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };


  const filteredEntries = filter === 'saved' ? entries.filter(e => e.saved) : entries;
  const savedCount = entries.filter(e => e.saved).length;
  const totalEntries = entries.length;

  const topMood = useMemo(() => {
    if (entries.length === 0) return null;
    const counts: Record<string, { count: number, emoji: string }> = {};
    entries.forEach(e => {
      if (!counts[e.mood]) counts[e.mood] = { count: 0, emoji: e.moodEmoji };
      counts[e.mood].count++;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1].count - a[1].count);
    return sorted[0]; // [moodName, {count, emoji}]
  }, [entries]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScreenContainer
      fullBleed
      hasBottomTab
      statusBarStyle="light"
      style={styles.container}
      background={
        <>
          {/* Ambient Background Glows */}
          <View style={[styles.ambientOrb, { top: '8%', right: '-8%', backgroundColor: theme.colors.gold }]} />
          <View style={[styles.ambientOrb, { bottom: '25%', left: '-8%', backgroundColor: theme.colors.healingGreen }]} />
        </>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.title}>Journal</Text>
          <Text style={styles.subtitle}>A safe space for your thoughts</Text>
        </Animated.View>

        {totalEntries > 0 && (
          <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalEntries}</Text>
                <Text style={styles.statLabel}>ENTRIES</Text>
              </View>
              {topMood && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{topMood[1].emoji}</Text>
                  <Text style={styles.statLabel}>TOP MOOD</Text>
                </View>
              )}
              {savedCount > 0 && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{savedCount}</Text>
                  <Text style={styles.statLabel}>SAVED</Text>
                </View>
              )}
            </View>
            <Pressable 
              style={styles.addBtnSmall}
              onPress={() => { setEditingEntry(null); setShowEditor(true); }}
            >
              <Plus size={18} color={theme.colors.primaryForeground} />
            </Pressable>
          </Animated.View>
        )}

        {totalEntries > 0 && (
          <View style={styles.filterRow}>
            <Pressable 
              style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                All entries
              </Text>
            </Pressable>
            <Pressable 
              style={[styles.filterBtn, filter === 'saved' && styles.filterBtnActive]}
              onPress={() => setFilter('saved')}
            >
              <Bookmark size={12} color={filter === 'saved' ? theme.colors.primaryForeground : '#FFF'} />
              <Text style={[styles.filterText, filter === 'saved' && styles.filterTextActive]}>
                Saved
              </Text>
            </Pressable>
          </View>
        )}

        {totalEntries === 0 ? (
          <JournalEmptyState onStart={() => { setEditingEntry(null); setShowEditor(true); }} />
        ) : filteredEntries.length === 0 ? (
          <Animated.View entering={FadeIn.duration(400)} style={styles.emptySaved}>
            <Bookmark size={32} color="rgba(255,255,255,0.2)" />
            <Text style={styles.emptySavedTitle}>No saved reflections yet</Text>
            <Text style={styles.emptySavedSub}>Swipe left on an entry and tap the bookmark to save it</Text>
          </Animated.View>
        ) : (
          <View>
            <JournalList
              entries={filteredEntries}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onToggleSave={handleToggleSave}
              onPressCard={handlePressCard}
            />
            <Text style={styles.footerQuote}>{"\"Writing is thinking on paper\""}</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {totalEntries > 0 && !showEditor && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.fabContainer}>
          <Pressable 
            style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.9 }] }]}
            onPress={() => { setEditingEntry(null); setShowEditor(true); }}
          >
            <Plus size={24} color={theme.colors.primaryForeground} />
          </Pressable>
        </Animated.View>
      )}

      {/* Editor Modal */}
      <JournalEditor 
        visible={showEditor}
        onSave={handleSave}
        onClose={() => { setShowEditor(false); setEditingEntry(null); }}
        editEntry={editingEntry}
      />

      {/* Detail View Modal */}
      <JournalDetail
        visible={showDetail}
        entry={selectedDetailEntry}
        onClose={() => { setShowDetail(false); setSelectedDetailEntry(null); }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientOrb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.15,
    filter: 'blur(50px)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    // Spacing at bottom calculated dynamically by ScreenContainer
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },
  addBtnSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: '#FFFFFF',
  },
  filterTextActive: {
    color: theme.colors.primaryForeground,
    fontWeight: '600',
  },
  emptySaved: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptySavedTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySavedSub: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    maxWidth: 240,
  },
  footerQuote: {
    fontFamily: theme.typography.display,
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    paddingVertical: 32,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 100,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  }
});
