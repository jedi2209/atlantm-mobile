module.exports = {
  plugins: [
    'react-native-reanimated/plugin',
    [
      'transform-remove-console',
      {
        exclude: ['error', 'warn'],
      },
    ],
  ],
};
