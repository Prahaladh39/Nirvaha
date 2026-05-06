const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for .cjs files which Firebase heavily relies on in newer versions
config.resolver.sourceExts.push('cjs');
config.resolver.assetExts.push('mpeg');

module.exports = config;
