import React from 'react';
import { Text, StyleSheet } from 'react-native';

// components
import * as Animatable from 'react-native-animatable';

// helpers
import styleConst from '../../core/style-const';

const HEIGHT_TRIANGLE = 10;

const styles = StyleSheet.create({
  descriptionContainer: {
    zIndex: 1,
    backgroundColor: '#fff',
    marginTop: HEIGHT_TRIANGLE,
    paddingVertical: styleConst.ui.horizontalGap,
    paddingHorizontal: styleConst.ui.verticalGap,
    borderColor: styleConst.color.border,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  descriptionTitle: {
    fontSize: 19,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    marginBottom: 5,
    color: '#000',
  },
  descriptionText: {
    fontSize: 17,
    color: styleConst.color.greyText3,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
  },
});

let IndicatorDescription = ({ name, description }) => {
  return (
    <Animatable.View
      style={styles.descriptionContainer}
      animation="pulse"
      useNativeDriver={true}
      duration={300}
    >
      <Text style={styles.descriptionTitle}>{name}</Text>
      <Text style={styles.descriptionText}>{description}</Text>
    </Animatable.View>
  );
};

// IndicatorDescription = Animatable.createAnimatableComponent(IndicatorDescription);
export default IndicatorDescription;
