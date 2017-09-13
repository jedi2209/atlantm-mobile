import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import {
  ListItem,
  Body,
  Right,
  Icon,
  StyleProvider,
  Text,
} from 'native-base';
import { CachedImage } from 'react-native-cached-image';

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
    city: PropTypes.shape({
      name: PropTypes.string,
    }),
    name: PropTypes.string,
    brands: PropTypes.array,
    returnScreen: PropTypes.string,
  }

  static defaultProps = {
    city: null,
    name: null,
    brands: [],
    returnScreen: null,
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.name !== nextProps.name) return true;

    return false;
  }

  onPressDealer = () => {
    return this.props.navigation.navigate('ChooseDealerScreen', { returnScreen: this.props.returnScreen });
  }

  render() {
    const {
      navigation,
      city,
      name,
      brands,
      returnScreen,
    } = this.props;

    return (
      <StyleProvider style={getTheme()}>
        <View style={styles.container}>
          <ListItem
            onPress={this.onPressDealer}
            style={styles.listItem}
          >
            <Body
              style={styles.listItemBody}
            >
              {city && city.name ? <Text style={styles.city}>{city.name}</Text> : null}
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
