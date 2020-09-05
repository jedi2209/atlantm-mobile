import React, {PureComponent} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import Imager from './Imager';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import requireALeastOne from '../../utils/requireALeastOneProps';

const mapStateToProps = ({dealer}) => {
  return {
    brands: dealer.listBrands,
  };
};

const requireALeast = requireALeastOne({
  width: PropTypes.number,
  height: PropTypes.number,
});

const styles = StyleSheet.create({
  imageSVG: {
    width: '100%',
    height: '100%',
  },
  containerSVG: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
});

const brandsSVG = {
  black: {
    6: (
      <Image
        source={require(`../assets/brands/black/brand-6.svg`)}
        style={styles.imageSVG}
      />
    ),
    7: (
      <Image
        source={require(`../assets/brands/black/brand-7.svg`)}
        style={styles.imageSVG}
      />
    ),
    9: (
      <Image
        source={require(`../assets/brands/black/brand-9.svg`)}
        style={styles.imageSVG}
      />
    ),
    10: (
      <Image
        source={require(`../assets/brands/black/brand-10.svg`)}
        style={styles.imageSVG}
      />
    ),
    12: (
      <Image
        source={require(`../assets/brands/black/brand-12.svg`)}
        style={styles.imageSVG}
      />
    ),
    13: (
      <Image
        source={require(`../assets/brands/black/brand-13.svg`)}
        style={styles.imageSVG}
      />
    ),
    14: (
      <Image
        source={require(`../assets/brands/black/brand-14.svg`)}
        style={styles.imageSVG}
      />
    ),
    19: (
      <Image
        source={require(`../assets/brands/black/brand-19.svg`)}
        style={styles.imageSVG}
      />
    ),
    20: (
      <Image
        source={require(`../assets/brands/black/brand-20.svg`)}
        style={styles.imageSVG}
      />
    ),
  },
  white: {
    6: (
      <Image
        source={require(`../assets/brands/white/brand-6.svg`)}
        style={styles.imageSVG}
      />
    ),
    7: (
      <Image
        source={require(`../assets/brands/white/brand-7.svg`)}
        style={styles.imageSVG}
      />
    ),
    9: (
      <Image
        source={require(`../assets/brands/white/brand-9.svg`)}
        style={styles.imageSVG}
      />
    ),
    10: (
      <Image
        source={require(`../assets/brands/white/brand-10.svg`)}
        style={styles.imageSVG}
      />
    ),
    12: (
      <Image
        source={require(`../assets/brands/white/brand-12.svg`)}
        style={styles.imageSVG}
      />
    ),
    13: (
      <Image
        source={require(`../assets/brands/white/brand-13.svg`)}
        style={styles.imageSVG}
      />
    ),
    14: (
      <Image
        source={require(`../assets/brands/white/brand-14.svg`)}
        style={styles.imageSVG}
      />
    ),
    19: (
      <Image
        source={require(`../assets/brands/white/brand-19.svg`)}
        style={styles.imageSVG}
      />
    ),
    20: (
      <Image
        source={require(`../assets/brands/white/brand-20.svg`)}
        style={styles.imageSVG}
      />
    ),
  },
};

class BrandLogo extends PureComponent {
  static propTypes = {
    brand: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['black', 'white']),
    width: requireALeast,
    height: requireALeast,
    aspectRatio: PropTypes.number,
  };

  static defaultProps = {
    type: 'black',
    aspectRatio: 1.5,
    brandsAssets: {
      black: [6, 7, 9, 10, 12, 13, 14, 19, 20],
      white: [6, 7, 9, 10, 12, 13, 14, 19, 20],
    },
  };

  render() {
    const {type, brand, brands, brandsAssets, aspectRatio} = this.props;
    let width = 30;
    let height = width / aspectRatio;
    if (this.props.height) {
      width = this.props.height * aspectRatio;
      height = this.props.height;
    } else {
      if (this.props.width) {
        width = this.props.width;
        height = this.props.width / aspectRatio;
      }
    }
    if (
      brandsAssets[type] &&
      brandsAssets[type].includes(brand) &&
      brandsSVG[type][brand]
    ) {
      return (
        <View style={[{}, {...this.props.style}]}>
          <View
            style={[
              styles.containerSVG,
              {
                aspectRatio,
                width,
                height,
              },
            ]}>
            {brandsSVG[type][brand]}
          </View>
        </View>
      );
    } else {
      return (
        <Imager
          resizeMode="contain"
          source={{uri: brands[brand].logo}}
          {...this.props}
        />
      );
    }
  }
}

export default connect(mapStateToProps)(BrandLogo);
