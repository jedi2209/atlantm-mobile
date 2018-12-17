import { Dimensions, Platform } from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default function () {
  return Platform.OS === 'ios' && (deviceHeight === 812 || deviceWidth === 812);
}
