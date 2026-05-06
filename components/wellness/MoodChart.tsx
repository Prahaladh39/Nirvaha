import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, G, Line } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { MoodEntry } from '../../hooks/useMoodLog';

const moodScores: Record<string, number> = {
  happy: 5, joyful: 5, excited: 5,
  grateful: 5, serene: 4.5,
  calm: 4, relax: 4,
  focus: 3.5, sensitive: 3, confused: 3,
  tired: 2, bored: 2,
  sad: 1.5, frustrated: 1.5, stressed: 1.5, angry: 1.5, insecure: 1.5, guilty: 1.5, hurt: 1.5,
  anxious: 1,
};

const moodLabels: Record<number, string> = {
  1: "😰",
  2: "😔",
  3: "😐",
  4: "😌",
  5: "😊",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface MoodChartProps {
  moodLog: MoodEntry[];
}

export default function MoodChart({ moodLog }: MoodChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    // JS getDay(): 0 is Sunday, 1 is Monday. 
    // Shift so Monday is 0, Sunday is 6
    const shiftedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(now.getDate() - shiftedDay);
    monday.setHours(0, 0, 0, 0);

    return DAYS.map((day, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayMoods = moodLog.filter((e) => {
        const t = new Date(e.timestamp);
        return t >= dayStart && t <= dayEnd;
      });

      if (dayMoods.length === 0) return { day, score: null };

      const avg =
        dayMoods.reduce((sum, e) => sum + (moodScores[e.mood.toLowerCase()] || 3), 0) /
        dayMoods.length;

      return { day, score: Math.round(avg * 10) / 10 };
    });
  }, [moodLog]);

  const hasData = chartData.some((d) => d.score !== null);

  if (!hasData) {
    return (
      <Animated.View entering={FadeInDown.duration(500)} style={styles.emptyCard}>
        <Text style={{ fontSize: 32, marginBottom: 12 }}>🌱</Text>
        <Text style={styles.emptyTitle}>Your mood story begins here</Text>
        <Text style={styles.emptySubtitle}>Check in each day to unlock your weekly mood trend</Text>
      </Animated.View>
    );
  }

  // Build SVG path
  const width = Dimensions.get('window').width - 80; // Padding
  const height = 150;
  
  // Fill nulls with interpolated or previous values to connect the line
  let lastScore = 3;
  const filledData = chartData.map((d) => {
    if (d.score !== null) lastScore = d.score;
    return { ...d, score: d.score !== null ? d.score : lastScore };
  });

  const getCoordinates = () => {
    return filledData.map((d, i) => {
      const x = (i / 6) * width;
      // Map score (1-5) to Y (0-height). Score 5 is Y=0, Score 1 is Y=height
      const y = height - ((d.score - 1) / 4) * height;
      return { x, y, score: d.score, day: d.day };
    });
  };

  const points = getCoordinates();
  
  // Create smooth bezier curve path
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    // Control points for smooth curve
    const cp1x = p0.x + (p1.x - p0.x) / 2;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) / 2;
    const cp2y = p1.y;
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }

  // Close path for area fill
  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>MOOD TREND</Text>
        <View style={styles.emojiScale}>
          <Text style={styles.emoji}>😊</Text>
          <Text style={styles.emoji}>😐</Text>
          <Text style={styles.emoji}>😰</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg width={width} height={height} style={{ overflow: 'visible' }}>
          <Defs>
            <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={theme.colors.healingGreen} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={theme.colors.healingGreen} stopOpacity="0.0" />
            </LinearGradient>
          </Defs>
          
          {/* Horizontal Grid lines */}
          <Line x1="0" y1={height/2} x2={width} y2={height/2} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
          <Line x1="0" y1={height} x2={width} y2={height} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />

          {/* Area Fill */}
          <Path d={areaPath} fill="url(#gradient)" />
          
          {/* Stroke Path */}
          <Path d={path} fill="none" stroke={theme.colors.healingGreen} strokeWidth="3" />
          
          {/* Dots */}
          {points.map((p, i) => (
            <Circle 
              key={i} 
              cx={p.x} 
              cy={p.y} 
              r="4" 
              fill={theme.colors.gold} 
              stroke="#000" 
              strokeWidth="2" 
            />
          ))}
        </Svg>
        
        {/* X Axis Labels */}
        <View style={styles.xAxis}>
          {DAYS.map((d) => (
            <Text key={d} style={styles.dayLabel}>{d}</Text>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  emojiScale: {
    flexDirection: 'row',
    gap: 12,
  },
  emoji: {
    fontSize: 14,
  },
  chartContainer: {
    height: 150 + 20, // 20 for X axis
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dayLabel: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  }
});
