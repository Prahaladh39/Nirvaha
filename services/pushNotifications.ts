import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

// Configure foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function initializePushNotifications(router: any) {
  /**
   * Check the OS notification permission state and request only when appropriate.
   *
   * Uses expo-notifications for permission management as recommended by
   * @react-native-firebase/messaging v25 (messaging().requestPermission() is
   * deprecated and is a no-op on Android).
   *
   * Flow:
   *  - GRANTED → skip prompt, proceed to configureFcm()
   *  - UNDETERMINED → request permission once
   *  - DENIED → do not request again, continue normally
   *
   * For Android < 13 (API < 33), notifications are enabled by default so
   * we skip the runtime permission prompt entirely.
   */
  const checkAndRequestNotificationPermission = async () => {
    try {
      // Android < 13 (API 33): notifications are enabled by default,
      // no runtime permission exists. Proceed directly.
      if (Platform.OS === 'android' && (Platform.Version as number) < 33) {
        await configureFcm();
        return;
      }

      // Check the current OS permission state (source of truth).
      const { status, canAskAgain } = await Notifications.getPermissionsAsync();

      if (status === 'granted') {
        // Already granted — never show a prompt again.
        await configureFcm();
        return;
      }

      if (status === 'undetermined' || (status === 'denied' && canAskAgain)) {
        // Permission has not been determined yet, or was soft-denied but
        // the OS still allows us to ask. Request once.
        const { status: newStatus } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });

        if (newStatus === 'granted') {
          await configureFcm();
        }
        // If denied, continue normally — no retry.
        return;
      }

      // status === 'denied' && !canAskAgain
      // The user has permanently denied notifications.
      // Do not attempt to show any permission dialog.
      // The app continues normally without notifications.
    } catch (error) {
      // Permission or token failures must never block app startup.
      console.warn('Notification permission check failed:', error);
    }
  };

  const configureFcm = async () => {
    try {
      // 1. Create Android Notification Channel matching Admin Console
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('nirvaha_general_broadcast', {
          name: 'General Broadcasts',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // 2. Subscribe to the 'all_users' FCM topic
      await messaging().subscribeToTopic('all_users');
      console.log('Subscribed to "all_users" FCM topic!');

      // 3. Log Device FCM Token for targeted testing
      const token = await messaging().getToken();
      console.log('FCM Registration Token:', token);
    } catch (error) {
      console.error('Error during FCM setup:', error);
    }
  };

  checkAndRequestNotificationPermission();

  const handleDeepLink = (remoteMessage: any) => {
    const data = remoteMessage?.data || remoteMessage;
    const deepLink = data?.deepLink || data?.url;
    const eventId = data?.eventId;
    const bookingId = data?.bookingId;

    let targetRoute = '';

    if (eventId) {
      targetRoute = `/events/${eventId}`;
    } else if (deepLink) {
      console.log('Handling deep link from notification:', deepLink);
      if (deepLink.startsWith('nirvaha://') || deepLink.startsWith('nirvahaapp://')) {
        const routeName = deepLink.replace(/^(nirvaha|nirvahaapp):\/\//, '');
        if (routeName === 'music') {
          targetRoute = '/collection';
        } else if (routeName === 'sleep') {
          targetRoute = '/(tabs)/wellness';
        } else if (routeName === 'ai' || routeName === 'companions') {
          targetRoute = '/chat';
        } else if (routeName === 'events' || routeName === 'events/') {
          targetRoute = '/events';
        } else if (routeName.startsWith('events/')) {
          targetRoute = `/${routeName}`;
        } else {
          targetRoute = `/${routeName}`;
        }
      } else {
        targetRoute = deepLink.startsWith('/') ? deepLink : `/${deepLink}`;
      }
    } else if (bookingId) {
      targetRoute = '/events/my-bookings';
    }
    
    if (targetRoute) {
      console.log('[PushNotifications] Navigating to target route:', targetRoute);
      // Small timeout ensures Expo Router navigation container has mounted
      setTimeout(() => {
        try {
          router.push(targetRoute as any);
        } catch (e) {
          console.error('Failed to route deep link:', targetRoute, e);
        }
      }, 300);
    }
  };

  // 4. Handle Foreground Messages (App is active)
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    console.log('FCM message received in foreground:', remoteMessage);
    if (remoteMessage.notification) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification.title || 'Nirvaha',
          body: remoteMessage.notification.body || '',
          data: remoteMessage.data || {},
        },
        trigger: null,
      });
    }
  });

  // 5. Handle Click event when app is in the background
  const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('App opened from background by notification click:', remoteMessage);
    handleDeepLink(remoteMessage);
  });

  // 6. Handle Click event when app is fully closed (FCM native)
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from closed state by notification click:', remoteMessage);
        handleDeepLink(remoteMessage);
      }
    });

  // 7. Handle click on Expo foreground notification banner
  const notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('[PushNotifications] User tapped notification response:', response);
    const data = response?.notification?.request?.content?.data;
    if (data) {
      handleDeepLink({ data });
    }
  });

  // 8. Handle cold-start from Expo notification response
  Notifications.getLastNotificationResponseAsync().then(response => {
    if (response) {
      console.log('[PushNotifications] Opened by Expo Notification cold-start:', response);
      const data = response?.notification?.request?.content?.data;
      if (data) {
        handleDeepLink({ data });
      }
    }
  });

  return () => {
    unsubscribeForeground();
    unsubscribeNotificationOpened();
    notificationResponseSubscription.remove();
  };
}
