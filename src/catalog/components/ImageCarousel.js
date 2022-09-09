import React, {useRef, useState, useEffect} from 'react';
import Carousel from 'react-native-snap-carousel';
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  Text,
  Pressable,
} from 'react-native';
import {Button, HStack, Icon, VStack} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Imager from '../../core/components/Imager';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

const {width: screenWidth} = Dimensions.get('window');

const ImageCarousel = ({
  data,
  height,
  resizeMode,
  style,
  firstItem,
  onPressCustom,
}) => {
  const [entries, setEntries] = useState([]);
  const carouselRef = useRef(null);

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
      switch (item.name) {
        case 'newCar':
          return (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button
                onPress={item.onPressWantACar}
                style={[styles.itemOrder, styles.itemOrderWantACar, {height}]}
                leftIcon={
                  <Icon
                    size={5}
                    as={MaterialCommunityIcons}
                    name="wallet-giftcard"
                    color="white"
                    _dark={{
                      color: 'white',
                    }}
                  />
                }
                _text={styles.iconText}>
                {strings.NewCarItemScreen.wannaCar}
              </Button>
              <Button
                onPress={item.onPressTD}
                style={[styles.itemOrder, styles.itemOrderTestDrive, {height}]}
                leftIcon={
                  <Icon
                    size={5}
                    as={MaterialCommunityIcons}
                    name="steering"
                    color="white"
                    _dark={{
                      color: 'white',
                    }}
                  />
                }
                _text={styles.iconText}>
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
                          color="white"
                          _dark={{
                            color: 'white',
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
                          color="white"
                          _dark={{
                            color: 'white',
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
                  style={[styles.itemOrder, styles.itemOrderWantACar, {height}]}
                  leftIcon={
                    <Icon
                      selectable={false}
                      size={8}
                      as={MaterialCommunityIcons}
                      name="wallet-giftcard"
                      color="white"
                      _dark={{
                        color: 'white',
                      }}
                    />
                  }
                  _text={styles.iconText}>
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
        ref={carouselRef}
        sliderWidth={screenWidth}
        sliderHeight={height}
        itemWidth={screenWidth / 1.68}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        apparitionDelay={100}
        onPress={onPressCustom}
        onLayout={() => {
          if (entries.length > 3) {
            setTimeout(() => {
              carouselRef?.current?.snapToItem(firstItem + 1, false);
            }, 300);
          }
        }}
        removeClippedSubviews={false}
        useScrollView={true}
        enableSnap={false}
        lockScrollWhileSnapping={true}
        firstItem={firstItem}
        data={entries}
        renderItem={renderItem}
      />
    </View>
  );
};

ImageCarousel.defaultProps = {
  height: 200,
  resizeMode: 'cover',
  style: {},
  firstItem: 0,
  onPress: () => {},
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
    width: screenWidth / 1.7 / 2,
    flexDirection: 'column',
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
  },
  itemOrderWantACar: {
    backgroundColor: styleConst.color.lightBlue,
  },
  imageContainer: {
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 5,
  },
  iconText: {
    fontSize: 15,
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
