import {extendTheme} from 'native-base';
import styleConst from './style-const';

export const theme = extendTheme({
  colors: {
    // Add new color
    primary: {
      50: '#E3F2F9',
      100: '#C5E4F3',
      200: '#A2D4EC',
      300: '#7AC1E4',
      400: '#47A9DA',
      500: '#0088CC',
      600: styleConst.color.systemBlue,
      700: '#006BA1',
      800: '#005885',
      900: '#003F5E',
    },
    blue: {
      50: styleConst.color.systemBlue,
      100: styleConst.color.systemBlue,
      200: styleConst.color.systemBlue,
      300: styleConst.color.systemBlue,
      400: styleConst.color.systemBlue,
      500: styleConst.color.systemBlue,
      600: styleConst.color.systemBlue,
      700: styleConst.color.systemBlue,
      800: styleConst.color.systemBlue,
      900: styleConst.color.systemBlue,
    },
    white: {
      50: '#f0f0f0',
      100: '#f2f2f2',
      200: '#f2f3f4',
      300: '#e7e7e7',
      400: '#d1d1d1',
      500: '#b6b6b6',
      600: '#ffffff',
      700: '#9b9b9b',
      800: '#d1d1d1',
      900: '#e7e7e7',
    },
    // Redefining only one shade, rest of the color will remain same.
    amber: {
      400: '#d97706',
    },
  },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: 'light',
    // useSystemColorMode: true,
  },
  // components: {},
});
