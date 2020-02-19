/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  TouchableWithoutFeedback,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';

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

export const Offer = props => {
  const {data, height, cardWidth} = props;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.navigation('InfoPostScreen', {
          id: data.item.id,
          date: data.item.date,
        });
      }}
      style={[styles.slide, {width: cardWidth}]}>
      <View
        style={{
          width: cardWidth,
        }}>
        <Imager
          source={{uri: data.item.img.main}}
          style={[
            styles.image,
            {
              width: cardWidth,
              height,
              resizeMode: 'cover',
            },
          ]}
        />
        <Text
          numberOfLines={3}
          style={[
            styles.title,
            {
              paddingHorizontal: props.theme === 'round' ? 10 : 0,
            },
          ]}>
          {data.item.name}
        </Text>
        {props.theme === 'round' && (
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
