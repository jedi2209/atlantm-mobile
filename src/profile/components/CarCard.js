/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import {connect} from 'react-redux';
import BrandLogo from '../../core/components/BrandLogo';
import styleConst from '../../core/style-const';
import {Icon, Checkbox, View, Text, Box} from 'native-base';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {get} from 'lodash';

const styles = {
  textBrand: {
    color: styleConst.color.greyText4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textBrandModel: {
    color: styleConst.color.greyText3,
    fontSize: 14,
  },
  textNumber: {
    color: styleConst.color.greyText2,
    fontSize: 19,
    marginLeft: 5,
  },
  checkboxContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 10,
  },
};

const mapStateToProps = ({dealer}) => {
  return {
    brands: dealer.listBrands,
  };
};

const CarCard = ({data, type, checked, onPress, disabled, brands}) => {
  const {brand, model, number, owner, vin} = data;
  const carColor = get(data, 'carInfo.color.picker.codes.hex', false);
  let undefinedCar = false;
  if (vin === 'undefinedCar') {
    undefinedCar = true;
  }
  let modelName = model;
  if (typeof model === 'object') {
    modelName = model?.name;
  }
  const brandID = get(data, 'carInfo.brand.id');
  return (
    <Box
      bg={{
        linearGradient: {
          colors: ['coolGray.200', 'coolGray.300'],
          start: [0, 0],
          end: [1, 1],
        },
      }}
      marginX={'0.5'}
      marginY={1}
      paddingTop={1}
      rounded={'md'}
      justifyContent={'space-between'}
      width={48}
      display={'flex'}
      flexDirection={'column'}>
      <View>
        {brandID ? (
          <View position={'absolute'} h={12} w={'1/2'} px={4} pb={1} alignSelf={'flex-end'} justifyContent={'center'} alignContent={'center'}>
            <BrandLogo
              brand={brandID}
              key={'brandLogo' + brandID}
            />
          </View>
        ) : null}
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          selectable={false}
          pb={1}
          ml={2}
          style={styles.textBrand}>
          {brand ? brand : '--'}
        </Text>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          selectable={false}
          ml={2}
          pb={2}
          style={styles.textBrandModel}>
          {modelName ? modelName : '--'}
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
        name={'car'}
        size={16}
        as={undefinedCar ? Fontisto : FontAwesome5}
        color={carColor ? carColor : styleConst.color.blue}
        mt={4}
        ml={2}
        mb={4}
      />
      {type === 'check' && !disabled && (
        <TouchableWithoutFeedback containerStyle={styles.checkboxContainer}>
          <View>
            <Checkbox
              aria-label="Car selected"
              onChange={() => {
                if (onPress) {
                  return onPress();
                } else {
                  return null;
                }
              }}
              isChecked={checked}
              defaultIsChecked={checked}
              color="#027aff"
              style={{marginRight: 2, marginBottom: 4}}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </Box>
  );
};

export default connect(mapStateToProps, {})(CarCard);
