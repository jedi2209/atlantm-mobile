import React from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView, Text, RefreshControl, StyleSheet} from 'react-native';

import styleConst from '../style-const';
import {verticalScale} from '../../utils/scale';

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  text: {
    fontSize: 16,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    alignSelf: 'center',
    marginTop: verticalScale(30),
  },
});

const RefreshSpinner = (props) => {
  const {isRequest, onRefresh, containerStyle, text} = props;
  return (
    // <SafeAreaView style={[styles.spinnerContainer, containerStyle]}>
      <RefreshControl
        tintColor={styleConst.color.blue}
        progressBackgroundColor={styleConst.color.green}
        color={styleConst.color.blue}
        refreshing={isRequest}
        onRefresh={onRefresh}
        style={styles.spinner}
        title={text}
      />
    //   {text ? <Text style={styles.text}>{text}</Text> : null}
    // </SafeAreaView>
  );
};

export default RefreshSpinner;
