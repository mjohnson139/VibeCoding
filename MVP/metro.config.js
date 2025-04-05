const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add markdown files to the list of asset extensions
defaultConfig.resolver.assetExts.push('md');

module.exports = defaultConfig;