/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import {View, Text} from 'react-native';
import styleConst from '../../core/style-const';
import {Icon, Button, CheckBox, ActionSheet} from 'native-base';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const styles = {
  scrollView: {},
  scrollViewInner: {
    display: 'flex',
    flexDirection: 'column',
  },
};

export const CarCard = ({data, type, checked}) => {
  const {brand, model, number} = data;
  return (
    <View
      style={[
        styles.scrollViewInner,
        styleConst.shadow.default,
        {
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
      ]}>
      <View>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          selectable={false}
          style={{
            color: styleConst.color.greyText,
            fontSize: 14,
            paddingBottom: 5,
            marginLeft: 5,
          }}>
          {`${brand} ${model}`}
        </Text>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{
            color: styleConst.color.greyText2,
            fontSize: 19,
            marginLeft: 5,
          }}>
          {number}
        </Text>
      </View>
      <Icon
        name="car"
        type="FontAwesome5"
        selectable={false}
        style={{
          fontSize: 54,
          color: '#0061ed',
          marginTop: 10,
          marginLeft: 5,
        }}
      />
      {type === 'check' && (
        <TouchableWithoutFeedback
          containerStyle={{position: 'absolute', bottom: 16, right: 16}}>
          <CheckBox
            checked={checked}
            color="#027aff"
            style={{marginRight: 10}}
          />
        </TouchableWithoutFeedback>
      )}
      {/* <Image style={{width: '100%'}} source={require('./Bitmap.png')} /> */}
    </View>
  );
};
