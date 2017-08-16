import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  ListItem,
  Body,
  Right,
  Icon,
  StyleProvider,
  Text,
} from 'native-base';
import CachedImage from 'react-native-cached-image';

import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  brands: {
    flexDirection: 'row',
  },
  brandLogo: {
    minWidth: 24,
    height: 20,
    marginRight: 4,
  },
  city: {
    fontFamily: styleConst.font.regular,
    fontSize: 17,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  name: {
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    fontSize: 17,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  listItem: {
    minHeight: 44,
    borderBottomWidth: 0,
  },
  iconArrow: {
    color: styleConst.color.systemGray,
  },
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.border,
  },
});

export default class DealerItemList extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    city: PropTypes.string,
    name: PropTypes.string,
    brands: PropTypes.array,
  }

  static defaultProps = {
    city: null,
    name: null,
    brands: [],
  }

  render() {
    const {
      navigation,
      city,
      name,
      brands,
    } = this.props;

    return (
      <StyleProvider style={getTheme()}>
        <View style={styles.container} >
          <ListItem
            onPress={() => {
              navigation.navigate('ChooseDealerScreen');
            }}
            style={styles.listItem}
          >
            <Body
              style={styles.listItemBody}
            >
              {city ? <Text style={styles.city}>{city}</Text> : null}
              {name ? <Text style={styles.name}>{name}</Text> : null}
            </Body>
            <Right>
              <View style={styles.brands} >
                {
                  brands.map(brand => {
                    return (
                      <CachedImage
                        resizeMode="contain"
                        key={brand.id}
                        style={styles.brandLogo}
                        source={{ uri: brand.logo }}
                      />
                    );
                  })
                }
              </View>
              <Icon
                name="arrow-forward"
                style={styles.iconArrow}
              />
            </Right>
          </ListItem>
        </View>
      </StyleProvider>
    );
  }
}
