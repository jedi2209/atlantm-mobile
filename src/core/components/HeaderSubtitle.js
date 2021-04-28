import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';

// helpers
import styleConst from '../style-const';
import {verticalScale} from '../../utils/scale';

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.header,
    paddingBottom: verticalScale(5),

    ...Platform.select({
      ios: {
        marginBottom: 0.3,
        borderBottomWidth: styleConst.ui.borderWidth,
        borderBottomColor: styleConst.color.border,
      },
      android: {
        marginTop: 15,
        marginBottom: 10,
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
      },
    }),
  },
  text: {
    fontSize: 18,
    color: styleConst.color.greyText4,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
    textAlign: 'center',
  },
  bigText: {
    fontFamily: styleConst.font.regular,
    marginVertical: 10,
  },
});

export default class HeaderSubtitle extends Component {
  renderText = (text) => (
    <Text
      key={text}
      style={[styles.text, this.props.isBig ? styles.bigText : {}]}>
      {text}
    </Text>
  );

  render() {
    const {content} = this.props;

    return (
      <View style={styles.container}>
        {Array.isArray(content)
          ? content.map((item) => this.renderText(item))
          : this.renderText(content)}
      </View>
    );
  }
}
