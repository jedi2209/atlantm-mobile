import React, { Component } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Text, ListItem, Body, Right, Icon } from 'native-base';

// components
import DeviceInfo from 'react-native-device-info';
import { NavigationActions } from 'react-navigation';
import Imager from '../components/Imager';

// helpers
import { get } from 'lodash';
import PropTypes from 'prop-types';
import styleConst from '../../core/style-const';
import stylesList from '../../core/components/Lists/style';
import { DEALER__SUCCESS, DEALER__FAIL } from '../../dealer/actionTypes';

const styles = StyleSheet.create({
  brands: {
    flexDirection: 'row',
    marginTop: 3,
  },
  brandLogo: {
    minWidth: 24,
    height: 20,
    marginRight: 4,
  },
  city: {
    fontFamily: styleConst.font.regular,
    fontSize: 17,
  },
  name: {
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    fontSize: 17,
  },
  iconCheck: {
    fontSize: 30,
    color: styleConst.color.systemBlue,
  },
});

export default class SelectItemByCountry extends Component {
  static propTypes = {
    item: PropTypes.object,
    navigation: PropTypes.object,
    selectItem: PropTypes.func,
    itemLayout: PropTypes.string,
    selectedItem: PropTypes.object,
    returnScreen: PropTypes.string,
    onSelect: PropTypes.func,
  }

  onPressDealerItem = () => {
    const { navigation, returnScreen, selectItem, item, isGoBack, onSelect, selectedItem } = this.props;
    const mainScreen = DeviceInfo.isTablet() ? 'ContactsScreen' : 'MenuScreen';

    selectItem({ dealerBaseData: item, dealerSelected: selectedItem })
      .then((action) => {
        if (action.type === DEALER__SUCCESS) {
          if (onSelect) {
            onSelect({
              newDealer: get(action, 'payload.newDealer'),
              prevDealer: get(action, 'payload.prevDealer'),
            });
          }

          if (['ProfileScreen', 'RegisterScreen', 'ReviewsScreen'].indexOf(returnScreen) !== -1) {
            return navigation.goBack();
          }

          const resetAction = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({ routeName: returnScreen || mainScreen }),
            ],
          });
          navigation.dispatch(resetAction);
        }

        if (action.type === DEALER__FAIL) {
          Alert.alert('Ошибка', 'Не удалось получить данные по выбранному автоцентру, попробуйте снова');
        }
      });
  }

  onPressCityItem = () => {
    const { navigation, returnScreen, selectItem, item } = this.props;
    const mainScreen = DeviceInfo.isTablet() ? 'ContactsScreen' : 'MenuScreen';

    selectItem(item);
    navigation.goBack();
  }

  renderDealer = () => {
    const { item, selectedItem } = this.props;

    return (
      <ListItem onPress={this.onPressDealerItem} style={stylesList.listItem}>
        <Body>
          {item.city ? <Text style={styles.city}>{item.city.name}</Text> : null}
          {item.name ? <Text style={styles.name}>{item.name}</Text> : null}
        </Body>
        <Right>
          <View style={styles.brands} >
            {
              item.brands.map(brand => {
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
          {
            selectedItem.id === item.id ?
              <Icon name="ios-checkmark" style={styles.iconCheck} /> :
              null
          }
        </Right>
      </ListItem>
    );
  }

  renderCity = () => {
    const { item, selectedItem } = this.props;

    let existBrands = [];

    return (
      <ListItem onPress={this.onPressCityItem} style={stylesList.listItem}>
        <Body>
          {item.name ? <Text style={styles.city}>{item.name}</Text> : null}
          {
              item.dealers && item.dealers.length !== 0 ?
              (
                <View style={styles.brands}>
                  {item.dealers.map(dealer => {
                    return (
                      <View key={dealer.id} style={styles.brands} >
                        {
                          dealer.brands.map(brand => {
                            const name = brand.name === 'land rover' ? 'landrover' : brand.name;

                            if (existBrands.includes(name)) {
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
        </Body>
        <Right>
          {
            selectedItem.id === item.id ?
              <Icon name="ios-checkmark" style={styles.iconCheck} /> :
              null
          }
        </Right>
      </ListItem>
    );
  }

  render() {
    const { itemLayout } = this.props;

    return itemLayout === 'dealer' ?
      this.renderDealer() :
      this.renderCity();
  }
}
