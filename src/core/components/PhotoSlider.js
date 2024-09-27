// base
import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Platform, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// components
import Carousel from './Carousel';
import Imager from './Imager';

// helpers
import styleConst from '../style-const';

const {width: screenWidth} = Dimensions.get('window');

const PhotoSlider = ({
  photos = [],
  width = screenWidth,
  height = 300,
  itemStyle = {},
  pagination = false,
  paginationStyle = {},
  imageContainer = {},
  dotColor = styleConst.color.blue,
  resizeMode = 'contain',
  loop = false,
  autoPlay = false,
  themeFull = 'black',
  fullScreen = 'FullScreenGallery',
  styleWrapper,
  photosFull,
  onPressItem,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const [entries, setEntries] = useState([]);

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
      if (photosFull) {
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
          style={[styles.item, itemStyle, {height}]}>
          <Imager
            key={'Imager-' + item.url}
            resizeMode={resizeMode}
            priority={priority}
            source={{
              uri: item.url,
            }}
            style={[styles.imageContainer, imageContainer, {height}]}
          />
        </Pressable>
      );
    }
  };

  return (
    <View style={[styles.container, styleWrapper]}>
      <Carousel
        width={width}
        height={height}
        loop={loop}
        data={entries}
        autoPlay={autoPlay}
        renderItem={renderItem}
        onSnapToItem={index => setActiveSlide(index)}
        pagination={pagination}
        paginationColor={dotColor}
        paginationStyle={paginationStyle}
      />
    </View>
  );
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
