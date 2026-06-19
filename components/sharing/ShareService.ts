import ViewShot from 'react-native-view-shot';
import React from 'react';
import { shareFile } from './NativeShareHandler';
import { copyTextToClipboard } from './CopyShareText';

// App URL used for sharing
export const APP_SHARE_LINK = 'https://nirvaha-app.vercel.app';

// Default sharing copy
export const DEFAULT_SHARE_TEXT = `Discover your Ancient Character with Nirvaha — a modern spiritual wellness app inspired by ancient Indian wisdom.\n\n${APP_SHARE_LINK}`;

/**
 * Future-ready Sharing Service that manages image rendering from components,
 * native file sharing sheets, and clipboard copying.
 */
export class ShareService {
  /**
   * Captures an offscreen component using its ViewShot ref and shares the generated image file natively.
   * 
   * @param viewShotRef Ref referencing the ViewShot component
   * @param title Title used in the sharing dialog
   */
  static async shareCard(
    viewShotRef: React.RefObject<ViewShot | null> | React.RefObject<any>,
    title: string
  ): Promise<boolean> {
    if (!viewShotRef || !viewShotRef.current) {
      throw new Error('Capture target was not ready. Please try again.');
    }

    try {
      // Capture the element layout as a high-resolution local PNG image file
      const fileUri = await viewShotRef.current.capture();
      
      if (!fileUri) {
        throw new Error('Could not render shareable card.');
      }

      // Trigger the native OS share sheet with the captured PNG
      await shareFile(fileUri, `Discover ${title}`);
      return true;
    } catch (error) {
      console.error('Error during card capture/share:', error);
      throw error;
    }
  }

  /**
   * Copies character or progress share text to clipboard.
   * 
   * @param customText Custom copy to share. Defaults to standard Nirvaha app introduction.
   */
  static async copyShareText(customText?: string): Promise<boolean> {
    const textToCopy = customText 
      ? `${customText}\n\nDiscover more on Nirvaha:\n${APP_SHARE_LINK}`
      : DEFAULT_SHARE_TEXT;
      
    return await copyTextToClipboard(textToCopy);
  }
}
