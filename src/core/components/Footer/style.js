import { StyleSheet } from 'react-native';

import styleConst from '../../style-const';
import isIPhoneX from '@utils/is_iphone_x';

export default StyleSheet.create({
    footer: {
        height: isIPhoneX() ? styleConst.ui.footerHeightIphone : styleConst.ui.footerHeightAndroid,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: styleConst.ui.footerHeight,
        backgroundColor: '#fff',
    },
});
