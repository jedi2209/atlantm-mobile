import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

// helpers
import PropTypes from 'prop-types';

// components
import {
  StandaloneGallery,
  GalleryItemType,
  StandaloneGalleryHandler,
} from 'react-native-gallery-toolkit';

import GallerySwiper from 'react-native-gallery-swiper';
import {Icon} from 'native-base';

import styleConst from '../style-const';
import {strings} from '../../core/lang/const';

const _renderError = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{strings.PhotoViewer.errorLoad}</Text>
  </View>
);

const galleryCount = (index, length) => (
  <View style={styles.count}>
    <Text style={styles.countText}>
      {index + 1} / {length}
    </Text>
  </View>
);

const PhotoViewer = ({items, index, onPressClose, enableScale, onChange}) => {
  const [visible, setVisible] = useState(false);
  const [counter, setCounter] = useState(true);
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onPressClose}>
      <GallerySwiper
        images={items}
        // Change this to render how many items before it.
        initialNumToRender={2}
        // Turning this off will make it feel faster
        // and prevent the scroller to slow down
        // on fast swipes.
        // sensitiveScroll={false}
        enableScale={enableScale}
        onPageSelected={onChange}
        style={styles.gallery}
      />
      {counter ? galleryCount(index, items.length) : null}
      <TouchableOpacity
        style={styles.close}
        onPress={onPressClose}>
        <Icon style={styles.closeIcon} name="close" type="MaterialIcons" />
      </TouchableOpacity>
    </Modal>
  );
}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const positionTop = STATUSBAR_HEIGHT + 15;
const color = styleConst.color.blue;
const backgroundColor = 'rgba(255,255,255,1)';

const styles = StyleSheet.create({
  gallery: {
    flex: 1,
    backgroundColor: 'black',
  },
  count: {
    top: positionTop,
    right: 15,
    position: 'absolute',
    alignSelf: 'flex-end',
    zIndex: 1,
    backgroundColor,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  countText: {
    color,
    fontSize: 18,
    fontFamily: styleConst.font.regular,
  },
  close: {
    top: positionTop,
    left: 15,
    position: 'absolute',
    zIndex: 1,
    backgroundColor,
    borderRadius: 50,
    padding: 8,
  },
  closeIcon: {
    color,
    fontSize: 22,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: styleConst.color.darkBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'white',
    fontStyle: 'italic',
    fontSize: 18,
    fontFamily: styleConst.font.regular,
  },
});

PhotoViewer.defaultProps = {
  counter: true,
  enableScale: false,
};

PhotoViewer.propTypes = {
  index: PropTypes.number,
  visible: PropTypes.bool,
  counter: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.shape({
        uri: PropTypes.string,
      }),
    }),
  ),
  enableScale: PropTypes.bool,
  onChange: PropTypes.func,
  onPressClose: PropTypes.func,
};

export default PhotoViewer;
