import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry } from '../../components/journal/JournalEditor';

const STORAGE_KEY = '@nirvaha_journals';

/**
 * Service handling raw read and write operations to the device's local storage (AsyncStorage).
 */
export class JournalStorageService {
  /**
   * Loads all saved journals from local storage.
   */
  static async loadJournals(): Promise<JournalEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load journals from local storage:', e);
      return [];
    }
  }

  /**
   * Saves the list of journals to local storage.
   * @param journals The complete list of journals to persist.
   */
  static async saveJournals(journals: JournalEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(journals));
    } catch (e) {
      console.error('Failed to save journals to local storage:', e);
      throw e;
    }
  }
}
