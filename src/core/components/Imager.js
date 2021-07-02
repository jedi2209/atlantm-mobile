import React, {useState} from 'react';
import PropTypes from 'prop-types';

// components
import {Image, View, ActivityIndicator, StyleSheet} from 'react-native';
import {SvgCssUri} from 'react-native-svg';
import styleConst from '../style-const';
import {verticalScale} from '../../utils/scale';

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(60),
  },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Imager = (props) => {
  [isLoading, setLoading] = useState(true);

  const path = props.source.uri.toString();
  const extension = path.split('.').pop();
  console.log('Imager path', extension, path);
  if (extension === 'svg') {
    setLoading(false);
  }

  return (
    <View testID={props.testID}>
      <ActivityIndicator
        animating={isLoading}
        color={styleConst.color.blue}
        style={styles.loader}
      />
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
        <Image
          {...props}
          source={{
            uri: path,
            headers: {
              Pragma: 'no-cache'
            },
            cache: 'only-if-cached'
          }}
          onError={({ nativeEvent: {error} }) => {
            console.log('Image error', error);
          }}
          onLoadEnd={() => {
            setLoading(false);
          }}>
          {props.children}
        </Image>
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
