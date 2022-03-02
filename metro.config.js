const OriginalResolver = require("metro-resolver");
const path = require("path");

const blacklistedModules = ["https", "http", "zlib", "ansi-styles"];

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    minifierConfig: {
      keep_classnames: true, // Preserve class names
      keep_fnames: true, // Preserve function names
      mangle: {
        keep_classnames: true, // Preserve class names
        keep_fnames: true, // Preserve function names
      },
    },
    assetPlugins: ['react-native-svg-asset-plugin'],
  },
  resolver: {
    useWatchman: true,
    resolveRequest: (context, realModuleName, platform, moduleName) => {
      if (blacklistedModules.includes(moduleName)) {
        return {
          filePath: path.resolve(__dirname + "/src/shim-module.js"),
          type: "sourceFile"
        };
      } else {
        return OriginalResolver.resolve(
          { ...context, resolveRequest: undefined },
          moduleName,
          platform
        );
      }
    }
  },
};