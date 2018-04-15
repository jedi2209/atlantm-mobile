import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import { Image } from 'react-native';
// import { Alert, NetInfo } from 'react-native';
// import { CachedImage, ImageCacheManager } from 'react-native-cached-image';

export default class Imager extends PureComponent {
  static propTypes = {
    source: PropTypes.shape({
      uri: PropTypes.string.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      imagePath: this.props.source.uri,
    };
  }

  getImageCacheManager = () => {
    if (!this.imageCacheManager) {
      this.imageCacheManager = ImageCacheManager();
    }

    return this.imageCacheManager;
  }

  // onError = () => {
  //   console.log('== Imager Error, try to reload ==');
  //   const { source: { uri } } = this.props;

  //   NetInfo.isConnected.fetch().then(isConnected => {
  //     if (!isConnected) {
  //       setTimeout(() => Alert.alert('Отсутствует интернет соединение'), 100);
  //       return;
  //     }

  //     this.getImageCacheManager().deleteUrl(uri)
  //       .then(() => {
  //         console.log('delete url from cache');
  //         this.getImageCacheManager()
  //           .downloadAndCacheUrl(uri)
  //           .then(cachedImagePath => {
  //             console.log('== Imager reload ==');
  //             this.setState({
  //               imagePath: cachedImagePath,
  //             });
  //           });
  //       });
  //   });
  // }

  render () {
    console.log('== Imager ==');

    return (
      <Image
        {...this.props}
        source={{ uri: this.state.imagePath }}
      >{this.props.children}</Image>
    );
  }
}
