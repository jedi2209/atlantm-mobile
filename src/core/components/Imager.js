import React, {useState} from 'react';

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

  // const [isLoading, setLoading] = useState(false);
  const [imageSize, setImageSize] = useState({width: 0, height: 0});

  let path = get(source, 'uri', get(source, 'url', null));
  let extension = null;
  let mergedStyle = style;
  let sourceNew = source;

  if (typeof source !== 'number') {
    // if source is not require('../../../*.jpg') image
    // console.info('Imager path', path);
    if (path) {
      path = path.toString();
      extension = path.split('.').pop();
      sourceNew = {uri: path};
    }
    // console.info('Imager extension', extension);
    if (!extension && (source?.uri || source?.url)) {
      return null;
    }
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

  if (style.length) {
    mergedStyle = Object.assign({}, ...style);
  }

  if (get(mergedStyle, 'width') === undefined) {
    delete mergedStyle.width;
  }

  if (get(mergedStyle, 'height') === undefined) {
    delete mergedStyle.height;
  }

  delete mergedStyle.resizeMode;
  // clearCache();

  if (typeof source !== 'number') {
    return (
      <View testID={testID}>
        <TurboImage
        source={sourceNew}
        resizeMode={resizeMode}
        style={mergedStyle}
        onSuccess={event => {
          // console.info('onSuccess', get(event, 'nativeEvent'));
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
        }}
        {...otherProps}
        />
      </View>
    );
  } else {
    return (<Image testID={testID} source={sourceNew} style={mergedStyle} resizeMode={resizeMode} {...otherProps} />);
  }
};

export default Imager;

{/* <FasterImageView
  style={mergedStyle}
  showActivityIndicator={true}
  onSuccess={(event) => {
    console.log('onSuccess', get(event, 'nativeEvent'));
  }}
  onError={(event) => {
    console.log('\tImager => error load image\t' + path);
      onLoadError(event);
      // setLoading(false);
  }}
  source={{
    url: path,
    transitionDuration: 0.3,
    progressiveLoadingEnabled: true,
    cachePolicy: 'memory',
    showActivityIndicator: true,
    resizeMode,
  }}
  {...otherProps}
/> */}

{/* <View shouldRasterizeIOS={isLoading} renderToHardwareTextureAndroid={isLoading}>
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
    /> </View> </View> */}
