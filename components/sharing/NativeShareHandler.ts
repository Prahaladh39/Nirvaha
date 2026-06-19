import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

/**
 * Utility to share a local file via the native platform share sheet.
 * Useful for sharing generated images, audio, or PDFs.
 * 
 * @param fileUri Local filesystem URI of the file to share.
 * @param options Sharing options such as dialog title.
 */
export const shareFile = async (fileUri: string, dialogTitle = 'Share with Nirvaha') => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (!isAvailable) {
      throw new Error('Native sharing is not available on this platform.');
    }

    // Trigger native share sheet for the file
    await Sharing.shareAsync(fileUri, {
      dialogTitle,
      mimeType: 'image/png',
      UTI: Platform.OS === 'ios' ? 'public.png' : undefined,
    });
    
    return true;
  } catch (error) {
    console.error('Error sharing file native:', error);
    throw error;
  }
};
