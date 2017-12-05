import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

// helpers
import styleConst from '../../../core/style-const';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: styleConst.ui.horizontalGapInList,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    marginBottom: 7,
    color: '#000',
  },
  text: {
    fontSize: 16,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
});

export default class ReviewDealerAnswer extends Component {
  static propTypes = {
    text: PropTypes.string,
  }

  static defaultProps = {
    text: '',
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ответ автоцентра</Text>
        <Text style={styles.text}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}
