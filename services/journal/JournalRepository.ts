import { JournalStorageService } from './JournalStorageService';
import { JournalEntry } from '../../components/journal/JournalEditor';

/**
 * Data repository orchestrating business logic, auto-titling, sorting,
 * and CRUD operations for journal entries. Separates UI from storage API.
 */
export class JournalRepository {
  /**
   * Fetches all journal entries in reverse chronological order (newest first).
   */
  static async getAll(): Promise<JournalEntry[]> {
    const entries = await JournalStorageService.loadJournals();
    return entries.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Saves a new journal entry or updates an existing one.
   * Updates lastEditedTimestamp and auto-generates a title if empty.
   */
  static async save(
    entry: Omit<JournalEntry, 'timestamp' | 'lastEditedTimestamp'> & {
      timestamp?: string;
      lastEditedTimestamp?: string;
    }
  ): Promise<JournalEntry> {
    const entries = await JournalStorageService.loadJournals();
    const now = new Date().toISOString();
    
    // Auto-generate title if empty
    const title = entry.title?.trim() || this.generateAutoTitle(entry.text, entry.timestamp || now);

    const existingIndex = entries.findIndex((e) => e.id === entry.id);
    let updatedEntry: JournalEntry;

    if (existingIndex > -1) {
      // Update existing entry
      const oldEntry = entries[existingIndex];
      updatedEntry = {
        ...oldEntry,
        title,
        text: entry.text,
        mood: entry.mood,
        moodEmoji: entry.moodEmoji,
        lastEditedTimestamp: now,
        saved: entry.saved !== undefined ? entry.saved : oldEntry.saved,
      };
      entries[existingIndex] = updatedEntry;
    } else {
      // Create new entry
      updatedEntry = {
        id: entry.id || Math.random().toString(36).substring(2, 15),
        title,
        text: entry.text,
        mood: entry.mood,
        moodEmoji: entry.moodEmoji,
        timestamp: entry.timestamp || now,
        lastEditedTimestamp: now,
        saved: entry.saved || false,
      };
      entries.push(updatedEntry);
    }

    await JournalStorageService.saveJournals(entries);
    return updatedEntry;
  }

  /**
   * Deletes a journal entry by ID.
   */
  static async delete(id: string): Promise<void> {
    const entries = await JournalStorageService.loadJournals();
    const filtered = entries.filter((e) => e.id !== id);
    await JournalStorageService.saveJournals(filtered);
  }

  /**
   * Toggles bookmark status of a journal entry.
   */
  static async toggleSave(id: string): Promise<JournalEntry | null> {
    const entries = await JournalStorageService.loadJournals();
    const index = entries.findIndex((e) => e.id === id);
    if (index > -1) {
      entries[index].saved = !entries[index].saved;
      await JournalStorageService.saveJournals(entries);
      return entries[index];
    }
    return null;
  }

  /**
   * Auto-generates a title from the first line or first 5 words of the text.
   */
  private static generateAutoTitle(text: string, timestamp: string): string {
    const trimmed = text.trim();
    if (!trimmed) {
      return `Reflection on ${new Date(timestamp).toLocaleDateString()}`;
    }
    
    // Split by newline and get the first line
    const firstLine = trimmed.split('\n')[0].trim();
    if (firstLine) {
      if (firstLine.length <= 40) return firstLine;
      return firstLine.substring(0, 37) + '...';
    }
    
    // Fallback: first 5 words
    const words = trimmed.split(/\s+/);
    if (words.length > 0) {
      const summary = words.slice(0, 5).join(' ');
      if (summary.length <= 40) return summary;
      return summary.substring(0, 37) + '...';
    }

    return `Reflection on ${new Date(timestamp).toLocaleDateString()}`;
  }
}
