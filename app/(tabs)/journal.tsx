import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Plus, Bookmark } from 'lucide-react-native';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { theme } from '../../constants/theme';
import Toast from 'react-native-toast-message';

import JournalEditor, { JournalEntry } from '../../components/journal/JournalEditor';
import JournalEntryCard from '../../components/journal/JournalEntryCard';
import JournalEmptyState from '../../components/journal/JournalEmptyState';

export default function JournalScreen() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [filter, setFilter] = useState<'all' | 'saved'>('all');
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch from Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/journals`),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: JournalEntry[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as JournalEntry);
      });
      setEntries(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching journals:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSave = async (entry: JournalEntry) => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      await setDoc(doc(db, `users/${user.uid}/journals`, entry.id), entry);
      setShowEditor(false);
      setEditingEntry(null);
    } catch (error) {
      console.error("Error saving entry:", error);
      Toast.show({ type: 'error', text1: 'Save Failed', text2: 'Could not sync entry to cloud.' });
    }
  };

  const handleDelete = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/journals`, id));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowEditor(true);
  };

  const handleToggleSave = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const entryToUpdate = entries.find(e => e.id === id);
      if (entryToUpdate) {
        await updateDoc(doc(db, `users/${user.uid}/journals`, id), {
          saved: !entryToUpdate.saved
        });
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
    <SafeAreaView style={styles.container}>
      {/* Ambient Background Glows */}
      <View style={[styles.ambientOrb, { top: '8%', right: '-8%', backgroundColor: theme.colors.gold }]} />
      <View style={[styles.ambientOrb, { bottom: '25%', left: '-8%', backgroundColor: theme.colors.healingGreen }]} />

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
            {filteredEntries.map((entry, index) => (
              <JournalEntryCard 
                key={entry.id}
                entry={entry}
                index={index}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onToggleSave={handleToggleSave}
              />
            ))}
            <Text style={styles.footerQuote}>"Writing is thinking on paper"</Text>
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
    </SafeAreaView>
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
    paddingBottom: 120, // Space for BottomNav
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
