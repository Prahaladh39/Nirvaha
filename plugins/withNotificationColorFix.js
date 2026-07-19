const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withNotificationColorFix(config) {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    
    if (mainApplication['meta-data']) {
      mainApplication['meta-data'] = mainApplication['meta-data'].map((item) => {
        if (item.$ && item.$['android:name'] === 'com.google.firebase.messaging.default_notification_color') {
          item.$['tools:replace'] = 'android:resource';
        }
        return item;
      });
    }

    if (!config.modResults.manifest.$) {
      config.modResults.manifest.$ = {};
    }
    if (!config.modResults.manifest.$['xmlns:tools']) {
      config.modResults.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }
    
    return config;
  });
};
