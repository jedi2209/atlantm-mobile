// base
import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Platform, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// components
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Imager from '../../core/components/Imager';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../style-const';

const {width: screenWidth} = Dimensions.get('window');

const PhotoSlider = ({
  height,
  firstItem,
  styleWrapper,
  photos,
  photosFull,
  paginationStyle,
  dotColor,
  loop,
  onPressItem,
  resizeMode,
  themeFull,
  fullScreen,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const [entries, setEntries] = useState([]);
  const carouselRef = useRef(null);

  const navigation = useNavigation();

  useEffect(() => {
    setEntries(photos);
  }, [photos]);

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
      let onPress = onPressItem;
      if (photosFull) { console.error(JSON.stringify(photosFull));
        onPress = () => {
          navigation.navigate(fullScreen, {
            images: photosFull,
            imageIndex: index,
            theme: themeFull,
          });
        };
      }
      return (
        <Pressable
          onPress={onPress ? onPress : onPressItem}
          style={[styles.item, {height}]}>
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
    }
  };

  return (
    <View style={[styles.container, styleWrapper]}>
      <Carousel
        ref={carouselRef}
        sliderWidth={screenWidth}
        sliderHeight={height}
        itemWidth={screenWidth * 0.95}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        removeClippedSubviews={false}
        useScrollView={true}
        // enableSnap={true}
        // lockScrollWhileSnapping={true}
        firstItem={firstItem}
        loop={loop}
        data={entries}
        renderItem={renderItem}
        onLayout={() => {
          if (entries.length > 3 && firstItem !== 0) {
            setTimeout(() => {
              carouselRef?.current?.snapToItem(firstItem, true);
            }, 100);
          }
        }}
        onSnapToItem={index => setActiveSlide(index)}
      />
      {dotColor ? (
        <Pagination
          dotsLength={entries.length}
          activeDotIndex={activeSlide}
          containerStyle={[styles.paginationStyle, paginationStyle]}
          dotStyle={[
            styles.dotStyle,
            {
              backgroundColor: dotColor,
            },
          ]}
          inactiveDotStyle={
            {
              // Define styles for inactive dots here
            }
          }
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      ) : null}
    </View>
  );
};

PhotoSlider.propTypes = {
  photos: PropTypes.array,
  resizeMode: PropTypes.string,
  paginationStyle: PropTypes.object,
  onPressItem: PropTypes.func,
  onIndexChanged: PropTypes.func,
  height: PropTypes.number,
};

PhotoSlider.defaultProps = {
  photos: [],
  height: 300,
  paginationStyle: {},
  dotColor: 'rgba(0,0,0,.2)',
  resizeMode: 'contain',
  firstItem: 0,
  loop: false,
  themeFull: 'black',
  fullScreen: 'FullScreenGallery',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width: screenWidth * 0.94,
    height: 300,
    borderRadius: 5,
    flex: 1,
  },
  imageContainer: {
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: styleConst.color.white,
    borderRadius: 5,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'space-between',
  },
});

export default PhotoSlider;
