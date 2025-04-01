import React, { useState, ReactNode } from 'react';
import { TouchableHighlight, View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import ModalView from './ModalView';

import { get } from 'lodash';

import styleConst from '../style-const';

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
    marginRight: 4,
  },
  badgeName: {
    fontFamily: styleConst.font.regular,
    fontSize: 12,
  },
});

interface BackgroundItemProps {
  bgColor?: string;
  badgeContainerStyle?: ViewStyle;
  children: ReactNode;
}

const BackgroundItem: React.FC<BackgroundItemProps> = ({
  bgColor = styleConst.color.greyText2,
  badgeContainerStyle = {},
  children,
}) => {
  if (bgColor.includes('linear-gradient(')) {
    const regexDeg = new RegExp('([0-9]*)deg', 'gmi');
    const regexColors = new RegExp('(#[\\w]*) ([\\-0-9.]*)%', 'gmi');

    let m;
    let linearSettings = {
      colors: {} as Record<number, string[]>,
      degree: 0,
    };

    while ((m = regexDeg.exec(bgColor)) !== null) {
      if (m.index === regexDeg.lastIndex) {
        regexDeg.lastIndex++;
      }
      m.forEach((match, groupIndex) => {
        if (groupIndex > 0) {
          linearSettings['degree'] = parseInt(match);
        }
      });
    }

    while ((m = regexColors.exec(bgColor)) !== null) {
      if (m.index === regexColors.lastIndex) {
        regexColors.lastIndex++;
      }
      m.forEach((match, groupIndex) => {
        if (groupIndex > 0) {
          if (!linearSettings['colors'][groupIndex]) {
            linearSettings['colors'][groupIndex] = [];
          }
          linearSettings['colors'][groupIndex].push(match);
        }
      });
    }

    return (
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        useAngle
        angle={get(linearSettings, 'degree', 0)}
        colors={get(linearSettings, 'colors.1', [])}
        style={[
          styles.badgeContainer,
          { backgroundColor: bgColor },
          badgeContainerStyle,
        ]}>
        {children}
      </LinearGradient>
    );
  } else {
    return (
      <View
        style={[
          styles.badgeContainer,
          { backgroundColor: bgColor },
          badgeContainerStyle,
        ]}>
        {children}
      </View>
    );
  }
};

interface BadgeProps {
  id?: string;
  index?: number;
  textColor?: string;
  bgColor?: string;
  textStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  description?: string | null;
  badgeContainerStyle?: ViewStyle;
  name?: string | null;
  onPress?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  textColor = 'black',
  bgColor,
  textStyle = {},
  descriptionStyle = {},
  description = null,
  badgeContainerStyle = {},
  name = null,
  onPress,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const onPressCustom = description
    ? () => setModalVisible(true)
    : onPress;

  return onPressCustom ? (
    <>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPressOut={onPressCustom}>
        <BackgroundItem
          bgColor={bgColor}
          badgeContainerStyle={badgeContainerStyle}>
          <Text
            selectable={false}
            style={[styles.badgeName, { color: textColor }, textStyle]}>
            {name}
          </Text>
        </BackgroundItem>
      </TouchableHighlight>
      <ModalView
        isModalVisible={isModalVisible}
        animationIn="slideInRight"
        animationOut="slideOutLeft"
        onHide={() => setModalVisible(false)}
        selfClosed={true}>
        <View style={{ padding: 10 }}>
          <Text
            ellipsizeMode="clip"
            style={[
              {
                fontSize: 18,
                marginBottom: 10,
                color: styleConst.color.greyText4,
              },
              descriptionStyle,
            ]}>
            {description}
          </Text>
        </View>
      </ModalView>
    </>
  ) : (
    <BackgroundItem bgColor={bgColor} badgeContainerStyle={badgeContainerStyle}>
      <Text
        selectable={false}
        style={[styles.badgeName, { color: textColor }, textStyle]}>
        {name}
      </Text>
    </BackgroundItem>
  );
};

export default Badge;
