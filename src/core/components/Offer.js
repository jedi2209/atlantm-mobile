/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {useSelector} from 'react-redux';
import {TouchableWithoutFeedback, View, Text, StyleSheet} from 'react-native';
import * as NavigationService from '../../navigation/NavigationService';

import Badge from '../../core/components/Badge';
import Imager from '../components/Imager';

import {strings} from '../../core/lang/const';

const styles = StyleSheet.create({
  slide: {
    borderBottomColor: '#D7D8DA',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingBottom: 20,
  },
  image: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  title: {
    fontSize: 20,
    color: '#000000',
    letterSpacing: 0.25,
    textAlign: 'left',
    lineHeight: 26,
    fontWeight: 'bold',
  },
});

export const Offer = ({data, height, cardWidth, theme}) => {
  const currLang = useSelector((state) => state.core.language.selected);
  const params = {
    id: data.item.id,
    date: data.item.date,
    type: data.item?.type,
  };
  return (
    <TouchableWithoutFeedback
      testID='OfferItemWrapper'
      onPress={() => {
        NavigationService.navigate('InfoPostScreen', params);
      }}
      style={[styles.slide, {width: cardWidth}]}>
      <View
        style={{
          width: cardWidth,
        }}>
        {data.item.img.main ? (
          <Imager
            key={'id' + data.item.img.main}
            source={{uri: data.item.img.main}}
            style={[
              styles.image,
              {
                width: cardWidth,
                height: height,
                resizeMode: 'cover',
              },
            ]}
          />
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
            style={{
              flexDirection: 'row',
              marginTop: 3,
              paddingHorizontal: theme === 'round' ? 9 : 0,
            }}>
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
          <Text
            style={[
              styles.title,
              {
                fontSize: 12,
                fontWeight: 'normal',
                paddingHorizontal: 10,
                paddingVertical: 10,
                lineHeight: 16,
              },
            ]}>
            {data.item.announce}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
