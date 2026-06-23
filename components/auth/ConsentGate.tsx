import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Square, CheckSquare } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../constants/theme';
import { consentService } from '../../services/consent/consentService';
import {
  TERMS_AND_CONDITIONS,
  PRIVACY_POLICY,
  DPDP_ACT_COMPLIANCE,
  GLOBAL_PRIVACY_PRINCIPLES,
} from '../../constants/consentData';
import ConsentModal from './ConsentModal';
import { ParticleOverlay } from '../ParticleOverlay';

const { width } = Dimensions.get('window');

export default function ConsentGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [hasAccepted, setHasAccepted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [viewTerms, setViewTerms] = useState(false);
  const [viewPrivacy, setViewPrivacy] = useState(false);

  useEffect(() => {
    async function checkConsent() {
      if (!user) {
        setHasAccepted(true);
        setLoading(false);
        return;
      }
      
      const accepted = await consentService.hasAcceptedCurrentConsent();
      setHasAccepted(accepted);
      setLoading(false);
    }
    
    checkConsent();
  }, [user]);

  const handleAccept = async () => {
    if (!isChecked) {
      Toast.show({
        type: 'error',
        text1: 'Consent Required',
        text2: 'You must accept the Terms & Conditions and Privacy Policy before continuing.',
      });
      return;
    }

    setSubmitting(true);
    try {
      await consentService.saveConsent();
      setHasAccepted(true);
      Toast.show({
        type: 'success',
        text1: 'Consent Recorded',
        text2: 'Thank you for updating your preferences.',
      });
    } catch (e) {
      console.error(e);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to record consent. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return null; // Let main app loading handle it
  }

  // If user is not logged in or has accepted the current terms, render app content normal
  if (!user || hasAccepted) {
    return <>{children}</>;
  }

  const combinedTerms = [...TERMS_AND_CONDITIONS, DPDP_ACT_COMPLIANCE];
  const combinedPrivacy = [
    ...PRIVACY_POLICY,
    DPDP_ACT_COMPLIANCE,
    GLOBAL_PRIVACY_PRINCIPLES,
  ];

  return (
    <View style={styles.container}>
      <ParticleOverlay />

      {/* Ambient orbs */}
      <View style={[styles.ambientOrb, { width: 340, height: 340, top: '5%', left: '-10%', backgroundColor: theme.colors.healingGreen }]} />
      <View style={[styles.ambientOrb, { width: 280, height: 280, bottom: '5%', right: '-10%', backgroundColor: theme.colors.gold }]} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Policy & Agreement Update</Text>
            
            <Text style={styles.description}>
              We have updated Nirvaha's Terms & Conditions and Privacy Policy to align with India's new{' '}
              <Text style={styles.boldText}>Digital Personal Data Protection (DPDP) Act, 2023</Text>{' '}
              and standard global privacy practices inspired by GDPR.
            </Text>

            <View style={styles.callout}>
              <Text style={styles.calloutText}>
                To continue using your mental wellness companion, please review the documents below and accept the updated terms.
              </Text>
            </View>

            {/* Document buttons */}
            <View style={styles.linksContainer}>
              <Pressable style={styles.documentButton} onPress={() => setViewTerms(true)}>
                <Text style={styles.documentButtonText}>Terms & Conditions</Text>
              </Pressable>
              
              <Pressable style={styles.documentButton} onPress={() => setViewPrivacy(true)}>
                <Text style={styles.documentButtonText}>Privacy Policy</Text>
              </Pressable>
            </View>

            {/* Checkbox */}
            <Pressable
              style={styles.checkboxRow}
              onPress={() => setIsChecked(!isChecked)}
            >
              <View style={styles.checkboxIcon}>
                {isChecked ? (
                  <CheckSquare size={22} color={theme.colors.primary} />
                ) : (
                  <Square size={22} color={theme.colors.mutedForeground} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                I have read and agree to the Terms & Conditions and Privacy Policy.
              </Text>
            </Pressable>

            {/* Submit */}
            <Pressable
              style={[styles.submitButton, !isChecked && styles.submitButtonDisabled]}
              onPress={handleAccept}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={theme.colors.primaryForeground} />
              ) : (
                <Text style={styles.submitButtonText}>Accept & Continue</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      <ConsentModal
        visible={viewTerms}
        onClose={() => setViewTerms(false)}
        title="Terms & Conditions"
        sections={combinedTerms}
      />

      <ConsentModal
        visible={viewPrivacy}
        onClose={() => setViewPrivacy(false)}
        title="Privacy Policy"
        sections={combinedPrivacy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.1,
    filter: 'blur(50px)',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#EEF1EB',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 22,
    color: theme.colors.foreground,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.mutedForeground,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  boldText: {
    fontFamily: theme.typography.bodyMedium,
    color: theme.colors.primary,
  },
  callout: {
    backgroundColor: 'rgba(45, 90, 76, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  calloutText: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: theme.colors.foreground,
    textAlign: 'center',
    lineHeight: 18,
  },
  linksContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  documentButton: {
    flex: 1,
    backgroundColor: '#E6EBE4',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.08)',
  },
  documentButtonText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.primary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 28,
    width: '100%',
    paddingHorizontal: 4,
  },
  checkboxIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.mutedForeground,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: theme.colors.primaryForeground,
  },
});
