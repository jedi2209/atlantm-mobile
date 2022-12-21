import React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {HStack, Box, Text, Pressable, VStack} from 'native-base';
import {useNavigation} from '@react-navigation/native';

// component
import BrandLogo from '../components/BrandLogo';

// helpers
import {get} from 'lodash';
import styleConst from '../../core/style-const';
// import stylesList from '../../core/components/Lists/style';
import {strings} from '../lang/const';
// import style from '../../core/components/Lists/style';

const stylesDealerItemList = StyleSheet.create({
  wrapper: {
    backgroundColor: styleConst.color.white,
  },
  brandLogo: {
    minWidth: 24,
    height: 20,
    width: 45,
    marginRight: 10,
  },
  dealerCity: {
    fontFamily: styleConst.font.light,
    fontSize: 14,
    color: styleConst.color.blue,
  },
  city: {
    fontFamily: styleConst.font.regular,
    fontSize: 17,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  name: {
    fontSize: 17,
  },
});

const _onPressDealer = props => {
  const {isLocal, goBack, returnScreen, listAll, returnState, navigation} =
    props;

  return navigation.navigate('ChooseDealerScreen', {
    returnScreen,
    returnState,
    goBack,
    isLocal,
    listAll,
  });
};

const DealerItemList = props => {
  const {
    city,
    dealer,
    style,
    isLocal,
    goBack,
    returnScreen,
    listAll,
    returnState,
  } = props;
  const navigation = useNavigation();

  return (
    <Pressable
      rounded="lg"
      px="2"
      py="3"
      shadow={'1'}
      style={[stylesDealerItemList.wrapper, style]}
      onPress={() => {
        return _onPressDealer({props, navigation});
      }}>
      <HStack space={3} justifyContent="space-between" alignItems="center">
        {city && city.name ? (
          <Text
            style={stylesDealerItemList.city}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {city && city.name ? city.name : dealer.city.name}
          </Text>
        ) : null}
        <VStack>
          <Text
            style={stylesDealerItemList.name}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {dealer && dealer.name
              ? dealer.name
              : strings.DealerItemList.chooseDealer}
          </Text>
          {false && dealer && dealer.city ? (
            <Text
              style={stylesDealerItemList.dealerCity}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {dealer.city.name}
            </Text>
          ) : null}
        </VStack>
        {get(dealer, 'brand') ? (
          <HStack>
            {get(dealer, 'brand').map(brand => {
              if (brand.logo) {
                return (
                  <BrandLogo
                    brand={brand.id}
                    width={45}
                    style={stylesDealerItemList.brandLogo}
                    key={'brandLogo' + brand.id}
                  />
                );
              }
            })}
          </HStack>
        ) : null}
      </HStack>
    </Pressable>
  );
};

DealerItemList.propTypes = {
  city: PropTypes.shape({
    name: PropTypes.string,
  }),
  brands: PropTypes.array,
  returnScreen: PropTypes.string,
  goBack: PropTypes.bool,
  isLocal: PropTypes.bool,
};

DealerItemList.defaultProps = {
  city: null,
  brands: [],
  returnScreen: null,
  goBack: false,
  isLocal: false,
};

export default DealerItemList;
