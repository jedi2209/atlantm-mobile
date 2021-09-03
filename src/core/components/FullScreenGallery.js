import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ImageView from 'react-native-image-viewing';
import styleConst from '../style-const';

const FullScreenGallery = ({
  navigation,
  route,
  imageIndex,
  images,
  backgroundColor,
  theme,
}) => {
  const [visible, setIsVisible] = useState(true);

  if (route?.params?.images) {
    images = route.params.images;
  }

  if (route?.params?.theme) {
    theme = route.params.theme;
  }

  if (route?.params?.imageIndex) {
    imageIndex = route.params.imageIndex;
  }

  switch (theme) {
    case 'black':
      break;
    case 'white':
      backgroundColor = styleConst.color.white;
      break;
  }

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
              {imageIndex + 1} из {images.length}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 30,
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
