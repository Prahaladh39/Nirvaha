import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Received FCM message in the background:', remoteMessage);
});

import 'expo-router/entry';
