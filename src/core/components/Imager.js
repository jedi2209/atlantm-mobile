import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

// components
import {Image, View, ActivityIndicator, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SvgCssUri} from 'react-native-svg';
import styleConst from '../style-const';

const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
});

const Imager = props => {
  const [isLoading, setLoading] = useState(false);

  let path = props?.source?.uri?.toString();
  let extension = null;
  if (path) {
    extension = path.split('.').pop();
  }
  if (!extension && props?.source?.uri) {
    return null;
  }

  return (
    <View testID={props.testID}>
      {extension === 'svg' ? (
        <View
          style={[
            props?.absoluteFill ? StyleSheet.absoluteFill : {},
            styles.svgWrapper,
            props?.style,
          ]}>
          <SvgCssUri width="100%" height="100%" uri={path} />
        </View>
      ) : (
        <View
          shouldRasterizeIOS={isLoading ? true : false}
          renderToHardwareTextureAndroid={isLoading ? true : false}>
          <View style={{opacity: isLoading ? 0.4 : 1}}>
            <FastImage
              source={{
                uri: path,
                priority: FastImage.priority[props.priority],
                cache: FastImage.cacheControl.web,
              }}
              resizeMode={FastImage.resizeMode[props.resizeMode]}
              onLoadStart={() => {
                setLoading(true);
                props.onLoadStart();
              }}
              onError={e => {
                props.onLoadError(e);
                setLoading(false);
              }}
              onLoadEnd={() => {
                props.onLoadEnd();
                setLoading(false);
              }}
              {...props}
            />
          </View>
          <ActivityIndicator
            animating={isLoading}
            hidesWhenStopped={true}
            color={styleConst.color.blue}
            style={styles.loader}
          />
        </View>
      )}
    </View>
  );
};

// Imager.propTypes = {
//   source: PropTypes.shape({
//     uri: PropTypes.string.isRequired,
//   }).isRequired,
// };

Imager.defaultProps = {
  testID: 'Imager.Wrapper',
  priority: 'normal',
  resizeMode: 'cover',
  absoluteFill: true,
  onLoadError: e => console.error('Imager error image loading', e),
  onLoadStart: () => {
    return true;
  },
  onLoadEnd: () => {
    return true;
  },
};

export default Imager;
