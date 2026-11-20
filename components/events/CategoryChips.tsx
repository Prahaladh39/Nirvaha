import React from 'react';
import {
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { EventCategory } from '../../types/events';

export interface CategoryOption {
  key: 'all' | EventCategory;
  label: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { key: 'all', label: 'All Experiences' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'meditation', label: 'Meditation' },
  { key: 'sound_healing', label: 'Sound Healing' },
  { key: 'wellness_workshops', label: 'Workshops' },
  { key: 'retreats', label: 'Retreats' },
  { key: 'community_experiences', label: 'Community' },
];

interface CategoryChipsProps {
  selectedCategory: string;
  onSelectCategory: (category: 'all' | EventCategory) => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  style,
  contentContainerStyle,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
    >
      {CATEGORY_OPTIONS.map((item) => {
        const isSelected = selectedCategory === item.key;
        return (
          <Pressable
            key={item.key}
            style={({ pressed }) => [
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipUnselected,
              pressed && styles.chipPressed,
            ]}
            onPress={() => onSelectCategory(item.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={item.label}
          >
            <Text
              style={[
                styles.chipText,
                isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chipSelected: {
    backgroundColor: 'rgba(45, 90, 76, 0.45)',
    borderColor: '#D4AF37',
  },
  chipPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.2,
  },
  chipTextUnselected: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter_500Medium',
  },
});
