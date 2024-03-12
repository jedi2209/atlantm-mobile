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
  const [isLoading, setLoading] = useState(false);

  let path = get(props, 'source.uri', null);
  if (path) {
    path = path.toString();
  }
  let extension = null;
  if (path) {
    extension = path.split('.').pop();
  }
  if (!extension && props?.source?.uri) {
    return null;
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
                console.log('start');
                props.onLoadStart();
              }}
              onError={e => {
                console.log('error');
                props.onLoadError(e);
                setLoading(false);
              }}
              onLoadEnd={() => {
                console.log('end');
                props.onLoadEnd();
                setLoading(false);
              }}
              {...props}
            />
          </View>
        </View>
      )}
    </View>
  );
};

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
