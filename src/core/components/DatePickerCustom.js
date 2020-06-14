import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';

import DatePicker from 'react-native-datepicker';

export const DatePickerCustom = React.forwardRef((props, ref) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || Boolean(props.value);


  return (
    <View style={styles.container}>
      {props.label ? (
        <Text style={[styles.label, styles.labelActive]}>{props.label}</Text>
      ) : null}
      <DatePicker
        showIcon={false}
        mode="date"
        locale="ru-RU"
        placeholder="Выберите дату"
        format="DD MMMM YYYY"
        confirmBtnText="Выбрать"
        cancelBtnText="Отмена"
        value={props.value || ''}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        ref={ref}
        {...props}
      />
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
    top: 0,
    fontSize: 14,
    color: '#808080',
  },
});
