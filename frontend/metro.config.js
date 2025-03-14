const { getDefaultConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, "cjs"],
  },
};