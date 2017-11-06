// base
import React, { Component } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Dimensions, Platform } from 'react-native';

// components
import Swiper from 'react-native-swiper';
import { isTablet } from 'react-native-device-info';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../style-const';

const { width } = Dimensions.get('window');
const height = isTablet() ? 260 : 200;
const styles = StyleSheet.create({
  container: {
    // marginHorizontal: -50,
  },
  photoSlider: {
    position: 'relative',
    width,
  },
  item: {
    // backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // width,
    height,
  },
  image: {
    alignSelf: 'center',
    width,
    height,
  },
  spinner: {
    position: 'absolute',
    alignSelf: 'center',
  },
});

const Slide = props => {
  return (
    <View style={[styles.item, { height: props.height }]}>
      <Image
          resizeMode="contain"
          style={styles.image}
          onLoad={props.loadHandle.bind(null, props.i)}
          source={{
            uri: props.url,
            width: props.width,
            height: props.height,
          }}
      />
      {
        !props.loaded && <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
      }
    </View>
  );
};

export default class PhotoSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadQueue: new Array(this.props.photos.length).fill(0),
      isLoaded: false,
      height,
    };
  }

  static propTypes = {
    photos: PropTypes.array,
  }

  static defaultProps = {
    photos: [],
  }

  loadHandle = (i) => {
    const loadQueue = this.state.loadQueue;
    loadQueue[i] = 1;
    this.setState({
      loadQueue,
      height: height + 1,
    });
  }

  render() {
    const { photos } = this.props;

    // Супер грязный хак, триггерим изменение высота для обновления слайдера
    // по-другому починить не получилось, попробовал много вариантов.
    // p.s. нравится компонент, хотел оставить.
    if (Platform.OS === 'android' && !this.state.isLoaded) {
    // if (Platform.OS === 'android') {
      setTimeout(() => {
        this.setState({
          isLoaded: true,
          height: height + 1,
        });
      }, 0);
    }

    return (
      <Swiper
        id={1}
        containerStyle={styles.container}
        dotColor="#fff"
        showsButtons={false}
        showsPagination={true}
        height={this.state.height}
        rootStyle={styles.photoSlider}
        loadMinimal={false}
      >
        {
          photos.map((photo, idx) => {
            return <Slide
              height={this.state.height}
              loadHandle={this.loadHandle}
              loaded={!!this.state.loadQueue[idx]}
              url={photo}
              i={idx}
              key={idx}
            />;
          })
        }
      </Swiper>
    );
  }
}
