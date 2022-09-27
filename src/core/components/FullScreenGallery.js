import React, {useState, useEffect} from 'react';
import {StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import Orientation, {
  useDeviceOrientationChange,
  useOrientationChange,
} from 'react-native-orientation-locker';
//import ImageView from 'react-native-image-viewing';
import Gallery from 'react-native-awesome-gallery';
import styleConst from '../style-const';
import {strings} from '../lang/const';
import {View, Text, Spinner} from 'native-base';

const FullScreenGallery = ({
  navigation,
  route,
  imageIndex,
  images,
  backgroundColor,
  theme,
}) => {
  const [visible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currIndex, setIndex] = useState(imageIndex);

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
    Orientation.lockToLandscapeLeft();
    //Orientation.unlockAllOrientations();
  });

  // useDeviceOrientationChange(o => {
  //   // alert(1);
  //   console.error(o);
  //   // Handle device orientation change
  // });

  useOrientationChange(o => {
    if (o === 'LANDSCAPE-LEFT') {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  });

  if (loading) {
    return (
      <View justifyContent="center" alignItems="center" flex={1}>
        <Spinner size="lg" color={styleConst.color.blue} />
      </View>
    );
  }

  return (
    <View style={{backgroundColor: backgroundColor}}>
      <Gallery
        data={imagesClean}
        initialIndex={imageIndex}
        loop={true}
        onIndexChange={newIndex => {
          setIndex(newIndex);
        }}
      />
      <View style={styles.container}>
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

  return (
    <ImageView
      images={images}
      backgroundColor={backgroundColor}
      imageIndex={imageIndex}
      visible={visible}
      presentationStyle={'overFullScreen'}
      swipeToCloseEnabled={false}
      onRequestClose={() => {
        setIsVisible(false);
        navigation.goBack();
      }}
      FooterComponent={({imageIndex}) => {
        return (
          <View style={styles.container}>
            <Text style={[styles.captionText, styles['captionText' + theme]]}>
              {[
                imageIndex + 1,
                strings.FullScreenGallery.from,
                images.length,
              ].join(' ')}
            </Text>
          </View>
        );
      }}
    />
  );
};

FullScreenGallery.defaultProps = {
  images: [],
  backgroundColor: styleConst.color.black,
  theme: 'black',
  imageIndex: 0,
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 40,
    width: screenWidth,
    position: 'absolute',
    top: screenHeight - 60,
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
