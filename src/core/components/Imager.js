import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

// components
import {Image, View, ActivityIndicator, StyleSheet} from 'react-native';
import {SvgCssUri} from 'react-native-svg';
import styleConst from '../style-const';
import {verticalScale} from '../../utils/scale';

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

  render() {
    if (!this.state.imagePath) {
      return;
    }

    const path = this.state.imagePath;

    const extension = path.split('.').pop();

    if (extension === 'svg') {
      this.setState({animatingLoader: false});
    }

    return (
      <View>
        <ActivityIndicator
          animating={this.state.animatingLoader}
          color={styleConst.color.blue}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: verticalScale(60),
          }}
        />
        {extension === 'svg' ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              {alignItems: 'center', justifyContent: 'center'},
              {...this.props.style},
            ]}>
            <SvgCssUri
              width="100%"
              height="100%"
              uri={this.state.imagePath.toString()}
            />
          </View>
        ) : (
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
        )}
      </View>
    );
  }
}
