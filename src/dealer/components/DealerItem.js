import React, { Component } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Text, ListItem, Body, Right, Icon } from 'native-base';
import PropTypes from 'prop-types';

// components
import { CachedImage } from 'react-native-cached-image';
import { NavigationActions } from 'react-navigation';

// helpers
import styleConst from '../../core/style-const';
import DeviceInfo from 'react-native-device-info';
import { DEALER__SUCCESS, DEALER__FAIL } from '../actionTypes';

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

export default class DealerItem extends Component {
  static propTypes = {
    // navigate: PropTypes.func,
    returnScreen: PropTypes.string,
    selectDealer: PropTypes.func,
    dealer: PropTypes.object,
    dealerSelected: PropTypes.object,
  }

  onPressDealer = () => {
    const { navigation, returnScreen, selectDealer, dealer } = this.props;
    const mainScreen = DeviceInfo.isTablet() ? 'ContactsScreen' : 'MenuScreen';

    return selectDealer(dealer)
      .then((action) => {
        if (action.type === DEALER__SUCCESS) {
          const resetAction = NavigationActions.reset({
            index: 0,
            key: 'ChooseDealerScreen',
            actions: [
              NavigationActions.navigate({ routeName: returnScreen || mainScreen }),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        }

        if (action.type === DEALER__FAIL) {
          Alert.alert('Ошибка', 'Не удалось получить данные по выбранному автоцентру, попробуйте снова');
        }
      });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.dealer.id === nextProps.dealerSelected.id;
  }

  render() {
    const { dealer, dealerSelected } = this.props;

    console.log('== DealerItem ==');

    return (
      <ListItem onPress={this.onPressDealer} style={styles.listItem}>
        <Body style={styles.listItemBody}>
          {dealer.city ? <Text style={styles.city}>{dealer.city.name}</Text> : null}
          {dealer.name ? <Text style={styles.name}>{dealer.name}</Text> : null}
        </Body>
        <Right>
          <View style={styles.brands} >
            {
              dealer.brands.map(brand => (
                <CachedImage
                  resizeMode="contain"
                  key={brand.id}
                  style={styles.brandLogo}
                  source={{ uri: brand.logo }}
                />
              ))
            }
          </View>
          {
            dealerSelected.id === dealer.id ?
              <Icon name="ios-checkmark" style={styles.iconCheck} /> :
              null
          }
        </Right>
      </ListItem>
    );
  }
}
