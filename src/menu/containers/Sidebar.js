import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

// helpers
import styleConst from '../../core/style-const';
import { MENU_CONTACTS, MENU_INFO, MENU_PROFILE, MENU_SERVICE } from '../actionTypes';

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
      default:
        return MENU_CONTACTS;
    }
  }

  isMenuAvailable = () => this.props.dealerSelected.id

  showIntroWarning = () => Alert.alert('Для начала выберите автоцентр')

  onPressContacts = () => {
    this.isMenuAvailable() ?
      window.atlantmNavigation.navigate('ContactsScreen') :
      this.showIntroWarning();
  }
  onPressInfoList = () => {
    this.isMenuAvailable() ?
      window.atlantmNavigation.navigate('InfoListScreen') :
      this.showIntroWarning();
  }
  onPressProfile = () => {
    this.isMenuAvailable() ?
      window.atlantmNavigation.navigate('ProfileScreen') :
      this.showIntroWarning();
  }
  onPressService = () => {
    this.isMenuAvailable() ?
      window.atlantmNavigation.navigate('ServiceScreen') :
      this.showIntroWarning();
  }
  onPressNotReadyScreen = () => {
    this.isMenuAvailable() ?
      Alert.alert('Раздел появится в ближайших обновлениях') :
      this.showIntroWarning();
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

        <TouchableOpacity onPress={this.onPressContacts} style={[styles.item, isContact ? styles.itemActive : {}]}>
          <Image
            style={styles.icon}
            source={require('../assets/contacts.png')}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.text, isContact ? styles.textActive : {}]}>Контакты</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onPressInfoList} style={[styles.item, isInfo ? styles.itemActive : {}]}>
          <Image
            style={styles.icon}
            source={require('../assets/info.png')}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.text, isInfo ? styles.textActive : {}]}>Акции</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onPressService} style={[styles.item, isService ? styles.itemActive : {}]}>
          <Image
            style={styles.icon}
            source={require('../assets/service.png')}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.text, isService ? styles.textActive : {}]}>Заявка на СТО</Text>
          </View>
        </TouchableOpacity>

        <TouchableHighlight underlayColor={styleConst.color.select} onPress={this.onPressNotReadyScreen}>
          <View style={styles.item}>
            <Image
              style={styles.icon}
              source={require('../assets/car_delivery.png')}
            />
            <View style={styles.textContainer}>
              <Text style={styles.text}>Табло выдачи авто</Text>
            </View>
          </View>
        </TouchableHighlight>

        <TouchableHighlight underlayColor={styleConst.color.select} onPress={this.onPressNotReadyScreen}>
          <View style={styles.item}>
            <Image
              style={styles.icon}
              source={require('../assets/catalog_auto.png')}
            />
            <View style={styles.textContainer}>
              <Text style={styles.text}>Каталог автомобилей</Text>
            </View>
          </View>
        </TouchableHighlight>

        <TouchableHighlight underlayColor={styleConst.color.select} onPress={this.onPressNotReadyScreen}>
          <View style={styles.item}>
            <Image
              style={styles.icon}
              source={require('../assets/indicators.png')}
            />
            <View style={styles.textContainer}>
              <Text style={styles.text}>Индикаторы</Text>
            </View>
          </View>
        </TouchableHighlight>

        <TouchableHighlight underlayColor={styleConst.color.select} onPress={this.onPressNotReadyScreen}>
          <View style={styles.item}>
            <Image
              style={styles.icon}
              source={require('../assets/reviews.png')}
            />
            <View style={styles.textContainer}>
              <Text style={styles.text}>Отзывы и предложения</Text>
            </View>
          </View>
        </TouchableHighlight>

        <TouchableOpacity onPress={this.onPressProfile} style={[styles.item, isProfile ? styles.itemActive : {}]}>
          <Image
            style={styles.icon}
            source={require('../assets/profile.png')}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.text, isProfile ? styles.textActive : {}]}>Личный кабинет</Text>
          </View>
        </TouchableOpacity>

      </View>
    );
  }
}

export default connect(mapStateToProps)(Sidebar);
