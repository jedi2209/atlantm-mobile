import React from 'react';
import {RefreshControl, StyleSheet, SafeAreaView} from 'react-native';

import styleConst from '../style-const';
import {verticalScale} from '../../utils/scale';

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  text: {
    fontSize: 16,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    alignSelf: 'center',
    marginTop: verticalScale(30),
  },
});

const RefreshSpinner = props => {
  const {
    text = 'обновление экрана...',
    refreshing = false,
    enabled = true,
    onRefresh = () => {},
    isRequest,
    containerStyle,
  } = props;
  return (
    <RefreshControl
      tintColor={styleConst.color.blueNew}
      color={styleConst.color.white}
      refreshing={isRequest}
      onRefresh={onRefresh}
      enabled={enabled}
      style={styleConst.spinner}
      title={text}
    />
  );
};

export default RefreshSpinner;
