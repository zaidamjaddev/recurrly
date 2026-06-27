const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
// 1. Get the baseline Expo Metro configuration
const config = getDefaultConfig(__dirname);

// 2. Append the explicit file extensions so PostHog resolves correctly
config.resolver.sourceExts = [...config.resolver.sourceExts, 'js', 'jsx', 'json', 'ts', 'tsx'];

// 3. Wrap everything using NativeWind's configuration handler pointing to your global CSS
module.exports = withNativeWind(config, { input: "./global.css" });