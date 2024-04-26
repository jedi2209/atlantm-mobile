import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  plateContainer: {
    marginRight: 10,
    paddingLeft: 10,
    width: 160,
    height: 85,
    borderRadius: 9,
  },
  plateDot: {
    borderRadius: 7.5,
    marginTop: 7,
    width: 10,
    height: 10,
  },
  plateTitle: {
    color: styleConst.color.white,
    fontSize: 14,
    fontWeight: '600',
  },
  plateSubTitle: {
    color: styleConst.color.white,
    fontSize: 13,
  },
});

const types = {
  default: '#15CBB6',
  danger: '#EB0A1E',
  primary: '#134D7C',
  // red: '#EB1E4E',
  red: styleConst.color.red,
  orange: styleConst.color.orange,
  green: '#43d551',
  blue: '#0179ff',
  orange2: '#fe7c1d',
};

const status = {
  // enabled: '#06D6A0',
  enabled: '#43a451',
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
            style={[styles.plateTitle, props.titleStyle]}>
            {props.title}
          </Text>
          {typeof props.subtitle === 'object' ? (
            props.subtitle.map((el, num) => {
              return (
                <Text
                  key={'plateTextSubtitle' + num}
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

Plate.defaultProps = {
  type: 'default',
  status: 'enabled',
};

export default Plate;
