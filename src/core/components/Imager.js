import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

// components
import {Image, View, ActivityIndicator, StyleSheet} from 'react-native';
import {SvgCssUri} from 'react-native-svg';
import styleConst from '../style-const';
import {verticalScale} from '../../utils/scale';

const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(50),
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

const Imager = (props) => {
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
          <SvgCssUri
            width="100%"
            height="100%"
            uri={path}
          />
        </View>
      ) : (
        <>
          <Image
            {...props}
            source={{
              uri: path,
              headers: {
                Pragma: 'no-cache'
              },
              cache: 'reload'
            }}
            onError={({ nativeEvent: {error} }) => {
              console.log('Image error', error);
              setLoading(false);
            }}
            onLoadStart={() => {
              setLoading(true);
            }}
            onLoadEnd={() => {
              setLoading(false);
            }}
            >
            {props.children}
          </Image>
          <ActivityIndicator
            animating={isLoading}
            color={styleConst.color.blue}
            style={styles.loader}
          />
        </>
      )}
    </View>
  );
}

Imager.propTypes = {
  source: PropTypes.shape({
    uri: PropTypes.string.isRequired,
  }).isRequired,
};

Imager.defaultProps = {
  testID: 'Imager.Wrapper',
};

export default Imager;
