import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: React.ReactNode;
  /**
   * Background components (e.g. Gradients, Image overlays) that need to render full-bleed.
   */
  background?: React.ReactNode;
  /**
   * If true, content container padding is applied selectively (so backgrounds can bleed edge-to-edge).
   */
  fullBleed?: boolean;
  /**
   * Wraps children in a ScrollView.
   */
  scrollable?: boolean;
  /**
   * Styling for the ScrollView content container.
   */
  scrollContentStyle?: ViewStyle;
  /**
   * Styling for the layout.
   */
  style?: ViewStyle;
  /**
   * Custom edges to apply safe area padding to (default: top, bottom, left, right).
   */
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  /**
   * Status bar text theme: light, dark, or auto.
   */
  statusBarStyle?: 'light' | 'dark' | 'auto';
  /**
   * Integrates a KeyboardAvoidingView wrapper.
   */
  avoidKeyboard?: boolean;
  /**
   * Vertical offset for KeyboardAvoidingView.
   */
  keyboardOffset?: number;
  /**
   * Injects dynamic bottom padding to clear the floating bottom navigation bar.
   */
  hasBottomTab?: boolean;
}

// Global UI / Layout spacing tokens to eliminate hardcoded magic numbers
export const LAYOUT_TOKENS = {
  BOTTOM_NAV_HEIGHT: 60,
  BOTTOM_NAV_MARGIN: 20,
  CONTENT_PADDING: 16,
  GAP_PADDING: 20,
};

export default function ScreenContainer({
  children,
  background,
  fullBleed = false,
  scrollable = false,
  scrollContentStyle,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
  statusBarStyle = 'light',
  avoidKeyboard = false,
  keyboardOffset,
  hasBottomTab = false,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  // Compute edges insets padding
  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingLeft = edges.includes('left') ? insets.left : 0;
  const paddingRight = edges.includes('right') ? insets.right : 0;
  
  // Calculate dynamic bottom padding
  // The BottomNav sits at: Math.max(BOTTOM_NAV_MARGIN, insets.bottom + 4) from screen bottom.
  // Content must clear: navBottom + navHeight + breathing room.
  const navBottomOffset = Math.max(LAYOUT_TOKENS.BOTTOM_NAV_MARGIN, insets.bottom + 4);
  const tabPadding = hasBottomTab 
    ? (navBottomOffset + LAYOUT_TOKENS.BOTTOM_NAV_HEIGHT + LAYOUT_TOKENS.GAP_PADDING) 
    : 0;
  
  const baseBottomInset = (!hasBottomTab && edges.includes('bottom')) ? insets.bottom : 0;
  const totalBottomPadding = baseBottomInset + tabPadding;

  const contentStyle = {
    paddingTop,
    paddingBottom: scrollable ? 0 : totalBottomPadding,
    paddingLeft,
    paddingRight,
  };

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={[
            { paddingBottom: totalBottomPadding },
            scrollContentStyle,
          ]}
        >
          {children}
        </ScrollView>
      );
    }
    return <View style={[styles.content, style]}>{children}</View>;
  };

  const renderContainer = () => {
    if (avoidKeyboard) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={keyboardOffset ?? (Platform.OS === 'ios' ? 0 : 20)}
        >
          {renderContent()}
        </KeyboardAvoidingView>
      );
    }
    return renderContent();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      {/* Background elements run completely edge-to-edge */}
      {background}
      
      {fullBleed ? (
        <View style={[{ flex: 1 }, contentStyle]}>
          {renderContainer()}
        </View>
      ) : (
        <View style={[{ flex: 1 }, contentStyle]}>
          {renderContainer()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
