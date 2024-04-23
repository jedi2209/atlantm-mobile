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
  green: styleConst.color.green3,
  blue: styleConst.color.blue2,
  orange2: styleConst.color.orange2,
};

const status = {
  enabled: '#43a451',
  disabled: '#d62828',
};

const Plate = ({
  type = 'default',
  status = 'enabled',
  onPress = () => {},
  titleStyle = {},
  title = '',
  subtitle = '',
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.plateContainer,
          {
            backgroundColor: types[type],
          },
        ]}>
        <View
          style={[
            styles.plateDot,
            styleConst.shadow.light,
            {
              backgroundColor: statusColors[status],
            },
          ]}
        />
        <View style={{marginTop: 8}}>
          <Text
            selectable={false}
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[styles.plateTitle, titleStyle]}>
            {title}
          </Text>
          {typeof subtitle === 'object' ? (
            subtitle.map((el, num) => {
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
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Plate;
