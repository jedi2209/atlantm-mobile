// const OriginalResolver = require('metro-resolver');
// const path = require('path');

// const blacklistedModules = ['https', 'http', 'zlib', 'ansi-styles'];

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    assetPlugins: ['react-native-svg-asset-plugin'],
  },
};
