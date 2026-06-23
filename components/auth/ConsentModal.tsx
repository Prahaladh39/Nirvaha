import React from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { ConsentSection } from '../../constants/consentData';

const { width } = Dimensions.get('window');

interface ConsentModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  sections: ConsentSection[];
}

export default function ConsentModal({ visible, onClose, title, sections }: ConsentModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Sticky Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Pressable onPress={onClose} style={styles.closeButton} accessibilityLabel="Close documents">
            <X size={22} color={theme.colors.foreground} />
          </Pressable>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          {sections.map((section, index) => (
            <View key={index} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              {section.content.map((paragraph, pIndex) => (
                <Text key={pIndex} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
              
              {index < sections.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
          
          <View style={styles.footerSpacer} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F6F0', // Nirvaha's warm beige theme background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(45, 90, 76, 0.1)',
    backgroundColor: '#F8F6F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    color: theme.colors.foreground,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(45, 90, 76, 0.05)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: theme.colors.primary,
    marginBottom: 12,
    lineHeight: 24,
  },
  paragraph: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.mutedForeground,
    lineHeight: 22,
    marginBottom: 10,
    textAlign: 'justify',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(45, 90, 76, 0.08)',
    marginTop: 16,
    marginBottom: 8,
  },
  footerSpacer: {
    height: 48,
  },
});
