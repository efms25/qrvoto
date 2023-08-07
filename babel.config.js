module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      }
    ],
    'babel-plugin-inline-import', {
      "extensions": ['.svg']
    }
  ],
};
