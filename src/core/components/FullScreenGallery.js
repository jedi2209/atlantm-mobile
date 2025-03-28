import React, {useState, useEffect} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Orientation, {
  useOrientationChange,
} from 'react-native-orientation-locker';
//import ImageView from 'react-native-image-viewing';
import Gallery from 'react-native-awesome-gallery';
import styleConst from '../style-const';
import {strings} from '../lang/const';
import {View, Text} from 'native-base';
import LogoLoader from './LogoLoader';
// import Imager from './Imager';

const FullScreenGallery = ({
  images = [],
  backgroundColor = styleConst.color.black,
  theme = 'black',
  imageIndex = 0,
  route,
}) => {
  const [loading, setLoading] = useState(true);
  const [currIndex, setIndex] = useState(imageIndex);

  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

  if (route?.params?.images) {
    images = route.params.images;
  }

  if (route?.params?.theme) {
    theme = route.params.theme;
  }

  if (route?.params?.imageIndex) {
    imageIndex = route.params.imageIndex;
  }

  let imagesClean = [];

  for (const [key, value] of Object.entries(images)) {
    imagesClean.push(value.uri);
  }

  switch (theme) {
    case 'black':
      break;
    case 'white':
      backgroundColor = styleConst.color.white;
      break;
  }

  useEffect(() => {
    Orientation.unlockAllOrientations();
  }, []);

  useOrientationChange(o => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });

  if (loading) {
    return <LogoLoader mode={'relative'} />;
  }

  return (
    <View style={{backgroundColor: backgroundColor}}>
      <Gallery
        data={imagesClean}
        initialIndex={imageIndex}
        // renderItem={({index, item, setImageDimensions}) => {
        //   return (
        //     <Imager source={{uri: item}} setImageDimensions={setImageDimensions} />
        //   );
        // }}
        loop={true}
        onIndexChange={newIndex => {
          setIndex(newIndex);
        }}
      />
      <View
        style={[
          styles.container,
          {width: screenWidth, top: screenHeight - 60},
        ]}>
        <View
          style={{
            backgroundColor: backgroundColor,
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
          }}>
          <Text style={[styles.captionText, styles['captionText' + theme]]}>
            {[
              currIndex + 1,
              strings.FullScreenGallery.from,
              images.length,
            ].join(' ')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 40,
    position: 'absolute',
    zIndex: 1000,
  },
  captionText: {
    fontFamily: styleConst.font.regular,
    fontSize: 16,
  },
  captionTextblack: {
    color: styleConst.color.systemGray,
    borderColor: styleConst.color.systemGray,
  },
  captionTextwhite: {
    color: styleConst.color.greyText4,
    borderColor: styleConst.color.greyText4,
  },
});

export default FullScreenGallery;
