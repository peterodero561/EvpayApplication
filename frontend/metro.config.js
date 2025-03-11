const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  //extra
  config.resolver.assetExts = [...config.resolver.assetExts, "jpg", "jpeg", "png", "svg"];
  return config;
})();