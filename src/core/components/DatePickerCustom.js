import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Button} from 'native-base';
import {format} from '../../utils/date';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalView from './ModalView';
import {strings} from '../lang/const';

export const DatePickerCustom = React.forwardRef((props, ref) => {
  const defaultDate = new Date();
  const dateHuman = props.value ? format(props.value, 'DD MMMM YYYY') : null;

  const DatePicker = show => {
    switch (Platform.OS) {
      case 'ios':
        const majorVersionIOS = parseInt(Platform.Version, 10);
        if (majorVersionIOS < 14) {
          return (
            <ModalView
              isModalVisible={show}
              animationIn="zoomIn"
              animationOut="zoomOut"
              onHide={props.onHideModal}
              swipeDirection={['up', 'down', 'left', 'right']}
              confirmBtnText={props.confirmBtnText}
              selfClosed={false}>
              <DateTimePicker
                mode={props.mode}
                display="spinner"
                locale="ru-RU"
                {...props}
                value={props.value ? new Date(props.value) : defaultDate}
              />
            </ModalView>
          );
        } else {
          return (
            <ModalView
              isModalVisible={show}
              animationIn="zoomIn"
              animationOut="zoomOut"
              onHide={props.onHideModal}
              swipeDirection={['up', 'down', 'left', 'right']}
              confirmBtnText={props.confirmBtnText}
              selfClosed={false}>
              <DateTimePicker
                mode={props.mode}
                display="inline"
                locale="ru-RU"
                {...props}
                value={props.value ? new Date(props.value) : defaultDate}
              />
            </ModalView>
          );
        }
      case 'android':
        if (!show) {
          return null;
        }
        return (
          <DateTimePicker
            mode={props.mode}
            locale="ru-RU"
            {...props}
            value={props.value ? new Date(props.value) : defaultDate}
          />
        );
    }
  };

  return (
    <View
      style={[
        styles.container,
        props.styleContainer ? props.styleContainer : {},
      ]}>
      {props.label ? (
        <Text
          onPress={props.onPressButton}
          style={[
            styles.label,
            props.styleLabel ? props.styleLabel : {},
            dateHuman && styles.labelActive,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              textDecorationLine:
                props.required && !dateHuman ? 'underline' : 'none',
              textDecorationStyle: 'solid',
            },
          ]}>
          {props.label}
        </Text>
      ) : null}
      <Button
        variant="unstyled"
        onPress={props.onPressButton}
        ref={ref}
        style={styles.button}
        _text={[styles.text, dateHuman && styles.textSelected]}>
        {dateHuman
          ? dateHuman
          : props.placeholder
          ? props.placeholder
          : strings.DatePickerCustom.chooseDate}
      </Button>
      {DatePicker(props.isActive)}
    </View>
  );
});

DatePickerCustom.propTypes = {
  mode: PropTypes.oneOf(['date', 'time', 'datetime', 'countdown']),
  styleContainer: PropTypes.object,
  confirmBtnText: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isActive: PropTypes.bool,
  onChange: PropTypes.func,
  onPressButton: PropTypes.func.isRequired,
  onHideModal: PropTypes.func.isRequired,
};

DatePickerCustom.defaultProps = {
  mode: 'date',
  confirmBtnText: strings.DatePickerCustom.choose,
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  label: {
    position: 'absolute',
    left: 0,
    paddingTop: 5,
    paddingLeft: 15,
    fontSize: 15,
    lineHeight: 18,
    color: '#bababa',
    backgroundColor: 'white',
    zIndex: 10,
    width: '100%',
  },
  labelActive: {
    top: 0,
    fontSize: 12,
    color: '#808080',
    paddingBottom: 3,
    paddingTop: 0,
  },
  text: {
    paddingTop: 0,
  },
  textSelected: {
    fontSize: 16,
    color: '#222b45',
  },
  button: {
    width: '100%',
    paddingTop: 0,
    paddingBottom: 0,
    height: 40,
    justifyContent: 'flex-start',
  },
});
