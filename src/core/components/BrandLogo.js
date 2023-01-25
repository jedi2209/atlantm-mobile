import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import Imager from './Imager';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import requireALeastOne from '../../utils/requireALeastOneProps';

const mapStateToProps = ({dealer}) => {
  return {
    brandsAll: dealer.listBrands,
  };
};

const requireALeast = requireALeastOne({
  width: PropTypes.number,
  height: PropTypes.number,
});

const BrandLogo = props => {
  const {brand} = props;

  let width = 30;
  let height = props.width / props.aspectRatio;
  if (props.height) {
    width = props.height * props.aspectRatio;
    height = props.height;
  } else {
    if (props.width) {
      width = props.width;
      height = props.width / props.aspectRatio;
    }
  }

  if (
    props.brandsAssets[props.type] &&
    props.brandsAssets[props.type].includes(brand) &&
    brandsSVG[props.type][brand]
  ) {
    return (
      <View style={[{}, {...props.style}]} testID={props.testID}>
        <View
          style={[
            styles.containerSVG,
            {
              aspectRatio: props.aspectRatio,
              width: props.width,
              height: props.height,
            },
          ]}>
          {brandsSVG[props.type][brand]}
        </View>
      </View>
    );
  } else {
    if (props.brandsAll && props.brandsAll[brand]) {
      return (
        <Imager
          resizeMode="contain"
          style={{
            width: '100%',
            height: '100%',
          }}
          key={props.brandsAll[brand].hash}
          source={{uri: props.brandsAll[brand].logo}}
          {...props}
        />
      );
    }
  }
  return <View />;
};

BrandLogo.propTypes = {
  brand: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['black', 'white']),
  width: requireALeast,
  height: requireALeast,
  aspectRatio: PropTypes.number,
};

BrandLogo.defaultProps = {
  type: 'black',
  aspectRatio: 1.5,
  brandsAssets: {
    black: [2, 3, 6, 7, 9, 10, 12, 13, 14, 19, 20],
    white: [2, 3, 6, 7, 9, 10, 12, 13, 14, 19, 20],
  },
  testID: 'BrandLogo.Wrapper',
};

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
    2: (
      <Image
        source={require('../assets/brands/black/brand-2.svg')}
        style={styles.imageSVG}
      />
    ),
    3: (
      <Image
        source={require('../assets/brands/black/brand-3.svg')}
        style={styles.imageSVG}
      />
    ),
    6: (
      <Image
        source={require('../assets/brands/black/brand-6.svg')}
        style={styles.imageSVG}
      />
    ),
    7: (
      <Image
        source={require('../assets/brands/black/brand-7.svg')}
        style={styles.imageSVG}
      />
    ),
    9: (
      <Image
        source={require('../assets/brands/black/brand-9.svg')}
        style={styles.imageSVG}
      />
    ),
    10: (
      <Image
        source={require('../assets/brands/black/brand-10.svg')}
        style={styles.imageSVG}
      />
    ),
    12: (
      <Image
        source={require('../assets/brands/black/brand-12.svg')}
        style={styles.imageSVG}
      />
    ),
    13: (
      <Image
        source={require('../assets/brands/black/brand-13.svg')}
        style={styles.imageSVG}
      />
    ),
    14: (
      <Image
        source={require('../assets/brands/black/brand-14.svg')}
        style={styles.imageSVG}
      />
    ),
    19: (
      <Image
        source={require('../assets/brands/black/brand-19.svg')}
        style={styles.imageSVG}
      />
    ),
    20: (
      <Image
        source={require('../assets/brands/black/brand-20.svg')}
        style={styles.imageSVG}
      />
    ),
  },
  white: {
    2: (
      <Image
        source={require('../assets/brands/white/brand-2.svg')}
        style={styles.imageSVG}
      />
    ),
    3: (
      <Image
        source={require('../assets/brands/black/brand-3.svg')}
        style={styles.imageSVG}
      />
    ),
    6: (
      <Image
        source={require('../assets/brands/white/brand-6.svg')}
        style={styles.imageSVG}
      />
    ),
    7: (
      <Image
        source={require('../assets/brands/white/brand-7.svg')}
        style={styles.imageSVG}
      />
    ),
    9: (
      <Image
        source={require('../assets/brands/white/brand-9.svg')}
        style={styles.imageSVG}
      />
    ),
    10: (
      <Image
        source={require('../assets/brands/white/brand-10.svg')}
        style={styles.imageSVG}
      />
    ),
    12: (
      <Image
        source={require('../assets/brands/white/brand-12.svg')}
        style={styles.imageSVG}
      />
    ),
    13: (
      <Image
        source={require('../assets/brands/white/brand-13.svg')}
        style={styles.imageSVG}
      />
    ),
    14: (
      <Image
        source={require('../assets/brands/white/brand-14.svg')}
        style={styles.imageSVG}
      />
    ),
    19: (
      <Image
        source={require('../assets/brands/white/brand-19.svg')}
        style={styles.imageSVG}
      />
    ),
    20: (
      <Image
        source={require('../assets/brands/white/brand-20.svg')}
        style={styles.imageSVG}
      />
    ),
  },
};

export default connect(mapStateToProps)(BrandLogo);
