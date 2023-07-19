import React, {useState} from 'react';
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

  let currPath = null;
  if (
    props.brandsAssets[props.type] &&
    props.brandsAssets[props.type].includes(brand) &&
    brandsSVG[props.type][brand]
  ) {
    currPath = brandsSVG[props.type][brand];
  } else {
    if (props.brandsAll && props.brandsAll[brand]) {
      currPath = props.brandsAll[brand].logo;
    }
  }
  const [currentLogoPath, setCurrentLogoPath] = useState(currPath);

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
    currentLogoPath
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
          {currentLogoPath}
        </View>
      </View>
    );
  } else {
    if (currentLogoPath) {
      return (
        <Imager
          resizeMode="contain"
          style={{
            aspectRatio: props.aspectRatio,
            width: props.width,
            height: props.height,
          }}
          absoluteFill={false}
          onLoadrError={e => {
            setCurrentLogoPath(props.brandsAll[brand]?.svg?.black);
          }}
          key={props.brandsAll[brand].hash + currPath}
          source={{uri: currentLogoPath}}
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
    black: [
      2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 14, 19, 20, 23, 30, 46, 77, 92, 153, 157,
      159,
    ],
    white: [
      2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 14, 19, 20, 23, 30, 46, 77, 92, 153, 157,
      159,
    ],
  },
  testID: 'BrandLogo.Wrapper',
};

const styles = StyleSheet.create({
  imageSVG: {
    maxWidth: '100%',
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
        source={require('../../../assets/brands/black/brand-2.svg')}
        style={styles.imageSVG}
      />
    ),
    3: (
      <Image
        source={require('../../../assets/brands/black/brand-3.svg')}
        style={[styles.imageSVG, {height: '30%'}]}
      />
    ),
    4: (
      <Image
        source={require('../../../assets/brands/black/brand-4.svg')}
        style={[styles.imageSVG, {height: '90%'}]}
      />
    ),
    5: (
      <Image
        source={require('../../../assets/brands/black/brand-5.svg')}
        style={[styles.imageSVG, {height: '50%'}]}
      />
    ),
    6: (
      <Image
        source={require('../../../assets/brands/black/brand-6.svg')}
        style={styles.imageSVG}
      />
    ),
    7: (
      <Image
        source={require('../../../assets/brands/black/brand-7.svg')}
        style={styles.imageSVG}
      />
    ),
    9: (
      <Image
        source={require('../../../assets/brands/black/brand-9.svg')}
        style={styles.imageSVG}
      />
    ),
    10: (
      <Image
        source={require('../../../assets/brands/black/brand-10.svg')}
        style={styles.imageSVG}
      />
    ),
    12: (
      <Image
        source={require('../../../assets/brands/black/brand-12.svg')}
        style={styles.imageSVG}
      />
    ),
    13: (
      <Image
        source={require('../../../assets/brands/black/brand-13.svg')}
        style={styles.imageSVG}
      />
    ),
    14: (
      <Image
        source={require('../../../assets/brands/black/brand-14.svg')}
        style={styles.imageSVG}
      />
    ),
    19: (
      <Image
        source={require('../../../assets/brands/black/brand-19.svg')}
        style={styles.imageSVG}
      />
    ),
    20: (
      <Image
        source={require('../../../assets/brands/black/brand-20.svg')}
        style={styles.imageSVG}
      />
    ),
    23: (
      <Image
        source={require('../../../assets/brands/black/brand-23.svg')}
        style={[styles.imageSVG, {height: '83%'}]}
      />
    ),
    30: (
      <Image
        source={require('../../../assets/brands/black/brand-30.svg')}
        style={[styles.imageSVG, {width: '90%'}]}
      />
    ),
    46: (
      <Image
        source={require('../../../assets/brands/black/brand-46.svg')}
        style={[styles.imageSVG, {height: '85%'}]}
      />
    ),
    77: (
      <Image
        source={require('../../../assets/brands/black/brand-77.svg')}
        style={[styles.imageSVG, {height: '85%'}]}
      />
    ),
    92: (
      <Image
        source={require('../../../assets/brands/black/brand-92.svg')}
        style={[styles.imageSVG, {height: '90%'}]}
      />
    ),
    153: (
      <Image
        source={require('../../../assets/brands/black/brand-153.svg')}
        style={[styles.imageSVG, {height: '30%'}]}
      />
    ),
    157: (
      <Image
        source={require('../../../assets/brands/black/brand-157.svg')}
        style={[styles.imageSVG, {height: '83%'}]}
      />
    ),
    159: (
      <Image
        source={require('../../../assets/brands/black/brand-159.svg')}
        style={[styles.imageSVG, {height: '40%'}]}
      />
    ),
  },
  white: {
    2: (
      <Image
        source={require('../../../assets/brands/white/brand-2.svg')}
        style={styles.imageSVG}
      />
    ),
    3: (
      <Image
        source={require('../../../assets/brands/black/brand-3.svg')}
        style={[styles.imageSVG, {height: '30%'}]}
      />
    ),
    4: (
      <Image
        source={require('../../../assets/brands/white/brand-4.svg')}
        style={[styles.imageSVG, {height: '90%'}]}
      />
    ),
    5: (
      <Image
        source={require('../../../assets/brands/white/brand-5.svg')}
        style={[styles.imageSVG, {height: '50%'}]}
      />
    ),
    6: (
      <Image
        source={require('../../../assets/brands/white/brand-6.svg')}
        style={styles.imageSVG}
      />
    ),
    7: (
      <Image
        source={require('../../../assets/brands/white/brand-7.svg')}
        style={styles.imageSVG}
      />
    ),
    9: (
      <Image
        source={require('../../../assets/brands/white/brand-9.svg')}
        style={styles.imageSVG}
      />
    ),
    10: (
      <Image
        source={require('../../../assets/brands/white/brand-10.svg')}
        style={styles.imageSVG}
      />
    ),
    12: (
      <Image
        source={require('../../../assets/brands/white/brand-12.svg')}
        style={styles.imageSVG}
      />
    ),
    13: (
      <Image
        source={require('../../../assets/brands/white/brand-13.svg')}
        style={styles.imageSVG}
      />
    ),
    14: (
      <Image
        source={require('../../../assets/brands/white/brand-14.svg')}
        style={styles.imageSVG}
      />
    ),
    19: (
      <Image
        source={require('../../../assets/brands/white/brand-19.svg')}
        style={styles.imageSVG}
      />
    ),
    20: (
      <Image
        source={require('../../../assets/brands/white/brand-20.svg')}
        style={styles.imageSVG}
      />
    ),
    23: (
      <Image
        source={require('../../../assets/brands/white/brand-23.svg')}
        style={styles.imageSVG}
      />
    ),
    30: (
      <Image
        source={require('../../../assets/brands/white/brand-30.svg')}
        style={[styles.imageSVG, {width: '90%'}]}
      />
    ),
    46: (
      <Image
        source={require('../../../assets/brands/white/brand-46.svg')}
        style={[styles.imageSVG, {height: '85%'}]}
      />
    ),
    92: (
      <Image
        source={require('../../../assets/brands/white/brand-92.svg')}
        style={[styles.imageSVG, {height: '90%'}]}
      />
    ),
    153: (
      <Image
        source={require('../../../assets/brands/white/brand-153.svg')}
        style={[styles.imageSVG, {height: '30%'}]}
      />
    ),
    157: (
      <Image
        source={require('../../../assets/brands/white/brand-157.svg')}
        style={[styles.imageSVG, {height: '83%'}]}
      />
    ),
    159: (
      <Image
        source={require('../../../assets/brands/white/brand-159.svg')}
        style={[styles.imageSVG, {height: '40%'}]}
      />
    ),
  },
};

export default connect(mapStateToProps)(BrandLogo);
