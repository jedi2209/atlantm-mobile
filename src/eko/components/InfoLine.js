import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet} from 'react-native';
import {Icon} from 'native-base';

// helpers
import styleConst from '../../core/style-const';

const iconSize = 28;

const styles = StyleSheet.create({
  container: {
    marginTop: styleConst.ui.horizontalGap,
    paddingHorizontal: styleConst.ui.horizontalGap,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: styleConst.ui.horizontalGap + 5,
    top: 0,
    width: iconSize,
    height: iconSize,
    color: styleConst.color.greyText2,
  },
  textContainer: {
    marginLeft: 48,
  },
  text: {
    color: styleConst.color.greyText3,
    fontSize: styleConst.ui.smallTextSize,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
  },
  gap: {
    marginBottom: styleConst.ui.footerHeight,
  },
});

export default class InfoLine extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    infoIcon: PropTypes.bool,
    gap: PropTypes.bool,
  };

  render() {
    const {gap, text, infoIcon} = this.props;

    if (!text) {
      return null;
    }

    return (
      <View style={[styles.container, gap ? styles.gap : null]}>
        {infoIcon ? (
          <Icon name="ios-information-circle-outline" style={styles.icon} />
        ) : null}
        <View style={styles.textContainer}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    );
  }
}
