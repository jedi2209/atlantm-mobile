/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {useSelector} from 'react-redux';
import {TouchableWithoutFeedback, View, Text, StyleSheet} from 'react-native';
import {Pressable} from 'native-base';
import * as NavigationService from '../../navigation/NavigationService';

import Badge from '../../core/components/Badge';
import Imager from '../components/Imager';

import {strings} from '../../core/lang/const';
import RNBounceable from '@freakycoder/react-native-bounceable';

const styles = StyleSheet.create({
  slide: {
    paddingBottom: 20,
  },
  image: {
    resizeMode: 'cover',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  badge: {
    flexDirection: 'row',
    marginTop: 3,
  },
  title: {
    fontSize: 20,
    color: '#000000',
    letterSpacing: 0.25,
    textAlign: 'left',
    lineHeight: 26,
    fontWeight: 'bold',
  },
  titleRound: {
    fontSize: 12,
    fontWeight: 'normal',
    paddingHorizontal: 10,
    paddingVertical: 10,
    lineHeight: 16,
  },
});

const ImageWrapper = props => {
  if (props.pressable) {
    return <RNBounceable {...props} />;
  } else {
    return <View {...props} />;
  }
};

const MainWrapper = props => {
  if (props.bounceable) {
    return <RNBounceable {...props} />;
  } else {
    return <Pressable {...props} />;
  }
}

const Offer = ({
  data,
  height,
  cardWidth,
  theme,
  bounceable,
  imageStyle,
  imagePressable,
}) => {
  const currLang = useSelector(state => state.core.language.selected);
  const params = {
    id: data.item.id,
    date: data.item.date,
    type: data.item?.type,
  };
  return (
    <MainWrapper
      testID="OfferItemWrapper"
      onPress={() => {
        NavigationService.navigate('InfoPostScreen', params);
      }}
      bounceable={bounceable}
      style={{width: cardWidth}}>
      {data.item.img.main ? (
        <ImageWrapper
          pressable={imagePressable}
          onPress={() => {
            NavigationService.navigate('InfoPostScreen', params);
          }}>
          <Imager
            key={'id' + data.item.img.main}
            source={{uri: data.item.img.main}}
            style={[
              styles.image,
              {
                width: cardWidth,
                height: height,
              },
              imageStyle,
            ]}
          />
        </ImageWrapper>
      ) : null}
      <Text
        numberOfLines={3}
        style={[
          styles.title,
          {
            paddingHorizontal: theme === 'round' ? 10 : 0,
          },
        ]}>
        {data.item.name}
      </Text>
      {data.item.type?.badge ? (
        <View
          style={[
            styles.badge,
            {
              paddingHorizontal: theme === 'round' ? 9 : 0,
            },
          ]}>
          <Badge
            id={params.id}
            key={'badgeItem' + params.id}
            index={0}
            bgColor={params.type.badge?.background}
            name={params.type.name[currLang]}
            textColor={params.type.badge?.color}
          />
        </View>
      ) : null}
      {theme === 'round' && (
        <Text style={[styles.title, styles.titleRound]}>
          {data.item.announce}
        </Text>
      )}
    </MainWrapper>
  );
};

Offer.defaultProps = {
  imagePressable: false,
  bounceable: false,
};

export default Offer;
