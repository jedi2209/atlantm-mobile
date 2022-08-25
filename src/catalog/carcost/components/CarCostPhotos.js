import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';

// components
import {HStack, VStack, Icon, View} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from '@alessiocancian/react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

// helpers
import PropTypes from 'prop-types';

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

export default class CarCostPhotos extends Component {
  static propTypes = {
    photos: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    photosFill: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {};

    this.state.itemWidth = this.getItemWidth(width);

    // генерируем хендлеры для actionSheet для каждого фото
    [1, 2, 3, 4, 5, 6].map(photoIndex => {
      this[`handlePhotoPress${photoIndex}`] = i => {
        this.handlePhotoPress(i, photoIndex, props.photosFill);
      };

      this[`onPressPhoto${photoIndex}`] = () =>
        this[`actionSheet${photoIndex}`].show();

      this[`onPressRemovePhoto${photoIndex}`] = () => {
        let newPhotos = {...this.props.photos};
        delete newPhotos[photoIndex];
        props.photosFill(newPhotos);
      };
    });
  }

  async handlePhotoPress(i, photoIndex, cb) {
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

    switch (action) {
      case 'gallery':
        const photoGallery = await ImagePicker.openPicker(settings);

        if (photoGallery) {
          cb({...this.props.photos, [photoIndex]: photoGallery});
        }

        break;
      case 'camera':
        const photoCamera = await ImagePicker.openCamera(settings);

        if (photoCamera) {
          cb({...this.props.photos, [photoIndex]: photoCamera});
        }

        break;
      default:
        break;
    }
  }

  renderItem = photoIndex => {
    const {photos} = this.props;
    const photo = photos[photoIndex];
    const source = photo ? {uri: photo.path} : thumbs[photoIndex - 1];
    const width = this.state.itemWidth;
    const size = this.state.itemWidth / 1.4;

    return (
      <View key={photoIndex} style={{width: width}}>
        {photo ? (
          <TouchableOpacity
            style={styles.removeIconContainer}
            onPress={this[`onPressRemovePhoto${photoIndex}`]}>
            <Icon
              name="md-close-circle"
              as={Ionicons}
              size={12}
              color="white"
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.item]}
          onPress={this[`onPressPhoto${photoIndex}`]}>
          {photo ? (
            <View shadow={3} style={[styles.photoShadow, {height: size}]} />
          ) : null}
          <Image
            style={[
              styles.photo,
              {
                width,
                height: size,
                marginBottom: 15,
              },
            ]}
            source={source}
          />
        </TouchableOpacity>
      </View>
    );
  };

  getItemWidth = contentWidth => (contentWidth - 70) / 3;

  shouldComponentUpdate(nextProps) {
    return this.props.photos !== nextProps.photos;
  }

  onLayout = e => {
    return false;
  };

  render() {
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <StatusBar hidden />
        {[1, 2, 3, 4, 5, 6].map(photoIndex => {
          return (
            <ActionSheet
              key={photoIndex}
              cancelButtonIndex={0}
              ref={component => (this[`actionSheet${photoIndex}`] = component)}
              title={strings.CarCostScreen.chooseFoto}
              options={[strings.Base.cancel, 'Галерея', 'Камера']}
              onPress={this[`handlePhotoPress${photoIndex}`]}
            />
          );
        })}

        <VStack style={styles.menu}>
          <HStack justifyContent="space-around">
            {[1, 2, 3].map(this.renderItem)}
          </HStack>
          <HStack justifyContent="space-around">
            {[4, 5, 6].map(this.renderItem)}
          </HStack>
        </VStack>
      </View>
    );
  }
}
