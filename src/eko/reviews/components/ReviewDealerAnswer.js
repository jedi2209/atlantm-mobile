import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';

// helpers
import styleConst from '../../../core/style-const';
import {strings} from '../../../core/lang/const';

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: styleConst.ui.horizontalGapInList,
    paddingBottom: 20,
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    backgroundColor: 'white',
    marginBottom: 10,
    marginHorizontal: 7,
    borderRadius: 5,
    padding: 10,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
    marginBottom: 7,
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  text: {
    fontSize: 16,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
  },
});

export default class ReviewDealerAnswer extends Component {
  static propTypes = {
    text: PropTypes.string,
  };

  static defaultProps = {
    text: '',
  };

  render() {
    return (
      <View style={[styleConst.shadow.default, styles.container]}>
        <Text style={styles.title}>
          {strings.ReviewDealerAnswer.dealerAnswer}
        </Text>
        <Text style={styles.text}>{this.props.text}</Text>
      </View>
    );
  }
}
