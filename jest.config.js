const {resolve} = require('path');

module.exports = {
  preset: 'react-native',
  transform: {
    '\\.(js|ts|tsx)$': require.resolve('react-native/jest/preprocessor.js'),
  },
  globals: {
    window: {},
  },
  verbose: true,
  testRegex: '(/src/__tests__/.*|\\.(-test|spec|e2e))\\.(ts|tsx|js)$',
  setupFiles: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  testEnvironment: 'node',
  transformIgnorePatterns: [
    resolve(__dirname, '../../packages'),
    "node_modules/(?!(react-native"
    + "|native-base"
    + "|native-base-shoutem-theme"
    + "|@shoutem/theme"
    + "|@shoutem/animation"
    + "|@shoutem/ui"
    + "|tcomb-form-native"
    + "|react-navigation-tabs"
    + "|react-native-splash-screen"
    + "|react-native-screens"
    + "|react-native-reanimated"
    + ")/)",
  ],
};
