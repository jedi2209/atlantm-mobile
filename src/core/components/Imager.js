import React, {useEffect, useState} from 'react';

// components
import {Image, View, ActivityIndicator, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SvgCssUri} from 'react-native-svg/css';
import styleConst from '../style-const';
import {get} from 'lodash';

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
  const {
    testID = 'Imager.Wrapper',
    priority = 'normal',
    resizeMode = 'cover',
    absoluteFill = true,
    onLoadError = e => console.error('Imager error image loading', e),
    onLoadStart = () => {
      return true;
    },
    onLoadEnd = () => {
      return true;
    },
  } = props;

  const [isLoading, setLoading] = useState(false);

  let path = get(props, 'source.uri', null);
  let extension = null;

  if (typeof props.source !== 'number') {
    // if source is not require('../../../*.jpg') image
    if (path) {
      path = path.toString();
      extension = path.split('.').pop();
    }
    if (!extension && props?.source?.uri) {
      return null;
    }
  }

  if (isLoading) {
    return (
      <ActivityIndicator
        animating={isLoading}
        hidesWhenStopped={true}
        color={styleConst.color.blue}
        style={styles.loader}
      />
    );
  }

  return (
    <View testID={testID}>
      {extension === 'svg' ? (
        <View
          style={[
            absoluteFill ? StyleSheet.absoluteFill : {},
            styles.svgWrapper,
            props?.style,
          ]}>
          <SvgCssUri width="100%" height="100%" uri={path} />
        </View>
      ) : (
        <View
          shouldRasterizeIOS={isLoading}
          renderToHardwareTextureAndroid={isLoading}>
          <View style={{opacity: isLoading ? 0.4 : 1}}>
            <FastImage
              resizeMode={FastImage.resizeMode[resizeMode]}
              onLoadStart={() => {
                console.log('\tImager => start load image\t' + path);
                onLoadStart();
              }}
              onError={e => {
                console.log('\tImager => error load image\t' + path);
                onLoadError(e);
                setLoading(false);
              }}
              onLoadEnd={() => {
                console.log('\tImager => end load image\t' + path);
                onLoadEnd();
                setLoading(false);
              }}
              source={{
                uri: path,
                priority: FastImage.priority[priority],
                cache: FastImage.cacheControl.web,
              }}
              {...props}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Imager;
