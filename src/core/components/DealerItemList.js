import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {ListItem, Body, Right, Icon, StyleProvider, Text} from 'native-base';

// component
import Imager from '../components/Imager';
import BrandLogo from '../components/BrandLogo';

// helpers
import styleConst from '../../core/style-const';
import stylesList from '../../core/components/Lists/style';

const stylesDealerItemList = StyleSheet.create({
  brands: {
    flexDirection: 'row',
  },
  brandLogo: {
    minWidth: 24,
    height: 20,
    marginRight: 4,
  },
  dealerCity: {
    fontFamily: styleConst.font.light,
    fontSize: 14,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.greyText,
    marginLeft: 0,
  },
  city: {
    fontFamily: styleConst.font.regular,
    fontSize: 17,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  name: {
    fontFamily: styleConst.font.light,
    fontSize: 17,
    letterSpacing: styleConst.ui.letterSpacing,
    marginLeft: 0,
  },
});

export default class DealerItemList extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    city: PropTypes.shape({
      name: PropTypes.string,
    }),
    brands: PropTypes.array,
    returnScreen: PropTypes.string,
    goBack: PropTypes.bool,
    isLocal: PropTypes.bool,
  };

  static defaultProps = {
    city: null,
    brands: [],
    returnScreen: null,
    goBack: false,
    isLocal: false,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.dealer.name !== nextProps.dealer.name;
  }

  onPressDealer = () => {
    const {goBack, navigation, returnScreen, isLocal, listAll} = this.props;
    return navigation.navigate('ChooseDealerScreen', {
      returnScreen,
      goBack,
      isLocal,
      listAll,
    });
  };

  render() {
    const {city, dealer} = this.props;

    return (
      <View style={this.props.style || {}}>
        <ListItem last onPress={this.onPressDealer} style={stylesList.listItem}>
          <Body>
            {city && city.name ? (
              <Text
                style={stylesDealerItemList.city}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {city && city.name ? city.name : dealer.city.name}
              </Text>
            ) : null}
            {dealer.name ? (
              <View>
                <Text
                  style={stylesDealerItemList.name}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {dealer.name}
                </Text>
                <Text
                  style={stylesDealerItemList.dealerCity}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {dealer.city.name}
                </Text>
              </View>
            ) : null}
          </Body>
          <Right>
            <View style={stylesDealerItemList.brands}>
              {dealer.brands &&
                dealer.brands.length &&
                dealer.brands.map((brand) => {
                  if (brand.logo) {
                    return (
                      <BrandLogo
                        brand={brand.id}
                        width={35}
                        style={stylesDealerItemList.brandLogo}
                        key={'brandLogo' + brand.id}
                      />
                    );
                  }
                })}
            </View>
          </Right>
        </ListItem>
      </View>
    );
  }
}
