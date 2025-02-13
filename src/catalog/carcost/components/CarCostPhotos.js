import React, {useCallback, useMemo, useRef, memo} from 'react';
import {StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import PropTypes from 'prop-types';

// components
import {HStack, VStack, Icon, View} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from '@alessiocancian/react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

import styleConst from '../../../core/style-const';
import {strings} from '../../../core/lang/const';

const thumbs = [
  require('../assets/photo_car_1.png'),
  require('../assets/photo_car_2.png'),
  require('../assets/photo_car_3.png'),
  require('../assets/photo_car_4.png'),
  require('../assets/photo_car_5.png'),
  require('../assets/photo_car_6.png'),
];

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  row: {
    justifyContent: 'space-around',
  },
  item: {
    position: 'relative',
  },
  photo: {
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  removeIconContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoShadow: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

const getItemWidth = contentWidth => (contentWidth - 70) / 3;

const CarCostPhotos = memo(({photos, photosFill}) => {
  const actionSheetRefs = useRef(Array(6).fill(null));
  const itemWidth = useMemo(() => getItemWidth(width), []);

  const handlePhotoPress = useCallback(async (i, photoIndex) => {
    const action = {
      1: 'gallery',
      2: 'camera',
    }[i];

    const settings = {
      cropping: false,
      compressImageMaxWidth: 1400,
      compressImageMaxHeight: 1400,
      compressImageQuality: 0.9,
      mediaType: 'photo',
      includeBase64: true,
      writeTempFile: false,
      includeExif: true,
      forceJpg: true,
    };

    try {
      switch (action) {
        case 'gallery': {
          const photoGallery = await ImagePicker.openPicker(settings);
          if (photoGallery) {
            photosFill({...photos, [photoIndex]: photoGallery});
          }
          break;
        }
        case 'camera': {
          const photoCamera = await ImagePicker.openCamera(settings);
          if (photoCamera) {
            photosFill({...photos, [photoIndex]: photoCamera});
          }
          break;
        }
      }
    } catch (error) {
      console.warn('Photo selection error:', error);
    }
  }, [photos, photosFill]);

  const handleRemovePhoto = useCallback((photoIndex) => {
    const newPhotos = {...photos};
    delete newPhotos[photoIndex];
    photosFill(newPhotos);
  }, [photos, photosFill]);

  const renderItem = useCallback((photoIndex) => {
    const photo = photos[photoIndex];
    const source = photo ? {uri: photo.path} : thumbs[photoIndex - 1];
    const size = itemWidth / 1.4;

    return (
      <View key={photoIndex} style={{width: itemWidth}}>
        {photo && (
          <TouchableOpacity
            style={styles.removeIconContainer}
            onPress={() => handleRemovePhoto(photoIndex)}>
            <Icon
              name="close-circle"
              as={Ionicons}
              size={12}
              color={styleConst.color.white}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.item}
          onPress={() => actionSheetRefs.current[photoIndex - 1]?.show()}>
          {photo && (
            <View shadow={3} style={[styles.photoShadow, {height: size}]} />
          )}
          <Image
            style={[
              styles.photo,
              {
                width: itemWidth,
                height: size,
                marginBottom: 15,
              },
            ]}
            source={source}
          />
        </TouchableOpacity>
      </View>
    );
  }, [photos, itemWidth, handleRemovePhoto]);

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6].map((photoIndex) => (
        <ActionSheet
          key={photoIndex}
          cancelButtonIndex={0}
          ref={ref => (actionSheetRefs.current[photoIndex - 1] = ref)}
          title={strings.CarCostScreen.chooseFoto}
          options={[strings.Base.cancel, 'Галерея', 'Камера']}
          onPress={(i) => handlePhotoPress(i, photoIndex)}
        />
      ))}

      <VStack style={styles.menu}>
        <HStack justifyContent="space-around">
          {[1, 2, 3].map(renderItem)}
        </HStack>
        <HStack justifyContent="space-around">
          {[4, 5, 6].map(renderItem)}
        </HStack>
      </VStack>
    </View>
  );
});

CarCostPhotos.propTypes = {
  photos: PropTypes.object.isRequired,
  photosFill: PropTypes.func.isRequired,
};

export default CarCostPhotos;
