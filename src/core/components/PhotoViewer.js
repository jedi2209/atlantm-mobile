import React, { Component } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';

// helpers
import PropTypes from 'prop-types';

// components
import Gallery from 'react-native-image-gallery';
import { Icon } from 'native-base';

import styleConst from '@core/style-const';

class PhotoViewer extends Component {
  static propTypes = {
    index: PropTypes.number,
    visible: PropTypes.bool,
    counter: PropTypes.bool,
    // items: PropTypes.arrayOf(PropTypes.shape({
    //   source: { uri: PropTypes.string },
    // })),
    onChange: PropTypes.func,
    onPressClose: PropTypes.func,
  }

  static defaultProps = {
    counter: true,
  }

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
        <Text style={styles.countText}>{this.props.index + 1} / {this.props.items.length}</Text>
      </View>
    );
  }

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onPressClose}
      >
        <Gallery
          style={styles.gallery}
          images={this.props.items}
          errorComponent={this.renderError}
          onPageSelected={this.props.onChange}
          initialPage={this.props.index}
        />
        {this.props.counter ? this.galleryCount : null}
        <TouchableOpacity style={styles.close} onPress={this.props.onPressClose}>
          <Icon name="close" type="MaterialIcons" size={26} color='#fff' />
        </TouchableOpacity>
      </Modal>
    );
  }
}

const backgroundColor = 'rgba(0,0,0,0.3)';
const styles = StyleSheet.create({
  gallery: {
    flex: 1,
    backgroundColor: styleConst.color.darkBg,
  },
  count: {
    top: 15,
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
    color: 'white',
    fontSize: 18,
    fontFamily: styleConst.font.regular,
  },
  close: {
    top: 15,
    left: 15,
    position: 'absolute',
    zIndex: 1,
    backgroundColor,
    borderRadius: 50,
    padding: 5,
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
