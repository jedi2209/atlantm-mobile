import React from 'react';
import {connect} from 'react-redux';
import {View, Platform, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import styleConst from '../style-const';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import {actionSetGlobalLanguage} from '../../core/lang/actions';

const mapDispatchToProps = (dispatch) => {
  return {
    actionSetGlobalLanguage: (value) => {
      return dispatch(actionSetGlobalLanguage(value));
    },
  };
};

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
    marginLeft: 4,
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
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const LangSwitcher = (props, actionSetGlobalLanguage) => {
  return (
    <View style={[styles.badgeContainer, {backgroundColor: props.bgColor}]}>
      {console.log('actionSetGlobalLanguage', actionSetGlobalLanguage)}
      <RNPickerSelect
        key={'rnpickerLang'}
        doneText="Выбрать"
        onDonePress={() => {
          if (props.onChange && Platform.OS === 'ios') {
            // console.log('onDonePress', this.state[name]);
            // props.onChange(this.state[name]);
          }
        }}
        onValueChange={(value) => {
          console.log('actionSetGlobalLanguage value', value);
          actionSetGlobalLanguage(value)
            .then((res) => {
              console.log('res', res);
              if (res.type && res.type === 'CAR_HIDE__SUCCESS') {
                setActivePanel('default');
                setLoading(false);
                Toast.show({
                  text: 'Статус автомобиля изменён',
                  type: 'success',
                  position: 'top',
                });
              }
            })
            .catch((error) => {
              console.log('error', error);
              // Toast.show({
              //   text: error,
              //   type: 'danger',
              //   position: 'top',
              // });
            });
          if (props.onChange && Platform.OS !== 'ios') {
            // console.log('onValueChange', value);
            // props.onChange(value);
          }
        }}
        onClose={() => {
          if (props.onChange && Platform.OS === 'ios') {
            // console.log('onClose', this.state[name]);
            // props.onChange(this.state[name]);
          }
        }}
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
  bgColor: 'red',
  name: 'ЧЧХХЫЫ ЫВ',
};

export default connect(null, mapDispatchToProps)(LangSwitcher);
