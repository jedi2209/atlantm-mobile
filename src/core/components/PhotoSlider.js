// base
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

// components
import Swiper from 'react-native-swiper';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../style-const';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  photoSlider: {
    width,
    position: 'relative',
    padding: 0,
    zIndex: 10,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    zIndex: 10,
  },
  image: {
    alignSelf: 'center',
    width,
    padding: 0,
    zIndex: 10,
  },
  spinner: {
    position: 'absolute',
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
  },
});

const Slide = props => {
  return (
    <View style={[styles.item, {height: props.height}]}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <Image
          resizeMode={props.resizeMode}
          style={[styles.image, {height: props.height}]}
          onLoad={props.loadHandle.bind(null, props.i)}
          source={{
            uri: props.url,
            width: props.width,
            height: props.height,
          }}
        />
      </TouchableWithoutFeedback>
      {!props.loaded && (
        <ActivityIndicator
          size="large"
          color={styleConst.color.blue}
          style={styles.spinner}
        />
      )}
    </View>
  );
};

const PhotoSlider = ({
  height,
  photos,
  paginationStyle,
  dotColor,
  onIndexChanged,
  onPressItem,
  resizeMode,
}) => {
  const [isLoaded, setLoaded] = useState(false);
  const [loadQueue, setLoadQueue] = useState({});

  useEffect(() => {
    setLoadQueue(new Array(photos.length).fill(0));
  }, [photos.length]);

  const _loadHandle = i => {
    let loadQueueTmp = {};
    loadQueueTmp[i] = 1;
    setLoadQueue(loadQueueTmp);
  };

  // Супер грязный хак, триггерим изменение высота для обновления слайдера
  // по-другому починить не получилось, попробовал много вариантов.
  // p.s. нравится компонент, хотел оставить.
  if (Platform.OS === 'android' && !isLoaded) {
    // if (Platform.OS === 'android') {
    setTimeout(() => {
      setLoaded(true);
    }, 5);
  }

  return (
    <Swiper
      id={1}
      containerStyle={styles.container}
      paginationStyle={[
        {
          marginBottom: 5,
        },
        paginationStyle,
      ]}
      dotColor={dotColor}
      showsButtons={false}
      autoplay={false}
      showsPagination={true}
      height={height}
      rootStyle={styles.photoSlider}
      loadMinimal={true}
      onIndexChanged={onIndexChanged}>
      {photos.map((photo, idx) => {
        return (
          <Slide
            onPress={onPressItem}
            resizeMode={resizeMode}
            height={height}
            loadHandle={_loadHandle}
            loaded={!!loadQueue[idx]}
            url={photo}
            i={idx}
            key={photo}
          />
        );
      })}
    </Swiper>
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
};

export default PhotoSlider;
