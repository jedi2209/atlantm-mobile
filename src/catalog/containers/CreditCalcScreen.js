import React, {useEffect, useState, useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Platform,
  Dimensions,
  Alert,
  ImageBackground,
} from 'react-native';
import {
  Icon,
  Button,
  Fab,
  View,
  Stack,
  Heading,
  VStack,
  HStack,
  ScrollView,
  Pressable,
  AspectRatio,
  Image,
  FlatList,
  Box,
} from 'native-base';

import {CompareSlider} from 'react-native-compare-slider';
import LogoLoader from '../../core/components/LogoLoader';

import Imager from '../../core/components/Imager';

import {get} from 'lodash';
import {connect} from 'react-redux';

import {actionFetchCarCreditPrograms} from '../actions';
import styleConst from '../../core/style-const';
import Badge from '../../core/components/Badge';
import TransitionView from '../../core/components/TransitionView';
import {BadgeRibbon, BadgeCorner} from '../../core/components/BadgeRibbon';

const mapStateToProps = ({dealer}) => {
  return {
    region: dealer.region,
  };
};

const mapDispatchToProps = {
  actionFetchCarCreditPrograms,
};

const {width: screenWidth} = Dimensions.get('window');

const currencyColors = {
  1: styleConst.color.green,
  2: styleConst.color.red,
  3: styleConst.color.blue2,
  4: styleConst.color.greyBlue,
};

const currencySymbols = {
  1: '₽',
  2: '$',
  3: '€',
  4: '₽',
};

const creditCardItem = ({item, index, separators, creditPrograms}) => {
  const partner = creditPrograms.partners[Number(item?.owner?.id)];
  // console.info('item', item);
  return (
    <TransitionView
      animation={styleConst.animation.zoomIn}
      duration={250}
      index={index}>
      <Box>
        <Box
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          backgroundColor={styleConst.color.white}
          w={'98%'}
          p={2}
          minH={150}
          mx={'1%'}>
          <BadgeCorner
            text={[get(item, 'currency.name')].join(' ')}
            style={{
              backgroundColor: currencyColors[get(item, 'currency.id')],
              fontSize: 18,
              padding: 3,
            }}
          />
          {get(partner, 'logo') ? (
            <Box mb={2} w={'50%'}>
              <Imager
                source={{uri: partner?.logo}}
                resizeMode="contain"
                style={{height: 40}}
                alt={partner?.name}
              />
            </Box>
          ) : null}
          <Stack space={1}>
            {/* <Heading size="sm" fontFamily={styleConst.font.light} w={'90%'}>
              {item.name}
            </Heading> */}
            <HStack>
              <Badge
                id={item.id + 'badgeType' + get(item, 'type.id')}
                index={0}
                name={get(item, 'type.name')}
                bgColor={
                  get(item, 'type.id') === 1
                    ? styleConst.color.blue
                    : styleConst.color.red
                }
                textColor={styleConst.color.bg}
              />
              {!get(item, 'kasko.required') ? (
                <Badge
                  id={item.id + 'badgeKasko'}
                  index={2}
                  name={'Без КАСКО'}
                  bgColor={styleConst.color.purple}
                  textColor={styleConst.color.white}
                />
              ) : null}
              {get(item, 'collateralType.name') ? (
                <Badge
                  id={item.id + 'badgeCollateral' + item.collateralType.id}
                  index={3}
                  name={get(item, 'collateralType.name')}
                  bgColor={styleConst.color.darkBg}
                  textColor={styleConst.color.white}
                />
              ) : null}
              {get(item, 'paymentSchedule.id') ? (
                <Badge
                  id={item.id + 'badgeSchedule' + item.paymentSchedule.id}
                  index={1}
                  name={item.paymentSchedule.name}
                  bgColor={
                    item.paymentSchedule.id === 1
                      ? styleConst.color.orange
                      : styleConst.color.green
                  }
                  textColor={styleConst.color.black}
                />
              ) : null}
            </HStack>
            <VStack space={1} mt={3}>
              <Text fontWeight="400">
                Срок:{' '}
                {get(item, 'period.light')
                  ? get(item, 'period.light') + ' мес. / '
                  : null}
                {get(item, 'period.max') + ' мес.'}
              </Text>
              {get(item, 'earlyRepaymentType.name') ? (
                <Text fontWeight="400">
                  Досрочное погашение: {get(item, 'earlyRepaymentType.name')}
                </Text>
              ) : null}
            </VStack>
          </Stack>
        </Box>
      </Box>
    </TransitionView>
  );
};

const CreditCalcScreen = ({
  navigation,
  actionFetchCarCreditPrograms,
  route,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [creditPrograms, setCreditPrograms] = useState({
    data: [],
    partners: {},
  });

  const carData = get(route, 'params.carData');
  const carID = get(route, 'params.carID');

  useEffect(() => {
    actionFetchCarCreditPrograms(carID).then(res => {
      if (get(res, 'type')) {
        switch (res.type) {
          case 'CAR_CREDIT_PROGRAMS__SUCCESS':
            console.info('res.payload', res.payload);
            setCreditPrograms(res.payload);
            break;
          default:
            break;
        }
        setLoading(false);
      }
    });
    return () => {
      setCreditPrograms({data: [], partners: {}});
    };
  }, [actionFetchCarCreditPrograms, carID]);

  if (isLoading || !get(creditPrograms, 'data.length')) {
    return <LogoLoader />;
  }

  return (
    <FlatList
      ItemSeparatorComponent={
        Platform.OS !== 'android' &&
        (({highlighted}) => (
          <View
            style={[
              {
                height: 3,
              },
              highlighted && {marginLeft: 0},
            ]}
          />
        ))
      }
      // numColumns={2}
      renderItem={({item, index, separators}) =>
        creditCardItem({item, index, separators, creditPrograms})
      }
      ListHeaderComponent={<View h={70} />}
      ListFooterComponent={<View h={50} />}
      data={get(creditPrograms, 'data', [])}
    />
  );

  return (
    <View
      style={{
        width: screenWidth - 100,
        marginBottom: 50,
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      <CompareSlider
        // value={20}
        before={
          <Imager
            source={{
              uri: 'https://atlantm.by/_next/static/media/blue.ccca7291.png',
            }}
            style={{width: screenWidth - 50, height: 190}}
          />
        }
        after={
          <Imager
            source={{
              uri: 'https://atlantm.by/_next/static/media/grey.be92e9ca.png',
            }}
            style={{width: screenWidth - 50, height: 190}}
          />
        }
        // showSeparationLine={false}
        containerSize={{width: screenWidth - 30, height: 210}}
      />
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditCalcScreen);
