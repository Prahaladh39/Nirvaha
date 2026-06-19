import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

/**
 * Utility to copy text to the system clipboard and show a Toast notification.
 * 
 * @param text The text content to copy.
 * @param successMessage Optional custom success message to show in the toast.
 */
export const copyTextToClipboard = async (text: string, successMessage = 'Copied to clipboard') => {
  try {
    await Clipboard.setStringAsync(text);
    Toast.show({
      type: 'success',
      text1: successMessage,
      text2: 'Link and description ready to share!',
    });
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    Toast.show({
      type: 'error',
      text1: 'Failed to copy',
      text2: 'Please try again.',
    });
    return false;
  }
};
