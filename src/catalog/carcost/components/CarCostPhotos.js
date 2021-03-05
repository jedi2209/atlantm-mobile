import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

// components
import {Grid, Row, Col, Icon} from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

// helpers
import PropTypes from 'prop-types';

import styleConst from '../../../core/style-const';
import strings from '../../../core/lang/const';

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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    color: styleConst.color.white,
  },
  photoShadow: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

export default class CarCostPhotos extends Component {
  static propTypes = {
    photos: PropTypes.array || PropTypes.object,
    photosFill: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {};

    this.state.itemWidth = this.getItemWidth(width);

    // генерируем хендлеры для actionSheet для каждого фото
    [1, 2, 3, 4, 5, 6].map((photoIndex) => {
      this[`handlePhotoPress${photoIndex}`] = (i) => {
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
      // compressImageQuality: 0.9,
      mediaType: 'photo',
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

  renderItem = (photoIndex) => {
    const {photos} = this.props;
    const photo = photos[photoIndex];
    const source = photo ? {uri: photo.path} : thumbs[photoIndex - 1];
    const width = this.state.itemWidth;
    const size = this.state.itemWidth / 1.4;

    return (
      <Col key={photoIndex} style={{width: width}}>
        <View>
          {photo ? (
            <TouchableOpacity
              style={styles.removeIconContainer}
              onPress={this[`onPressRemovePhoto${photoIndex}`]}>
              <Icon
                name="md-close-circle"
                selectable={false}
                style={[
                  styles.removeIcon,
                  {fontSize: width / 2.5, marginTop: -12},
                ]}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.item]}
            onPress={this[`onPressPhoto${photoIndex}`]}>
            {photo ? (
              <View style={[styles.photoShadow, {height: size}]} />
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
      </Col>
    );
  };

  getItemWidth = (contentWidth) => (contentWidth - 70) / 3;

  shouldComponentUpdate(nextProps) {
    return this.props.photos !== nextProps.photos;
  }

  onLayout = (e) => {
    return false;
  };

  render() {
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        {[1, 2, 3, 4, 5, 6].map((photoIndex) => {
          return (
            <ActionSheet
              key={photoIndex}
              cancelButtonIndex={0}
              ref={(component) =>
                (this[`actionSheet${photoIndex}`] = component)
              }
              title={strings.CarCostScreen.chooseFoto}
              options={[strings.Base.cancel, 'Галерея', 'Камера']}
              onPress={this[`handlePhotoPress${photoIndex}`]}
            />
          );
        })}

        <Grid style={styles.menu}>
          <Row style={styles.row}>{[1, 2, 3].map(this.renderItem)}</Row>
          <Row style={styles.row}>{[4, 5, 6].map(this.renderItem)}</Row>
        </Grid>
      </View>
    );
  }
}
