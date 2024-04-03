import React from 'react';
import {View, Text, Pressable, StyleSheet, Platform} from 'react-native';
import {Button} from 'native-base';
import {format} from '../../utils/date';
import DatePicker from 'react-native-date-picker';
import ModalView from './ModalView';
import {strings} from '../lang/const';

const DatePickerWrapper = props => {
  const {
    isActive,
    onDateChange,
    onHideModal,
    confirmBtnText,
    label,
    mode,
    value,
  } = props;
  const defaultDate = new Date();
  return (
    <DatePicker
      modal
      open={isActive}
      title={label}
      mode={mode}
      timeZoneOffsetInMinutes={180}
      date={value ? new Date(value) : defaultDate}
      locale="ru-RU"
      confirmText={confirmBtnText}
      cancelText={strings.Base.cancel}
      onConfirm={date => {
        onDateChange(date);
        onHideModal();
      }}
      onCancel={onHideModal}
      {...props}
    />
  );
};

export const DatePickerCustom = React.forwardRef((props, ref) => {
  const dateHuman = props.value ? format(props.value, 'DD MMMM YYYY') : null;

  return (
    <Pressable
      onPress={props.onPressButton}
      style={[
        styles.container,
        props.styleContainer ? props.styleContainer : {},
      ]}>
      {props.label ? (
        <Text
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
      {DatePickerWrapper(props)}
    </Pressable>
  );
});

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
    backgroundColor: '#ffffff',
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
