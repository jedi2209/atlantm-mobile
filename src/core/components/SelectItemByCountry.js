import React, { Component } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Text, ListItem, Body, Right, Icon } from 'native-base';

// components
import DeviceInfo from 'react-native-device-info';
import { NavigationActions } from 'react-navigation';
import { CachedImage } from 'react-native-cached-image';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../../core/style-const';
import { DEALER__SUCCESS, DEALER__FAIL } from '../../dealer/actionTypes';

const brandsLogos = {
  chevrolet: require('../assets/chevrolet.png'),
  ford: require('../assets/ford.png'),
  jaguar: require('../assets/jaguar.png'),
  kia: require('../assets/kia.png'),
  landrover: require('../assets/landrover.png'),
  mazda: require('../assets/mazda.png'),
  nissan: require('../assets/nissan.png'),
  opel: require('../assets/opel.png'),
  renault: require('../assets/renault.png'),
  skoda: require('../assets/skoda.png'),
  volkswagen: require('../assets/volkswagen.png'),
};

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
  },
  name: {
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    fontSize: 17,
  },
  listItem: {
    minHeight: 44,
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
  }

  onPressItem = () => {
    const { navigation, returnScreen, selectItem, item } = this.props;
    const mainScreen = DeviceInfo.isTablet() ? 'ContactsScreen' : 'MenuScreen';

    selectItem(item)
      .then((action) => {
        if (action.type === DEALER__SUCCESS) {
          const resetAction = NavigationActions.reset({
            index: 0,
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

  renderDealer = () => {
    const { item, selectedItem } = this.props;

    return (
      <ListItem onPress={this.onPressItem} style={styles.listItem}>
        <Body style={styles.listItemBody}>
          {item.city ? <Text style={styles.city}>{item.city.name}</Text> : null}
          {item.name ? <Text style={styles.name}>{item.name}</Text> : null}
        </Body>
        <Right>
          <View style={styles.brands} >
            {
              item.brands.map(brand => {
                const name = brand.name === 'land rover' ? 'landrover' : brand.name;
                return (
                  <CachedImage
                    resizeMode="contain"
                    key={brand.id}
                    style={styles.brandLogo}
                    source={brandsLogos[name]}
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

  render() {
    const { itemLayout } = this.props;

    console.log('== SelectItemByCountry: %s ==', itemLayout);

    return itemLayout === 'dealer' ?
      this.renderDealer() :
      this.renderCity();
  }
}
