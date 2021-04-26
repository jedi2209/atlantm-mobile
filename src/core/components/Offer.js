/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {TouchableWithoutFeedback, View, Text, StyleSheet} from 'react-native';
import * as NavigationService from '../../navigation/NavigationService';

import Imager from '../components/Imager';

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
  const params = {
    id: data.item.id,
    date: data.item.date,
  };
  return (
    <TouchableWithoutFeedback
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
