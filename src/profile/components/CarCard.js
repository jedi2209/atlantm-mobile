/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import {View, Text} from 'react-native';
import styleConst from '../../core/style-const';
import {Icon, CheckBox, StyleProvider} from 'native-base';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const styles = {
  scrollView: {},
  scrollViewInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  containerView: {
    backgroundColor: '#fafafa',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    width: 150,
    justifyContent: 'space-between',
    paddingTop: 10,
    marginBottom: 15,
    marginTop: 15,
  },
  textBrandModel: {
    color: styleConst.color.greyText,
    fontSize: 14,
    paddingBottom: 5,
    marginLeft: 5,
  },
  textNumber: {
    color: styleConst.color.greyText2,
    fontSize: 19,
    marginLeft: 5,
  },
  carIcon: {
    fontSize: 54,
    color: '#0061ed',
    marginTop: 10,
    marginLeft: 5,
  },
  checkboxContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 10,
  },
};

export const CarCard = ({data, type, checked, onPress, disabled}) => {
  const {brand, model, number, owner} = data;
  return (
    <View
      style={[
        styles.scrollViewInner,
        styleConst.shadow.default,
        styles.containerView,
      ]}>
      <View>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          selectable={false}
          style={styles.textBrandModel}>
          {`${brand} ${model}`}
        </Text>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          selectable={false}
          style={styles.textNumber}>
          {number && owner ? number : ' '}
        </Text>
      </View>
      <Icon
        name="car"
        type="FontAwesome5"
        selectable={false}
        style={styles.carIcon}
      />
      {type === 'check' && !disabled && (
        <TouchableWithoutFeedback containerStyle={styles.checkboxContainer}>
          <View>
            <CheckBox
              onPress={() => {
                if (onPress) {
                  return onPress();
                } else {
                  return null;
                }
              }}
              checked={checked}
              color="#027aff"
              style={{marginRight: 10}}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
      {/* <Image style={{width: '100%'}} source={require('./Bitmap.png')} /> */}
    </View>
  );
};
