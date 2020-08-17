import React, {Component} from 'react';
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
import GallerySwiper from 'react-native-gallery-swiper';
import {Icon} from 'native-base';

import styleConst from '../style-const';

class PhotoViewer extends Component {
  static propTypes = {
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

  static defaultProps = {
    counter: true,
  };

  renderError() {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Не удалось загрузить фото</Text>
      </View>
    );
  }

  get galleryCount() {
    return (
      <View style={styles.count}>
        <Text style={styles.countText}>
          {this.props.index + 1} / {this.props.items.length}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onPressClose}>
        <GallerySwiper
          images={this.props.items}
          // Change this to render how many items before it.
          initialNumToRender={2}
          // Turning this off will make it feel faster
          // and prevent the scroller to slow down
          // on fast swipes.
          // sensitiveScroll={false}
          enableScale={this.props.enableScale ? this.props.enableScale : false}
          onPageSelected={this.props.onChange}
          style={styles.gallery}
        />
        {this.props.counter ? this.galleryCount : null}
        <TouchableOpacity
          style={styles.close}
          onPress={this.props.onPressClose}>
          <Icon style={styles.closeIcon} name="close" type="MaterialIcons" />
        </TouchableOpacity>
      </Modal>
    );
  }
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

export default PhotoViewer;
