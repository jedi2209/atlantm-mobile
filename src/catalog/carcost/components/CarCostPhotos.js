import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

// components
import { Grid, Row, Col } from 'native-base';
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

  },
  icon: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: styleConst.color.border,
    width: scale(90),
    height: scale(65),
    marginBottom: verticalScale(15),
  },
});

export default class CarCostPhotos extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);

    // генерируем хендлеры для actionSheet для каждого фото
    [1, 2, 3, 4, 5, 6].map(photoIndex => {
      this[`handlePhotoPress${photoIndex}`] = i => {
        this.handlePhotoPress(i, () => {
          console.log(`upload cool photo ${photoIndex}`);
        });
      };

      this[`onPressPhoto${photoIndex}`] = () => this[`actionSheet${photoIndex}`].show();
    });
  }

  async handlePhotoPress(i, cb) {
    const action = {
      1: 'gallery',
      2: 'camera',
    }[i];

    const settings = {
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 0.6,
      mediaType: 'photo',
    };

    switch (action) {
      case 'gallery':
        const photoGallery = await ImagePicker.openPicker(settings);

        console.log('gallery', photoGallery);

        if (photoGallery) { cb(); }

        break;
      case 'camera':
        const photoCamera = await ImagePicker.openCamera(settings);

        console.log('camera', photoCamera);

        if (photoCamera) { cb(); }

        break;
      default:
        break;
    }
  }

  render() {
    // const { comment } = this.props;

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
            {
              [1, 2, 3].map((photoIndex) => {
                return <Col key={photoIndex}>
                  <TouchableOpacity style={styles.item} onPress={this[`onPressPhoto${photoIndex}`]}>
                    <Image style={styles.icon} source={thumbs[photoIndex - 1]} />
                  </TouchableOpacity>
                </Col>;
              })
            }
          </Row>
          <Row>
            {
              [4, 5, 6].map((photoIndex) => {
                return <Col key={photoIndex}>
                  <TouchableOpacity style={styles.item} onPress={this[`onPressPhoto${photoIndex}`]}>
                    <Image style={styles.icon} source={thumbs[photoIndex - 1]} />
                  </TouchableOpacity>
                </Col>;
              })
            }
          </Row>
        </Grid>
      </View>
    );
  }
}
