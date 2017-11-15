import React, { Component } from 'react';
import { Text, View, Image, Alert, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// helpers
import styleConst from '../../core/style-const';
import { NavigationActions } from 'react-navigation';
import {
  MENU_TVA,
  MENU_INFO,
  MENU_CATALOG,
  MENU_SERVICE,
  MENU_PROFILE,
  MENU_CONTACTS,
  MENU_INDICATORS,
} from '../actionTypes';

const HEIGHT_ITEM = 55;
const HEIGHT_ICON = 35;

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.bg,
    flex: 1.3,
    borderRightWidth: 1,
    borderRightColor: styleConst.color.greyText2,
  },
  header: {
    height: 64,
    backgroundColor: styleConst.color.header,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 36,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEIGHT_ITEM,
  },
  textContainer: {
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.border,
    height: HEIGHT_ITEM,
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    color: styleConst.color.greyText,
    fontSize: 18,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  icon: {
    width: HEIGHT_ICON,
    height: HEIGHT_ICON,
    marginHorizontal: 15,
    resizeMode: 'contain',
  },
  itemActive: {
    backgroundColor: styleConst.color.select,
  },
  textActive: {
    color: styleConst.color.blue,
  },
});

const mapStateToProps = ({ nav, dealer }) => ({
  nav,
  dealerSelected: dealer.selected,
});

const icons = {
  car_delivery: require('../assets/car_delivery.png'),
  catalog_auto: require('../assets/catalog_auto.png'),
  contacts: require('../assets/contacts.png'),
  indicators: require('../assets/indicators.png'),
  info: require('../assets/info.png'),
  profile: require('../assets/profile.png'),
  reference: require('../assets/reference.png'),
  reviews: require('../assets/reviews.png'),
  service: require('../assets/service.png'),
};

class Sidebar extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  static defaultProps = {}

  shouldComponentUpdate(nextProps) {
    return this.props.nav !== nextProps.nav;
  }

  getActiveScreen() {
    const nav = this.props.nav.newState;
    const currentScreen = nav.routes[nav.index].routeName;

    switch (currentScreen) {
      case 'InfoListScreen':
      case 'InfoPostScreen':
        return MENU_INFO;
      case 'ServiceScreen':
        return MENU_SERVICE;
      case 'ProfileScreen':
        return MENU_PROFILE;
      case 'Catalog2Screen':
        return MENU_CATALOG;
      case 'Tva2Screen':
        return MENU_TVA;
      case 'IndicatorsScreen':
        return MENU_INDICATORS;
      default:
        return MENU_CONTACTS;
    }
  }

  isMenuAvailable = () => this.props.dealerSelected.id

  showIntroWarning = () => Alert.alert('Для начала выберите автоцентр')

  onPressContacts = () => this.onPressItem('ContactsScreen')

  onPressInfoList = () => this.onPressItem('InfoListScreen')

  onPressProfile = () => this.onPressItem('ProfileScreen')

  onPressService = () => this.onPressItem('ServiceScreen')

  onPressCatalog = () => this.onPressItem('Catalog2Screen')

  onPressTva = () => this.onPressItem('Tva2Screen')

  onPressIndicators = () => this.onPressItem('IndicatorsScreen')

  onPressItem = (routeName) => {
    if (!this.isMenuAvailable()) return this.showIntroWarning();

    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({ routeName }),
      ],
    });
    window.atlantmNavigation.dispatch(resetAction);
  }

  onPressNotReadyScreen = () => {
    this.isMenuAvailable() ?
      Alert.alert('Раздел появится в ближайших обновлениях') :
      this.showIntroWarning();
  }

  renderMenuItem = (type, text, icon, onPressHandler, isActive) => {
    if (type === 'ready') {
      return (
        <TouchableOpacity onPress={onPressHandler} style={[styles.item, isActive ? styles.itemActive : {}]}>
          <Image
            style={styles.icon}
            source={icons[icon]}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.text, isActive ? styles.textActive : {}]}>{text}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableHighlight underlayColor={styleConst.color.select} onPress={this.onPressNotReadyScreen}>
        <View style={styles.item}>
          <Image
            style={styles.icon}
            source={icons[icon]}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const nav = this.props.nav.newState;
    const isChooseDealerScreen = nav.routes[nav.index].routeName === 'ChooseDealerScreen';

    if (!this.props.dealerSelected.id && !isChooseDealerScreen) return null;

    const activeScreen = this.getActiveScreen();
    const isContact = activeScreen === MENU_CONTACTS;
    const isInfo = activeScreen === MENU_INFO;
    const isProfile = activeScreen === MENU_PROFILE;
    const isService = activeScreen === MENU_SERVICE;
    const isCatalog = activeScreen === MENU_CATALOG;
    const isTva = activeScreen === MENU_TVA;
    const isIndicators = activeScreen === MENU_INDICATORS;

    console.log('== Sidebar ==');

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            resizeMode="cover"
            style={styles.logo}
            source={require('../../contacts/aboutholding/assets/company_logo.png')}
          />
        </View>

        {this.renderMenuItem('ready', 'Контакты', 'contacts', this.onPressContacts, isContact)}
        {this.renderMenuItem('ready', 'Акции', 'info', this.onPressInfoList, isInfo)}
        {this.renderMenuItem('ready', 'Заявка на СТО', 'service', this.onPressService, isService)}
        {this.renderMenuItem('ready', 'Табло выдачи авто', 'car_delivery', this.onPressTva, isTva)}
        {this.renderMenuItem('ready', 'Каталог автомобилей', 'catalog_auto', this.onPressCatalog, isCatalog)}
        {this.renderMenuItem('ready', 'Индикаторы', 'indicators', this.onPressIndicators, isIndicators)}
        {this.renderMenuItem('not-ready', 'Отзывы и предложения', 'reviews')}
        {this.renderMenuItem('ready', 'Личный кабинет', 'profile', this.onPressProfile, isProfile)}
      </View>
    );
  }
}

export default connect(mapStateToProps)(Sidebar);
