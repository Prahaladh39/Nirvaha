import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';
import { ChevronLeft, Scale, Play, RefreshCw } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';
import { 
  TILES, EVENTS, ZONE_MULTIPLIER, INITIAL_STATS, THEME_COLORS, 
  TileData, TileEffect, Family 
} from '../../constants/templeOfBalanceData';

// Helper: Shuffle array
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());

type BoardCell = TileData | 'balance_core' | null;

export default function TempleOfBalanceScreen() {
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [turn, setTurn] = useState(1);
  const [stats, setStats] = useState({ ...INITIAL_STATS });
  const [board, setBoard] = useState<BoardCell[][]>(
    Array(5).fill(null).map((_, r) => 
      Array(5).fill(null).map((_, c) => (r === 2 && c === 2 ? 'balance_core' : null))
    )
  );
  
  const [drawnTiles, setDrawnTiles] = useState<TileData[]>([]);
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);
  
  const [feedback, setFeedback] = useState<{ tile: string, event: string, insight: string }>({
    tile: 'Place a tile to begin.',
    event: 'The temple is quiet.',
    insight: 'Good balance. The board is stable.'
  });

  // Initialize first draw
  useEffect(() => {
    setDrawnTiles(shuffle(TILES).slice(0, 3));
  }, []);

  const getZone = (r: number, c: number) => {
    if ((r === 1 && c === 2) || (r === 3 && c === 2) || (r === 2 && c === 1) || (r === 2 && c === 3)) return 'inner_ring';
    if ((r === 0 && c === 0) || (r === 0 && c === 4) || (r === 4 && c === 0) || (r === 4 && c === 4)) return 'corner';
    if (r === 0 || r === 4 || c === 0 || c === 4) return 'edge';
    return 'normal';
  };

  const getNeighbors = (r: number, c: number) => {
    return [
      [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
    ].filter(([nr, nc]) => nr >= 0 && nr < 5 && nc >= 0 && nc < 5);
  };

  const handleCellPress = (r: number, c: number) => {
    if (gameState !== 'playing' || board[r][c] !== null) return;
    
    if (!selectedTile) {
      setFeedback(prev => ({ 
        ...prev, 
        tile: 'Please select a tile from the bottom first!' 
      }));
      return;
    }

    const newBoard = [...board].map(row => [...row]);
    newBoard[r][c] = selectedTile;
    
    // --- 1 & 2. Base Effects & Zone Multiplier ---
    const multiplier = ZONE_MULTIPLIER[getZone(r, c)];
    const appliedEffects: TileEffect = { ...selectedTile.effects };
    
    // Apply multiplier to base effects
    Object.keys(appliedEffects).forEach(key => {
      const k = key as keyof TileEffect;
      if (appliedEffects[k]) {
        appliedEffects[k] = Math.round(appliedEffects[k]! * multiplier);
      }
    });

    // We will accumulate stat changes in a temp object
    const finalDelta: TileEffect = { ...appliedEffects };

    // Helper to safely add to finalDelta
    const addStat = (stat: keyof TileEffect, val: number) => {
      finalDelta[stat] = (finalDelta[stat] || 0) + val;
    };

    // --- 3. Adjacency Effects ---
    const neighbors = getNeighbors(r, c);
    let sameFamilyCount = 0;
    
    neighbors.forEach(([nr, nc]) => {
      const neighborCell = newBoard[nr][nc];
      if (neighborCell && neighborCell !== 'balance_core') {
        const nFamily = neighborCell.family;
        
        // Same family neighbor
        if (nFamily === selectedTile.family) {
          addStat(selectedTile.family, 2);
          sameFamilyCount++;
        }

        // Complementary pairs
        const isComp = (f1: string, f2: string) => 
          (f1 === 'work' && f2 === 'rest') || (f1 === 'rest' && f2 === 'work') ||
          (f1 === 'relationships' && f2 === 'growth') || (f1 === 'growth' && f2 === 'relationships');
        
        if (isComp(selectedTile.family, nFamily)) {
          addStat('stability', 4);
        }
      }
    });

    // Check cluster (3+)
    const visited = new Set<string>();
    const countCluster = (cr: number, cc: number, fam: Family): number => {
      const key = `${cr},${cc}`;
      if (visited.has(key)) return 0;
      visited.add(key);
      let size = 1;
      getNeighbors(cr, cc).forEach(([nr, nc]) => {
        const cell = newBoard[nr][nc];
        if (cell && cell !== 'balance_core' && cell.family === fam) {
          size += countCluster(nr, nc, fam);
        }
      });
      return size;
    };
    
    const clusterSize = countCluster(r, c, selectedTile.family);
    if (clusterSize >= 3) {
      addStat('stability', -5);
    }

    // --- 4. Inner Ring Rules ---
    const innerRingCells = [newBoard[1][2], newBoard[3][2], newBoard[2][1], newBoard[2][3]];
    const innerFamilies = innerRingCells
      .filter(cell => cell && cell !== 'balance_core')
      .map(cell => (cell as TileData).family);
      
    const uniqueInner = new Set(innerFamilies);
    
    if (uniqueInner.size === 4) {
      addStat('stability', 10);
    } else {
      // Check 3+ of same family
      const counts: Record<string, number> = {};
      innerFamilies.forEach(f => { counts[f] = (counts[f] || 0) + 1; });
      if (Object.values(counts).some(v => v >= 3)) {
        addStat('stability', -8);
      }
    }

    // Opposite pairs in inner ring
    const top = newBoard[1][2];
    const bot = newBoard[3][2];
    const left = newBoard[2][1];
    const right = newBoard[2][3];

    const isOppositePair = (cellA: BoardCell, cellB: BoardCell, famA: string, famB: string) => {
      if (!cellA || cellA === 'balance_core' || !cellB || cellB === 'balance_core') return false;
      return (cellA.family === famA && cellB.family === famB) || (cellA.family === famB && cellB.family === famA);
    };

    if (isOppositePair(top, bot, 'work', 'rest') || isOppositePair(left, right, 'work', 'rest')) {
      addStat('stability', 6);
      addStat('work', 3);
      addStat('rest', 3);
    }
    
    if (isOppositePair(top, bot, 'relationships', 'growth') || isOppositePair(left, right, 'relationships', 'growth')) {
      addStat('stability', 6);
      addStat('relationships', 3);
      addStat('growth', 3);
    }

    // Generate Tile Feedback String
    const formatEffect = (eff: TileEffect) => {
      return Object.entries(eff).filter(([_, v]) => v !== 0)
        .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)} ${(v as number) > 0 ? '+' : ''}${v}`)
        .join(', ');
    };
    const tileFeedback = `${selectedTile.name}: ${formatEffect(finalDelta)}`;

    // Apply Tile Delta to Temp Stats
    let tempStats = { ...stats };
    Object.entries(finalDelta).forEach(([k, v]) => {
      const statKey = k as keyof typeof tempStats;
      tempStats[statKey] += v as number;
    });

    // --- 5. Event System ---
    const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    let diffMult = 1.0;
    if (turn <= 3) diffMult = 0.7;
    else if (turn >= 9) diffMult = 1.3;

    const eventEffects: TileEffect = {};
    Object.entries(randomEvent.effects).forEach(([k, v]) => {
      const statKey = k as keyof typeof tempStats;
      const modV = Math.round((v as number) * diffMult);
      eventEffects[statKey] = modV;
      tempStats[statKey] += modV;
    });

    const eventFeedback = `${randomEvent.name}: ${formatEffect(eventEffects)}`;

    // --- 6. Clamp Stats ---
    Object.keys(tempStats).forEach(k => {
      const statKey = k as keyof typeof tempStats;
      tempStats[statKey] = Math.max(0, Math.min(100, tempStats[statKey]));
    });

    // Generate Insight
    let insight = "Good balance. The board is stable.";
    if (tempStats.work > 80 && tempStats.rest < 30) insight = "Work is rising, but rest is becoming fragile.";
    else if (tempStats.stability < 40) insight = "The core is under strain. Rebalance soon.";
    else if (Object.values(tempStats).some(v => v < 20)) {
      const lowStat = Object.keys(tempStats).find(k => tempStats[k as keyof typeof tempStats] < 20);
      insight = `${lowStat?.toUpperCase()} is critically low.`;
    } else if (uniqueInner.size === 4) insight = "This placement strengthens the core.";

    // Update States
    setBoard(newBoard);
    setStats(tempStats);
    setFeedback({ tile: tileFeedback, event: eventFeedback, insight });
    setSelectedTile(null);

    // --- 7. Win/Loss Check ---
    if (Object.values(tempStats).some(v => v === 0)) {
      setGameState('lost');
    } else if (turn === 12) {
      setGameState('won');
    } else {
      setTurn(t => t + 1);
      setDrawnTiles(shuffle(TILES).slice(0, 3));
    }
  };

  const handleReset = () => {
    setGameState('playing');
    setTurn(1);
    setStats({ ...INITIAL_STATS });
    setBoard(Array(5).fill(null).map((_, r) => 
      Array(5).fill(null).map((_, c) => (r === 2 && c === 2 ? 'balance_core' : null))
    ));
    setDrawnTiles(shuffle(TILES).slice(0, 3));
    setSelectedTile(null);
    setFeedback({
      tile: 'A new cycle begins.',
      event: 'The temple resets.',
      insight: 'Maintain balance.'
    });
  };

  const renderStatBar = (name: string, value: number, color: string) => (
    <View style={styles.statRow} key={name}>
      <Text style={styles.statLabel}>{name.toUpperCase()}</Text>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 50 : 20 }]}>
        <Pressable onPress={() => router.push('/')} style={styles.backBtn}>
          <ChevronLeft color="#FFFFFF" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Temple of Balance</Text>
        <View style={styles.turnBadge}>
          <Text style={styles.turnText}>Turn {turn}/12</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* STATS */}
        <View style={styles.statsContainer}>
          {renderStatBar('Work', stats.work, THEME_COLORS.work)}
          {renderStatBar('Rest', stats.rest, THEME_COLORS.rest)}
          {renderStatBar('Relationships', stats.relationships, THEME_COLORS.relationships)}
          {renderStatBar('Growth', stats.growth, THEME_COLORS.growth)}
          {renderStatBar('Stability', stats.stability, THEME_COLORS.stability)}
        </View>

        {/* BOARD */}
        <View style={styles.boardContainer}>
          {board.map((row, rIdx) => (
            <View key={`row-${rIdx}`} style={styles.boardRow}>
              {row.map((cell, cIdx) => {
                const isCore = cell === 'balance_core';
                const isSelectedSlot = selectedTile && !cell;
                
                let cellStyle = [styles.cell];
                let content = null;

                if (isCore) {
                  cellStyle.push(styles.coreCell);
                  content = <Scale size={24} color={THEME_COLORS.balanceCore} />;
                } else if (cell) {
                  const tData = cell as TileData;
                  cellStyle.push({ backgroundColor: `${THEME_COLORS[tData.family]}40`, borderColor: THEME_COLORS[tData.family] } as any);
                  content = <Text style={[styles.cellText, { color: THEME_COLORS[tData.family] }]}>{tData.name.split(' ')[0]}</Text>;
                } else if (isSelectedSlot) {
                  cellStyle.push(styles.emptyCellSelectable);
                } else {
                  cellStyle.push(styles.emptyCell);
                }

                return (
                  <Pressable 
                    key={`cell-${rIdx}-${cIdx}`} 
                    style={cellStyle}
                    onPress={() => handleCellPress(rIdx, cIdx)}
                  >
                    {content}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        {/* FEEDBACK */}
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTile}>{feedback.tile}</Text>
          <Text style={styles.feedbackEvent}>{feedback.event}</Text>
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>{feedback.insight}</Text>
          </View>
        </View>

      </ScrollView>

      {/* TILE DRAWER */}
      {gameState === 'playing' && (
        <View style={styles.drawerContainer}>
          <Text style={styles.drawerTitle}>Select a Tile to Place</Text>
          <View style={styles.drawerRow}>
            {drawnTiles.map((t, idx) => {
              const isSelected = selectedTile?.id === t.id;
              return (
                <Pressable 
                  key={idx} 
                  style={[
                    styles.drawerTile, 
                    { borderColor: isSelected ? THEME_COLORS[t.family] : 'rgba(255,255,255,0.1)' },
                    isSelected && { backgroundColor: `${THEME_COLORS[t.family]}20` }
                  ]}
                  onPress={() => setSelectedTile(t)}
                >
                  <Text style={[styles.drawerTileName, { color: THEME_COLORS[t.family] }]} numberOfLines={1}>
                    {t.name}
                  </Text>
                  <Text style={styles.drawerTileDesc} numberOfLines={2}>{t.desc}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* END SCREEN OVERLAY */}
      {gameState !== 'playing' && (
        <View style={styles.endOverlay}>
          <Animated.View entering={SlideInUp} style={styles.endCard}>
            <Text style={styles.endTitle}>{gameState === 'won' ? 'Balance Achieved' : 'Temple Collapsed'}</Text>
            
            <View style={styles.endSummary}>
              {(() => {
                if (gameState === 'lost') {
                  const lowest = Object.entries(stats).reduce((a, b) => a[1] <= b[1] ? a : b);
                  return <Text style={styles.endInsight}>{lowest[0].toUpperCase()} fell behind. Every dimension needs attention.</Text>;
                } else {
                  const highest = Object.entries(stats).filter(e => e[0] !== 'stability').reduce((a, b) => a[1] >= b[1] ? a : b);
                  if (highest[0] === 'work') return <Text style={styles.endInsight}>You often chose achievement over recovery.</Text>;
                  if (highest[0] === 'rest') return <Text style={styles.endInsight}>You prioritised recovery. A wise rhythm.</Text>;
                  if (highest[0] === 'relationships') return <Text style={styles.endInsight}>Connection stayed at the centre of your choices.</Text>;
                  return <Text style={styles.endInsight}>You kept investing in yourself.</Text>;
                }
              })()}
            </View>

            <Pressable style={styles.playAgainBtn} onPress={handleReset}>
              <RefreshCw size={20} color="#0A0A0A" />
              <Text style={styles.playAgainText}>Play Again</Text>
            </Pressable>
          </Animated.View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#050505' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20, color: '#FFFFFF', fontWeight: '600'
  },
  turnBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16,
  },
  turnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14, color: '#FFFFFF'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 220, // space for drawer
  },
  statsContainer: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    width: 100,
    fontFamily: theme.typography.bodyMedium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  boardContainer: {
    aspectRatio: 1,
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    padding: 8,
    gap: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  boardRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyCell: {
    backgroundColor: '#111111',
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyCellSelectable: {
    backgroundColor: '#1A1A1A',
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
  },
  coreCell: {
    backgroundColor: `${THEME_COLORS.balanceCore}20`,
    borderColor: THEME_COLORS.balanceCore,
    shadowColor: THEME_COLORS.balanceCore,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  cellText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 10,
    fontWeight: '700',
  },
  feedbackContainer: {
    gap: 8,
  },
  feedbackTile: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  feedbackEvent: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  insightBox: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
  },
  insightText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: THEME_COLORS.balanceCore,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  drawerContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#111111',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  drawerTitle: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
    textAlign: 'center',
  },
  drawerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  drawerTile: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  drawerTileName: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  drawerTileDesc: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  endOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  endCard: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    alignItems: 'center',
  },
  endTitle: {
    fontFamily: theme.typography.display,
    fontSize: 28,
    color: '#FFF',
    fontWeight: '700',
    marginBottom: 16,
  },
  endSummary: {
    marginBottom: 32,
  },
  endInsight: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  playAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  playAgainText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 16,
    color: '#0A0A0A',
    fontWeight: '600',
  }
});
