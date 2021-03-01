import React from 'react';
import {connect} from 'react-redux';
import {View, Platform, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import styleConst from '../style-const';
import RNPickerSelect from 'react-native-picker-select';
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
    paddingRight: 0, // to ensure the text is never behind the icon
  },
  headlessAndroidContainer: {
    color: styleConst.color.white,
    opacity: 1,
  },
  iconContainer: {
    top: 10,
    right: 5,
  },
  modalViewTop: {
    width: 30,
  },
  viewContainer: {
    width: 40,
  },
  inputAndroidContainer: {
    width: 20,
  },
});

const LangSwitcher = (props) => {
  const _onValueChange = (value) => {
    if (value !== 'ru' && value !== 'ua') {
      value = 'ru';
    }
    props.actionSetGlobalLanguage(value);
    strings.setLanguage(value);
  };

  const _onDonePress = () => {};

  const _onClose = (value) => {
    console.log('_onClose', value);
  };

  return (
    <View
      style={[
        styles.badgeContainer,
        props.styleContainer ? props.styleContainer : {},
        {backgroundColor: props.bgColor},
      ]}>
      <RNPickerSelect
        key={'rnpickerLang'}
        doneText={strings.Picker.choose}
        onDonePress={() => _onDonePress()}
        useNativeAndroidPickerStyle={false}
        onValueChange={(value) => _onValueChange(value)}
        onClose={() => _onClose}
        style={{...pickerSelectStyles}}
        textInputProps={{
          padding: 10,
          color: styleConst.color.white,
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
  bgColor: styleConst.color.white,
  name: strings.LangSwitcher.lang,
  placeholder: {},
};

export default connect(null, mapDispatchToProps)(LangSwitcher);
