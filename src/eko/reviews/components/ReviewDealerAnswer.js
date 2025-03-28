import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import {View, Box} from 'native-base';

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
    backgroundColor: styleConst.color.white,
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
    color: styleConst.color.greyText2,
  },
});

export default class ReviewDealerAnswer extends Component {
  static defaultProps = {
    text: '',
  };

  render() {
    return (
      <Box
        shadow={3}
        p={2}
        pb={2}
        mb={10}
        mx={3}
        borderRadius={5}
        backgroundColor={styleConst.color.white}>
        <Text style={styles.title}>
          {strings.ReviewDealerAnswer.dealerAnswer}
        </Text>
        <Text style={styles.text}>{this.props.text}</Text>
      </Box>
    );
  }
}
