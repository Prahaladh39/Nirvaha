import AsyncStorage from '@react-native-async-storage/async-storage';
import { CURRENT_CONSENT_VERSION } from '../../constants/consentData';

const CONSENT_STORAGE_KEY = 'nirvaha_user_consent_record';

export interface ConsentRecord {
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedVersion: string;
  acceptedTimestamp: string;
}

export const consentService = {
  /**
   * Checks if the user has accepted the current version of the consent documents.
   */
  async hasAcceptedCurrentConsent(): Promise<boolean> {
    try {
      const stored = await AsyncStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) return false;

      const record: ConsentRecord = JSON.parse(stored);
      
      // Ensure terms and privacy are accepted and version matches the current active version
      return (
        record.acceptedTerms === true &&
        record.acceptedPrivacy === true &&
        record.acceptedVersion === CURRENT_CONSENT_VERSION
      );
    } catch (error) {
      console.error('Error reading consent status from AsyncStorage:', error);
      return false;
    }
  },

  /**
   * Stores the user's acceptance of the current consent documents.
   */
  async saveConsent(): Promise<void> {
    try {
      const record: ConsentRecord = {
        acceptedTerms: true,
        acceptedPrivacy: true,
        acceptedVersion: CURRENT_CONSENT_VERSION,
        acceptedTimestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch (error) {
      console.error('Error saving consent status to AsyncStorage:', error);
      throw error;
    }
  },

  /**
   * Retrieves the current consent record if it exists.
   */
  async getConsentRecord(): Promise<ConsentRecord | null> {
    try {
      const stored = await AsyncStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error retrieving consent record:', error);
      return null;
    }
  },

  /**
   * Clears consent records (useful for debugging, testing, or logout/reset operations).
   */
  async clearConsentRecord(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing consent record:', error);
    }
  }
};
