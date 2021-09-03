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
  },
});

const Imager = props => {
  const [isLoading, setLoading] = useState(false);

  const path = props.source.uri.toString();
  const extension = path.split('.').pop();

  return (
    <View testID={props.testID}>
      {extension === 'svg' ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.svgWrapper,
            {...props.style},
          ]}>
          <SvgCssUri width="100%" height="100%" uri={path} />
        </View>
      ) : (
        <View
          shouldRasterizeIOS={isLoading ? true : false}
          renderToHardwareTextureAndroid={isLoading ? true : false}>
          {console.log('path', path, isLoading, props)}
          <View style={{opacity: isLoading ? 0.4 : 1}}>
            <FastImage
              {...props}
              source={{
                uri: path,
                priority: FastImage.priority[props.priority],
              }}
              resizeMode={FastImage.resizeMode[props.resizeMode]}
              onLoadStart={() => {
                setLoading(true);
              }}
              onError={() => {
                console.error('Image error');
                setLoading(false);
              }}
              onLoadEnd={() => {
                setLoading(false);
              }}
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

Imager.propTypes = {
  source: PropTypes.shape({
    uri: PropTypes.string.isRequired,
  }).isRequired,
};

Imager.defaultProps = {
  testID: 'Imager.Wrapper',
  priority: 'normal',
};

export default Imager;
