import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Body} from 'native-base';
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
  },
  name: {
    fontFamily: styleConst.font.regular,
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 10,
  },
  city: {
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    fontSize: 14,
  },
  iconCheck: {
    fontSize: 30,
    color: styleConst.color.systemBlue,
  },
  site: {
    fontSize: 12,
    color: '#A8ABBE',
    paddingVertical: 5,
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
    padding: 16,
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

const _getSite = (sites) => {
  if (typeof sites === 'undefined' || !sites) {
    return null;
  }

  if (typeof sites === 'string') {
    sites = sites.split('\r\n');
  }

  let res = [];

  sites.forEach((val) => {
    res.push(val.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]);
  });
  return res.join('\r\n');
};

const DealerCard = (props) => {
  const {item} = props;
  const CarImg = get(item, 'img.10000x440');
  const sites = get(item, 'site');
  return (
    <Body style={styles.body} testID={`DealerCard_${item.id}`}>
      <View style={styles.bodyView}>
        {item.name ? <Text style={styles.name}>{item.name}</Text> : null}
        {item.city ? (
          <Text style={styles.city}>
            {item.city.name + ', ' + item.address}
          </Text>
        ) : null}
        <Text style={styles.site}>{_getSite(sites)}</Text>
        <View style={styles.brands}>
          {item.brands &&
            item.brands.length &&
            item.brands.map((brand) => {
              return (
                <BrandLogo
                  brand={brand.id}
                  height={25}
                  style={styles.brandLogo}
                  key={'brandLogo' + brand.id}
                />
              );
            })}
        </View>
      </View>
      {CarImg ? (
        <View style={styles.thumb}>
          <Imager
            key={`dealer-cover-' + ${item.id}`}
            style={styles.image}
            resizeMode="cover"
            source={{uri: CarImg}}
          />
        </View>
      ) : null}
    </Body>
  );
};

export default DealerCard;
