import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import CarouselReanimated from 'react-native-reanimated-carousel';
import styleConst from '../style-const';

const deviceWidth = Dimensions.get('window').width;

const PaginationItem = props => {
  const {animValue, index, length, backgroundColor} = props;
  const width = 10;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      style={{
        backgroundColor: styleConst.color.bg,
        width,
        height: width,
        borderRadius: 50,
        overflow: 'hidden',
        transform: [
          {
            rotateZ: '0deg',
          },
        ],
      }}>
      <Animated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor,
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

const Carousel = props => {
  const {
    autoPlayInterval = 5000,
    autoPlay = false,
    loop = true,
    isPagingEnabled = true,
    pagination = false,
    paginationColor = styleConst.color.blueNew,
    paginationStyle = {},
    onPressCustom = undefined,
    data,
  } = props;

  const progressValue = useSharedValue(0);

  const baseOptions = {
    vertical: false,
    width: deviceWidth,
    height: deviceWidth * 0.6,
  };

  const ref = useRef(null);

  return (
    <View style={{flex: 1}}>
      <CarouselReanimated
        {...baseOptions}
        loop={loop}
        ref={ref}
        style={{width: '100%'}}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        data={data}
        pagingEnabled={isPagingEnabled}
        // onSnapToItem={index => console.log('current index:', index)}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        {...props}
      />
      {pagination ? (
        <View
          style={[
            styleLocal.paginationView,
            paginationStyle,
          ]}>
          {data.map((el, index) => {
            return (
              <PaginationItem
                backgroundColor={paginationColor}
                animValue={progressValue}
                index={index}
                key={index}
                length={data.length}
              />
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

const styleLocal = StyleSheet.create({
  paginationView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: deviceWidth * 0.6,
    alignSelf: 'center',
  },
});

export default Carousel;
