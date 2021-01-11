import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {View, Platform, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import styleConst from '../style-const';
import RNPickerSelect from 'react-native-picker-select';
import RNRestart from 'react-native-restart';
import {actionSetGlobalLanguage} from '../../core/lang/actions';
import strings from '../../core/lang/const';

const mapDispatchToProps = (dispatch) => {
  return {
    actionSetGlobalLanguage: (value) => {
      return dispatch(actionSetGlobalLanguage(value));
    },
  };
};

const styles = StyleSheet.create({
  badgeContainer: {
    borderRadius: 5,
    width: '90%',
    display: 'flex',
  },
  badgeName: {
    fontFamily: styleConst.font.regular,
    fontSize: 12,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 6,
    paddingTop: 24,
    paddingLeft: 1,
    color: '#222b45',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 6,
    paddingTop: 25,
    color: '#222b45',
    paddingRight: 0, // to ensure the text is never behind the icon
  },
});

const LangSwitcher = (props) => {
  const _onValueChange = (value) => {
    props.actionSetGlobalLanguage(value);
    if (Platform.OS === 'ios') {
      strings.setLanguage(value);
    } else {
      setTimeout(() => {
        RNRestart.Restart();
      }, 500);
    }
  };

  const _onDonePress = (val) => {
    strings.setLanguage('ua');
    if (Platform.OS === 'ios') {
      console.log('onDonePress', val);
    }
  };

  const _onClose = (value) => {
    console.log('_onClose', value);
  };

  return (
    <View style={[styles.badgeContainer, {backgroundColor: props.bgColor}]}>
      <RNPickerSelect
        key={'rnpickerLang'}
        doneText={strings.Picker.choose}
        onDonePress={() => _onDonePress}
        onValueChange={(value) => _onValueChange(value)}
        onClose={() => _onClose}
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: 10,
            right: 5,
          },
        }}
        {...props}
      />
    </View>
  );
};

LangSwitcher.propTypes = {
  name: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
};

LangSwitcher.defaultProps = {
  textColor: 'black',
  bgColor: styleConst.color.bg,
  name: strings.LangSwitcher.lang,
  placeholder: {
    label: strings.LangSwitcher.chooseLang,
    value: '',
    color: styleConst.color.bg,
  },
};

export default connect(null, mapDispatchToProps)(LangSwitcher);
