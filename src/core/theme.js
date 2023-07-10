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
    // Redefining only one shade, rest of the color will remain same.
    amber: {
      400: '#d97706',
    },
  },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: 'light',
  },
  components: {},
});
