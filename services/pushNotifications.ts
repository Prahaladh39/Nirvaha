import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

// Configure foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function initializePushNotifications(router: any) {
  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Push notification permission granted.');
        await configureFcm();
      } else {
        console.log('Push notification permission denied.');
      }
    } catch (error) {
      console.error('Error requesting push permission:', error);
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

  requestUserPermission();

  const handleDeepLink = (remoteMessage: any) => {
    const deepLink = remoteMessage?.data?.deepLink;
    if (deepLink) {
      console.log('Handling deep link from notification:', deepLink);
      let targetRoute = '';
      if (deepLink.startsWith('nirvaha://')) {
        const routeName = deepLink.replace('nirvaha://', '');
        if (routeName === 'music') {
          targetRoute = '/collection';
        } else if (routeName === 'sleep') {
          targetRoute = '/(tabs)/wellness';
        } else if (routeName === 'ai') {
          targetRoute = '/chat';
        } else if (routeName === 'companions') {
          targetRoute = '/chat';
        } else {
          targetRoute = `/${routeName}`;
        }
      } else {
        targetRoute = deepLink;
      }
      
      if (targetRoute) {
        try {
          router.push(targetRoute as any);
        } catch (e) {
          console.error('Failed to route deep link:', targetRoute, e);
        }
      }
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

  // 6. Handle Click event when app is fully closed
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from closed state by notification click:', remoteMessage);
        handleDeepLink(remoteMessage);
      }
    });

  return () => {
    unsubscribeForeground();
    unsubscribeNotificationOpened();
  };
}
