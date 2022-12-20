import React from 'react';
import PropTypes from 'prop-types';
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
  const {isRequest, onRefresh, containerStyle, text} = props;
  return (
    <RefreshControl
      tintColor={styleConst.color.lightBlue}
      progressBackgroundColor={styleConst.color.green}
      color={styleConst.color.white}
      refreshing={isRequest}
      onRefresh={onRefresh}
      style={styleConst.spinner}
      title={text}
    />
  );
};

export default RefreshSpinner;
