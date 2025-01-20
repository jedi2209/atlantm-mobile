import React, {useEffect, useState} from 'react';

// components
import {View, StyleSheet, Image} from 'react-native';
// import FastImage from 'react-native-fast-image';
// import { FasterImageView, clearCache } from '@candlefinance/faster-image';
import TurboImage from 'react-native-turbo-image';

import {SvgCssUri} from 'react-native-svg/css';
// import styleConst from '../style-const';
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

const Imager = ({
  testID = 'Imager.Wrapper',
  priority = 'normal',
  resizeMode = 'cover',
  absoluteFill = true,
  style = {},
  source = {},
  onLoadError = e => console.error('Imager error image loading', e),
  setImageDimensions = () => {},
  onLoadStart = () => { return true;},
  onLoadEnd = () => {return true;},
  ...otherProps}) => {

  const [imageUrl, setImageUrl] = useState(source);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setImageUrl({uri: path});
  }, [path, source]);

  let path = get(source, 'uri', get(source, 'url', null));
  let extension = null;
  let mergedStyle = {};
  if (style && Array.isArray(style)) {
    mergedStyle = Object.assign({}, ...style);
  } else {
    mergedStyle = Object.assign({}, style);
  }

  if (get(mergedStyle, 'width') === undefined) {delete mergedStyle.width;}
  if (get(mergedStyle, 'height') === undefined) {delete mergedStyle.height;}

  if (path) {
    path = path.toString();
    extension = path.split('.').pop();
  }

  if (!extension && (source?.uri || source?.url) && typeof source !== 'number') {
    return null;
  }

  if (extension === 'svg') {
    return <View testID={testID}>
      <View
        style={[
          absoluteFill ? StyleSheet.absoluteFill : {},
          styles.svgWrapper,
          ...style,
        ]}>
        <SvgCssUri width="100%" height="100%" uri={path} />
      </View>
    </View>;
  }

  if (typeof source === 'number') {
    console.info('Imager typeof source === "number"', source);
    return <Image testID={testID} source={source} style={mergedStyle} resizeMode={resizeMode} {...otherProps} />;
  }

  delete mergedStyle.resizeMode;
  // clearCache();

  return (
    <View testID={testID}>
      <TurboImage
      source={imageUrl}
      resizeMode={resizeMode}
      style={mergedStyle}
      onSuccess={event => {
        setImageDimensions({
          width: get(event, 'nativeEvent.width'),
          height: get(event, 'nativeEvent.height'),
        });
      }}
      onCompletion={el => {
        onLoadEnd();
      }}
      onFailure={event => {
        onLoadError(event);
        if (errorCount < 2) {
          const url = get(imageUrl, 'uri', imageUrl);
          if (url) {
            if (url.includes('?') || url.includes('&')) {
              setImageUrl({uri: url + '&retry=1'});
              return;
            }
            if (!url.endsWith('/')) {
              setImageUrl({uri: url + '/'});
            } else {
              setImageUrl({uri: url.slice(0, -1)});
            }
          }
          setErrorCount(errorCount + 1);
        }
      }}
      {...otherProps}
      />
    </View>
  );
};

export default Imager;
