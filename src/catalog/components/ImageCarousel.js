import React, {useState, useEffect} from 'react';
import {View, Dimensions, StyleSheet, Platform, Pressable} from 'react-native';
import {Button, HStack, Icon, VStack} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Carousel from '../../core/components/Carousel';
import Imager from '../../core/components/Imager';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';
import {get} from 'lodash';

const {width: screenWidth} = Dimensions.get('window');

const ImageCarousel = ({
  data,
  height = 200,
  resizeMode = 'cover',
  style = {},
  itemScreen = 'NewCarItemScreen',
  firstItem = 0,
  onPress = () => {},
  onPressCustom,
}) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(data);
  }, [data]);

  const renderItem = ({item, index}) => {
    let priority = 'low';
    switch (index) {
      case 0:
      case 1:
        priority = 'high';
        break;
      case 2:
      case 3:
        priority = 'normal';
        break;
    }
    if (item.url && item?.type === 'image') {
      return (
        <Pressable onPress={onPressCustom} style={[styles.item]}>
          <Imager
            key={'Imager-' + item.url}
            resizeMode={resizeMode}
            priority={priority}
            source={{
              uri: item.url,
            }}
            style={[styles.imageContainer, {height}]}
          />
        </Pressable>
      );
    } else {
      switch (get(item, 'name')) {
        case 'newCar':
          return (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button
                onPress={item.onPressWantACar}
                style={[
                  styles.itemOrder,
                  styles.itemOrderWantACar.all,
                  styles.itemOrderWantACar[itemScreen],
                  {height},
                ]}
                _text={styles.iconText}>
                <Icon
                  size={12}
                  as={MaterialCommunityIcons}
                  name="wallet-giftcard"
                  alignSelf="center"
                  color={styleConst.color.white}
                  _dark={{
                    color: styleConst.color.white,
                  }}
                />
                {strings.NewCarItemScreen.wannaCar}
              </Button>
              <Button
                onPress={item.onPressTD}
                style={[styles.itemOrder, styles.itemOrderTestDrive, {height}]}
                _text={styles.iconText}>
                <Icon
                  size={12}
                  as={MaterialCommunityIcons}
                  name="steering"
                  alignSelf="center"
                  color={styleConst.color.white}
                  _dark={{
                    color: styleConst.color.white,
                  }}
                />
                {strings.NewCarItemScreen.testDrive}
              </Button>
            </View>
          );
        case 'usedCar':
          return (
            <HStack justifyContent="space-between">
              {item.onPressCallMe || item.onPressCall ? (
                <VStack>
                  {item.onPressCallMe ? (
                    <Button
                      onPress={item.onPressCallMe}
                      style={[
                        styles.itemOrder,
                        styles.itemOrderTop,
                        styles.itemOrderCallBack,
                        {height: height / 2 - 1},
                      ]}
                      leftIcon={
                        <Icon
                          size={5}
                          as={MaterialCommunityIcons}
                          name="phone-incoming"
                          color={styleConst.color.white}
                          _dark={{
                            color: styleConst.color.white,
                          }}
                        />
                      }
                      _text={styles.iconTextSm}>
                      {strings.ContactsScreen.callOrder}
                    </Button>
                  ) : null}
                  {item.onPressCall ? (
                    <Button
                      onPress={item.onPressCall}
                      style={[
                        styles.itemOrder,
                        styles.itemOrderBottom,
                        styles.itemOrderCall,
                        {height: height / 2 - 1},
                      ]}
                      leftIcon={
                        <Icon
                          size={5}
                          as={MaterialCommunityIcons}
                          name="phone-outgoing"
                          color={styleConst.color.white}
                          _dark={{
                            color: styleConst.color.white,
                          }}
                        />
                      }
                      _text={styles.iconTextSm}>
                      {strings.ContactsScreen.call}
                    </Button>
                  ) : null}
                </VStack>
              ) : null}
              {item.onPressWantACar ? (
                <Button
                  onPress={item.onPressWantACar}
                  style={[
                    styles.itemOrder,
                    styles.itemOrderWantACar[itemScreen],
                    {height},
                  ]}
                  _text={styles.iconText}>
                  <Icon
                    selectable={false}
                    size={12}
                    as={MaterialCommunityIcons}
                    name="wallet-giftcard"
                    alignSelf="center"
                    color={styleConst.color.white}
                    _dark={{
                      color: styleConst.color.white,
                    }}
                  />
                  {strings.NewCarItemScreen.wannaCar}
                </Button>
              ) : null}
            </HStack>
          );
      }
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Carousel
        style={{width: '100%'}}
        height={height}
        width={screenWidth / 1.68}
        onPress={onPressCustom}
        data={entries}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width: screenWidth / 1.7,
    height: 150,
    borderRadius: 5,
    flex: 1,
  },
  itemOrder: {
    width: screenWidth / 1.7 / 2.05,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  itemOrderTop: {
    marginBottom: 1,
  },
  itemOrderBottom: {
    marginTop: 1,
  },
  itemOrderCall: {
    backgroundColor: styleConst.color.greyBlue,
  },
  itemOrderCallBack: {
    backgroundColor: styleConst.color.green,
  },
  itemOrderTestDrive: {
    backgroundColor: styleConst.color.orange,
    marginRight: 4,
  },
  itemOrderWantACar: {
    all: {
      backgroundColor: styleConst.color.lightBlue,
      alignSelf: 'center',
      textAlign: 'center',
    },
    NewCarItemScreen: {},
    UsedCarItemScreen: {
      marginRight: 5,
    },
  },
  imageContainer: {
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: styleConst.color.white,
    borderRadius: 5,
  },
  iconText: {
    fontSize: 14,
    color: styleConst.color.white,
    textAlign: 'center',
  },
  iconTextSm: {
    fontSize: 14,
    color: styleConst.color.white,
    fontFamily: styleConst.font.regular,
    textAlign: 'center',
  },
});
