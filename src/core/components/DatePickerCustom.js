import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Button} from 'native-base';
import {format} from '../../utils/date';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalView from './ModalView';
import strings from '../lang/const';

export const DatePickerCustom = React.forwardRef((props, ref) => {
  const defaultDate = new Date();
  const dateHuman = props.value ? format(props.value, 'DD MMMM YYYY') : null;

  const DatePicker = (show) => {
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
              confirmBtnText={
                props.confirmBtnText || strings.DatePickerCustom.choose
              }
              selfClosed={false}>
              <DateTimePicker
                mode="date"
                display="spinner"
                locale="ru-RU"
                {...props}
                value={props.value ? props.value : defaultDate}
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
              confirmBtnText={
                props.confirmBtnText || strings.DatePickerCustom.choose
              }
              selfClosed={false}>
              <DateTimePicker
                mode="date"
                display="inline"
                locale="ru-RU"
                {...props}
                value={props.value ? props.value : defaultDate}
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
            mode="date"
            locale="ru-RU"
            {...props}
            value={props.value ? props.value : defaultDate}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {props.label ? (
        <Text
          style={[
            styles.label,
            dateHuman && styles.labelActive,
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
        transparent
        onPress={props.onPressButton}
        ref={ref}
        style={{width: '100%'}}>
        <Text
          selectable={false}
          style={[styles.text, dateHuman && styles.textSelected]}>
          {dateHuman
            ? dateHuman
            : props.placeholder
            ? props.placeholder
            : strings.DatePickerCustom.chooseDate}
        </Text>
      </Button>
      {DatePicker(props.isActive)}
    </View>
  );
});

DatePickerCustom.propTypes = {
  onChange: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  label: {
    position: 'absolute',
    left: 0,
    paddingTop: 5,
    fontSize: 16,
    lineHeight: 20,
    color: '#bababa',
    backgroundColor: 'white',
    zIndex: 10,
    width: '100%',
  },
  labelActive: {
    top: 0,
    fontSize: 14,
    color: '#808080',
    paddingBottom: 5,
    paddingTop: 0,
  },
  text: {
    marginLeft: 4,
    paddingTop: 5,
  },
  textSelected: {
    fontSize: 16,
    color: '#222b45',
  },
});
