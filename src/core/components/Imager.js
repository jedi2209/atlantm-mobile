import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import { Image } from 'react-native';

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
