import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Orientation from "react-native-orientation-locker";
//import ImageView from 'react-native-image-viewing';
import Gallery from 'react-native-awesome-gallery';
import styleConst from '../style-const';
import {strings} from '../lang/const';

const FullScreenGallery = ({
  navigation,
  route,
  imageIndex,
  images,
  backgroundColor,
  theme,
}) => {
  const [visible, setIsVisible] = useState(true);

  useEffect(() => {
    Orientation.unlockAllOrientations();
  });

  if (route?.params?.images) {
    images = route.params.images;
  }

  if (route?.params?.theme) {
    theme = route.params.theme;
  }

  if (route?.params?.imageIndex) {
    imageIndex = route.params.imageIndex;
  }

  const [currIndex, setIndex] = useState(imageIndex);

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

  return (
  <View style={{backgroundColor: backgroundColor}}>
    <Gallery
      data={imagesClean}
      initialIndex={imageIndex}
      loop={true}
      onIndexChange={(newIndex) => {
        setIndex(newIndex);
      }}
    />
    <View style={styles.container}>
      <Text style={[styles.captionText, styles['captionText' + theme]]}>
        {[
          currIndex + 1,
          strings.FullScreenGallery.from,
          images.length,
        ].join(' ')}
      </Text>
    </View>
  </View>);

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
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
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
