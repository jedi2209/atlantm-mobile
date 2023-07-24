import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {HStack, Text, Pressable, VStack, Icon, View} from 'native-base';
import {useNavigation} from '@react-navigation/native';

// component
import BrandLogo from '../components/BrandLogo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
    height: 28,
    width: 45,
    marginRight: 10,
    alignContent: 'center',
    alignItems: 'center',
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

const _renderBrands = ({logoWidth, dealerBrand}) => {
  return (
    <HStack
      alignItems={'center'}
      justifyContent={dealerBrand.length > 2 ? 'space-between' : 'flex-end'}
      w={logoWidth}>
      {dealerBrand.map(brand => {
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
      {dealerBrand.length <= 2 ? (
        <Icon
          size="sm"
          as={FontAwesome5}
          color={styleConst.color.greyText4}
          name={'angle-right'}
          mr={1}
        />
      ) : null}
    </HStack>
  );
};

const MainWrapper = props => {
  if (!props.readonly) {
    return <Pressable {...props} />;
  } else {
    delete props.onPress;
    return <View {...props} />;
  }
};

const DealerItemList = props => {
  const {city, dealer, style, wrapperProps} = props;
  const navigation = useNavigation();

  const deviceWidth = Dimensions.get('window').width;
  const dealerBrand = get(dealer, 'brand', []);
  let nameWidth = '4/6';
  let logoWidth = '2/6';
  if (deviceWidth <= 480) {
    if (dealerBrand && dealerBrand?.length > 1) {
      nameWidth = '64%';
      logoWidth = '36%';
    } else {
      nameWidth = '3/4';
      logoWidth = '1/4';
    }
  }
  if (deviceWidth <= 390) {
    if (dealerBrand && dealerBrand?.length > 1) {
      nameWidth = '63%';
      logoWidth = '37%';
    }
  }

  return (
    <MainWrapper
      rounded={'lg'}
      px="2"
      py="3"
      readonly={props.readonly}
      shadow={'1'}
      style={[stylesDealerItemList.wrapper, style]}
      onPress={() => {
        return _onPressDealer({...props, navigation});
      }}
      {...wrapperProps}>
      <HStack
        space={3}
        justifyContent="space-between"
        alignItems="center"
        alignContent={'center'}>
        {city && city.name ? (
          <Text
            style={stylesDealerItemList.city}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {city && city.name ? city.name : dealer.city.name}
          </Text>
        ) : null}
        <VStack w={nameWidth}>
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
          {props.showBrands && dealerBrand && dealerBrand?.length > 2 ? (
            <View mt={2}>
              {_renderBrands({
                logoWidth,
                dealerBrand,
              })}
            </View>
          ) : null}
        </VStack>
        {props.showBrands && dealerBrand && dealerBrand?.length <= 2 ? (
          _renderBrands({logoWidth, dealerBrand})
        ) : (
          <Icon
            size="sm"
            as={FontAwesome5}
            color={styleConst.color.greyText4}
            name={'angle-right'}
            mr={1}
          />
        )}
      </HStack>
    </MainWrapper>
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
  readonly: PropTypes.bool,
  showBrands: PropTypes.bool,
};

DealerItemList.defaultProps = {
  city: null,
  brands: [],
  returnScreen: null,
  goBack: false,
  isLocal: false,
  readonly: false,
  showBrands: true,
};

export default DealerItemList;
