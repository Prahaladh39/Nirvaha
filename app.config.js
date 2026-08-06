const withNotificationColorFix = require('./plugins/withNotificationColorFix');

module.exports = {
  expo: {
    name: "NirVaha",
    slug: "nirvaha",
    owner: "akash1803s-team",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "nirvahaapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "org.nirvaha.app"
    },
    android: {
      package: "org.nirvaha.app",
      googleServicesFile: "./google-services.json",
      versionCode: 5,

      permissions: [
        "INTERNET"
      ],

      blockedPermissions: [
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO"
      ],

      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#FFFFFF"
      },

      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#FFFFFF"
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      withNotificationColorFix,
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#082F03",
          "dark": {
            "backgroundColor": "#082F03"
          }
        }
      ],
      "expo-font",
      "expo-audio",
      "expo-video",
      "@react-native-firebase/app",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#2d5a4c"
        }
      ],
      [
        "expo-media-library",
        {
          "granularPermissions": ["audio"]
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      eas: {
        projectId: "fee74e4b-51d9-4c95-a160-c11d63160417"
      },
      "EXPO_PUBLIC_API_BASE_URL": process.env.EXPO_PUBLIC_API_BASE_URL || "",
      "EXPO_PUBLIC_FIREBASE_API_KEY": process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
      "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN": process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      "EXPO_PUBLIC_FIREBASE_PROJECT_ID": process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
      "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET": process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      "EXPO_PUBLIC_FIREBASE_APP_ID": process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
      "EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID": process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
    }
  }
}

