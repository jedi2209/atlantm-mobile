import React, {Component} from 'react';
import {Alert, View, StyleSheet, Image} from 'react-native';
import {Text, ListItem, Body, Right, Icon, Left} from 'native-base';

// components
import DeviceInfo from 'react-native-device-info';
import {NavigationActions, StackActions} from 'react-navigation';
import Imager from '../components/Imager';

// helpers
import {get} from 'lodash';
import PropTypes, {array} from 'prop-types';
import styleConst from '../../core/style-const';
import stylesList from '../../core/components/Lists/style';
import {
  DEALER__SUCCESS,
  DEALER__SUCCESS__LOCAL,
  DEALER__FAIL,
} from '../../dealer/actionTypes';

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
  name: {
    fontFamily: styleConst.font.regular,
    fontSize: 17,
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
  listItem: {
    backgroundColor: '#F6F6F6',
    marginLeft: 0,
    paddingRight: 0,
    borderBottomWidth: 0,
  },
  body: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
  },
  bodyView: {flexBasis: '60%'},
  thumb: {flexShrink: 1, flexBasis: '40%', marginLeft: 8},
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
    goBack: PropTypes.bool,
    isLocal: PropTypes.bool,
  };

  onPressDealerItem = () => {
    const {
      navigation,
      returnScreen,
      selectItem,
      item,
      goBack,
      onSelect,
      selectedItem,
      isLocal,
    } = this.props;
    const mainScreen = 'BottomTabNavigation';

    selectItem({
      dealerBaseData: item,
      dealerSelected: selectedItem,
      isLocal,
    }).then((action) => {
      if (
        action.type === DEALER__SUCCESS ||
        action.type === DEALER__SUCCESS__LOCAL
      ) {
        if (onSelect) {
          onSelect({
            newDealer: get(action, 'payload.newDealer'),
            prevDealer: get(action, 'payload.prevDealer'),
            isLocal: isLocal,
          });
        }

        if (Boolean(goBack)) {
          return navigation.goBack();
        }

        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: returnScreen || mainScreen,
            }),
          ],
        });
        navigation.dispatch(resetAction);
      }

      if (action.type === DEALER__FAIL) {
        Alert.alert(
          'Ошибка',
          'Не удалось получить данные по выбранному автоцентру, попробуйте снова',
        );
      }
    });
  };

  onPressCityItem = () => {
    const {navigation, selectItem, item} = this.props;

    selectItem(item);
    navigation.goBack();
  };

  _getSite = (sites) => {
    if (typeof sites === 'undefined') {
      return null;
    }

    let res = [];

    sites.split('\r\n').forEach((val) => {
      res.push(val.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]);
    });
    return res.join('\r\n');
  };

  renderDealer = () => {
    const {item} = this.props;
    if (item.virtual !== false && item.id !== 177) {
      // фикс для НЕ вывода виртуальных КО в списке
      return true;
    }
    const CarImg = get(item, 'img.10000x440');

    return (
      <ListItem
        onPress={this.onPressDealerItem}
        style={[stylesList.listItem, styles.listItem]}>
        <Body style={styles.body}>
          <View style={styles.bodyView}>
            {item.name ? <Text style={styles.name}>{item.name}</Text> : null}
            {item.city ? (
              <Text style={styles.city}>
                {item.city.name + ', ' + item.address}
              </Text>
            ) : null}
            <Text style={styles.site}>{this._getSite(item.site)}</Text>
            <View style={styles.brands}>
              {item.brands &&
                item.brands.map((brand) => {
                  if (brand.logo) {
                    return (
                      <Imager
                        resizeMode="contain"
                        key={'brandLogo' + brand.id}
                        style={styles.brandLogo}
                        source={{uri: brand.logo}}
                      />
                    );
                  }
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
      </ListItem>
    );
  };

  renderCity = () => {
    const {item, selectedItem} = this.props;

    let existBrands = [];

    return (
      <ListItem onPress={this.onPressCityItem} style={stylesList.listItem}>
        <Body>
          {item.name ? <Text style={styles.city}>{item.name}</Text> : null}
          {item.dealers && item.dealers.length !== 0 ? (
            <View style={styles.brands}>
              {item.dealers.map((dealer) => {
                if (dealer.virtual !== false && item.id !== 177) {
                  // фикс для НЕ вывода виртуальных КО в списке
                  return true;
                }
                return (
                  <View key={dealer.id} style={styles.brands}>
                    {dealer.brands &&
                      dealer.brands.map((brand) => {
                        const name =
                          brand.name === 'land rover'
                            ? 'landrover'
                            : brand.name;

                        if (
                          existBrands.includes(name) ||
                          dealer.virtual !== false
                        ) {
                          return null;
                        } else {
                          existBrands.push(name);
                        }

                        if (brand.logo) {
                          return (
                            <Imager
                              resizeMode="contain"
                              key={'brandLogo' + brand.id}
                              style={styles.brandLogo}
                              source={{uri: brand.logo}}
                            />
                          );
                        }
                      })}
                  </View>
                );
              })}
            </View>
          ) : null}
        </Body>
      </ListItem>
    );
  };

  render() {
    const {itemLayout} = this.props;

    return itemLayout === 'dealer' ? this.renderDealer() : this.renderCity();
  }
}
