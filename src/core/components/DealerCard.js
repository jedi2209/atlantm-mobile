import React from 'react';
import {View, StyleSheet} from 'react-native';
import {HStack, Text} from 'native-base';
import Imager from '../components/Imager';
import BrandLogo from '../../core/components/BrandLogo';

import styleConst from '../../core/style-const';
import {get} from 'lodash';

const styles = StyleSheet.create({
  brands: {
    flexDirection: 'row',
    marginTop: 3,
  },
  brandLogo: {
    marginRight: 10,
    height: 25,
    width: 40,
  },
  name: {
    fontFamily: styleConst.font.regular,
    fontSize: 15,
  },
  city: {
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    fontSize: 14,
    marginLeft: 0,
  },
  iconCheck: {
    fontSize: 30,
    color: styleConst.color.systemBlue,
  },
  site: {
    fontSize: 12,
    color: '#A8ABBE',
    paddingVertical: 5,
    marginLeft: 0,
  },
  image: {
    width: '100%',
    height: 110,
    borderRadius: 5,
  },
  body: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    backgroundColor: styleConst.color.white,
  },
  bodyView: {
    flexBasis: '60%',
  },
  thumb: {
    flexShrink: 1,
    flexBasis: '40%',
    marginLeft: 8,
  },
});

const _getSite = sites => {
  if (typeof sites === 'undefined' || !sites) {
    return null;
  }

  if (typeof sites === 'string') {
    sites = sites.split('\r\n');
  }

  let res = [];

  sites.forEach(val => {
    res.push(val.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]);
  });
  return res.join('\r\n');
};

const drawBrands = brands => {
  if (!brands || !brands.length) {
    return false;
  }
  return brands.map(brand => {
    return (
      <BrandLogo
        brand={brand.id}
        height={25}
        style={styles.brandLogo}
        key={'brandLogo' + brand.id}
      />
    );
  });
};

const drawCity = cityArr => {
  if (!cityArr || !cityArr.length) {
    return false;
  }
  let cities = [];
  cityArr.map(city => {
    cities.push(city.name);
  });
  return <Text style={styles.city}>{cities.join(', ')}</Text>;
};

const DealerCard = props => {
  const {item} = props;

  const CarImg = get(item, 'img[0]');
  const hash = get(item, 'hash');
  const brands = get(item, 'brands', []);
  const name = get(item, 'name');

  return (
    <HStack alignItems="flex-start" p="2" borderRadius="md">
      <View style={styles.bodyView}>
        {name ? (
          <Text mt="0.5" mb="2" style={styles.name}>
            {name}
          </Text>
        ) : null}
        <HStack mb="2">{drawBrands(brands)}</HStack>
        {drawCity(get(item, 'city', []))}
      </View>
      {CarImg ? (
        <View style={styles.thumb}>
          <Imager
            key={`dealer-cover-' + ${item.hash}`}
            style={styles.image}
            source={{
              uri: CarImg + '?d=500x500' + '&hash=' + hash,
              cache: 'web',
            }}
          />
        </View>
      ) : null}
    </HStack>
  );
};

export default DealerCard;
