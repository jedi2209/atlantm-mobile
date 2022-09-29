import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  plateContainer: {
    marginRight: 10,
    padding: 10,
    width: 150,
    height: 98,
    borderRadius: 5,
  },
  plateDot: {
    borderRadius: 7.5,
    width: 15,
    height: 15,
  },
  plateTitle: {
    color: styleConst.color.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  plateSubTitle: {
    color: styleConst.color.white,
    fontSize: 12,
  },
});

const types = {
  default: '#15CBB6',
  danger: '#EB0A1E',
  primary: '#134D7C',
  // red: '#EB1E4E',
  red: styleConst.color.red,
  orange: styleConst.color.orange,
};

const status = {
  enabled: '#06D6A0',
  disabled: '#d62828',
};

const Plate = props => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View
        style={[
          styles.plateContainer,
          {
            backgroundColor: types[props.type],
          },
        ]}>
        <View
          style={[
            styles.plateDot,
            styleConst.shadow.light,
            {
              backgroundColor: status[props.status],
            },
          ]}
        />
        <View style={{marginTop: 8}}>
          <Text
            selectable={false}
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.plateTitle}>
            {props.title}
          </Text>
          {typeof props.subtitle === 'object' ? (
            props.subtitle.map(el => {
              return (
                <Text
                  selectable={false}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.plateSubTitle}>
                  {el}
                </Text>
              );
            })
          ) : (
            <Text
              selectable={false}
              ellipsizeMode="tail"
              numberOfLines={3}
              style={styles.plateSubTitle}>
              {props.subtitle}
            </Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

Plate.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onPress: PropTypes.func,
  type: PropTypes.oneOf(['default', 'danger', 'primary', 'red', 'orange']),
  active: PropTypes.oneOf(['enabled', 'disabled']),
};

Plate.defaultProps = {
  type: 'default',
  status: 'enabled',
};

export default Plate;
