import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

// components
import {Image, View, ActivityIndicator} from 'react-native';

export default class Imager extends PureComponent {
  static propTypes = {
    source: PropTypes.shape({
      uri: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      imagePath: this.props.source.uri,
      animatingLoader: true,
    };
  }

  componentDidMount() {
    this.state.animating = false;
  }

  getImageCacheManager = () => {
    if (!this.imageCacheManager) {
      this.imageCacheManager = ImageCacheManager();
    }

    this.setState({animatingLoader: false});
    return this.imageCacheManager;
  };

  render() {
    // console.log('== Imager ==');

    return (
      <View>
        <ActivityIndicator
          animating={this.state.animatingLoader}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
        <Image
          {...this.props}
          source={{uri: this.state.imagePath.toString()}}
          // onLoadStart={() => { console.log('Image on load start'); }}
          // onLoad={() => { this.setState({animatingLoader: false}); console.log('Image on load'); }}
          onLoadEnd={() => {
            this.setState({animatingLoader: false});
            //  console.log('Image ' + this.state.imagePath + ' on load end');
          }}>
          {this.props.children}
        </Image>
      </View>
    );
  }
}
