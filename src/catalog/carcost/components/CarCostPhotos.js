import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

// components
import { Grid, Row, Col, Icon } from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../../../core/style-const';
import { scale, verticalScale } from '../../../utils/scale';

const thumbs = [
  require('../assets/photo_car_1.png'),
  require('../assets/photo_car_2.png'),
  require('../assets/photo_car_3.png'),
  require('../assets/photo_car_4.png'),
  require('../assets/photo_car_5.png'),
  require('../assets/photo_car_6.png'),
];

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',

  },
  photo: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: styleConst.color.border,
    width: scale(90),
    height: scale(65),
    marginBottom: verticalScale(15),
  },
  removeIconContainer: {
    position: 'absolute',
    top: -17,
    right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  removeIcon: {
    fontSize: 28,
    color: styleConst.color.red,
  },
});

export default class CarCostPhotos extends Component {
  static propTypes = {
    photos: PropTypes.object,
    photosFill: PropTypes.func,
  }

  constructor(props) {
    super(props);

    // генерируем хендлеры для actionSheet для каждого фото
    [1, 2, 3, 4, 5, 6].map(photoIndex => {
      this[`handlePhotoPress${photoIndex}`] = i => {
        this.handlePhotoPress(i, photoIndex, props.photosFill);
      };

      this[`onPressPhoto${photoIndex}`] = () => this[`actionSheet${photoIndex}`].show();

      this[`onPressRemovePhoto${photoIndex}`] = () => {
        let newPhotos = { ...this.props.photos };
        newPhotos[photoIndex] = undefined;
        this.props.photosFill(newPhotos);
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
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 0.6,
      mediaType: 'photo',
    };

    switch (action) {
      case 'gallery':
        const photoGallery = await ImagePicker.openPicker(settings);

        console.log('gallery', photoGallery);

        if (photoGallery) {
          cb({ ...this.props.photos, [photoIndex]: photoGallery });
        }

        break;
      case 'camera':
        const photoCamera = await ImagePicker.openCamera(settings);

        console.log('camera', photoCamera);

        if (photoCamera) {
          cb({ ...this.props.photos, [photoIndex]: photoCamera });
        }

        break;
      default:
        break;
    }
  }

  renderItem = (photoIndex) => {
    const { photos } = this.props;
    const photo = photos[photoIndex];
    // Platform.OS === 'ios' && __DEV__ ? file.filename : file.path
    const source = photo ? { uri: photo.path } : thumbs[photoIndex - 1];

    return <Col key={photoIndex}>
      <View style={styles.item}>
        {
          photo ?
            (
              <TouchableOpacity style={styles.removeIconContainer} onPress={this[`onPressRemovePhoto${photoIndex}`]}>
                <Icon name="md-close-circle" style={styles.removeIcon} />
              </TouchableOpacity>
            ) : null
        }
        <TouchableOpacity style={styles.item} onPress={this[`onPressPhoto${photoIndex}`]}>
          <Image style={styles.photo} source={source} />
        </TouchableOpacity>
      </View>
    </Col>;
  }

  render() {
    return (
      <View style={styles.container}>
        {
          [1, 2, 3, 4, 5, 6].map(photoIndex => {
            return <ActionSheet
              key={photoIndex}
              cancelButtonIndex={0}
              ref={component => this[`actionSheet${photoIndex}`] = component}
              title="Прикрепить фотографии"
              options={['Отмена', 'Галерея', 'Камера']}
              onPress={this[`handlePhotoPress${photoIndex}`]}
            />;
          })
        }

        <Grid style={styles.menu} >
          <Row>
            {[1, 2, 3].map(this.renderItem)}
          </Row>
          <Row>
            {[4, 5, 6].map(this.renderItem)}
          </Row>
        </Grid>
      </View>
    );
  }
}
