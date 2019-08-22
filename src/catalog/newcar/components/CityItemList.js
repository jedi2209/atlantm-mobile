import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Body, Right, Icon, StyleProvider, Text } from 'native-base';

// component
import Imager from '../../../core/components/Imager';

// helpers
import PropTypes from 'prop-types';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesList from '../../../core/components/Lists/style';

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

export default class CityItemList extends Component {
  static propTypes = {
    cityName: PropTypes.string,
    cityData: PropTypes.object,
    navigation: PropTypes.object,
    returnScreen: PropTypes.string,
  }

  static defaultProps = {
    cityName: null,
    cityData: null,
    returnScreen: null,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.name !== nextProps.name;
  }

  onPressDealer = () => {
    const { navigation, returnScreen } = this.props;
    return navigation.navigate('NewCarCityScreen', { returnScreen });
  }

  render() {
    const {
      cityData,
      cityName,
    } = this.props;

    let existBrands = [];

    return (
      <StyleProvider style={getTheme()}>
        <View style={stylesList.listItemContainer}>
          <ListItem last onPress={this.onPressDealer} style={stylesList.listItem}>
            <Body>
              <Text style={styles.city}>Город</Text>
              <Text style={styles.name}>{cityName}</Text>
            </Body>
            <Right>
              <View style={styles.brands}>
              {
                cityData && cityData.dealers && cityData.dealers.length !== 0 ?
                (
                  <View style={styles.brands}>
                    {cityData.dealers.map(dealer => {
                      if (dealer.virtual !== false) { // фикс для НЕ вывода виртуальных КО в списке
                        return true;
                      }
                      return (
                        <View key={dealer.id} style={styles.brands} >
                          {
                            dealer.brands.map(brand => {
                              const name = brand.name === 'land rover' ? 'landrover' : brand.name;

                              if (existBrands.includes(name) || dealer.virtual !== false) {
                                return null;
                              } else {
                                existBrands.push(name);
                              }

                              return (
                                <Imager
                                  resizeMode="contain"
                                  key={brand.id}
                                  style={styles.brandLogo}
                                  source={{ uri: brand.logo }}
                                />
                              );
                            })
                          }
                        </View>
                      );
                    })
                  }
                  </View>
                ) :
                null
                }
              </View>
              <Icon name="arrow-forward" style={stylesList.iconArrow} />
            </Right>
          </ListItem>
        </View>
      </StyleProvider>
    );
  }
}
