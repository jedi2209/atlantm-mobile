import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

// helpers
import styleConst from '../../core/style-const';
import { MENU_CONTACTS, MENU_INFO, MENU_PROFILE, MENU_SERVICE } from '../actionTypes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 150,
    height: 36,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  item: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 24,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  itemActive: {
    backgroundColor: styleConst.color.lightBlue,
  },
  textActive: {
    color: styleConst.color.blue,
  },
});

export default class Sidebar extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  static defaultProps = {
  }

  // shouldComponentUpdate(nextProps) {
  //   return this.props.nav !== nextProps.nav;
  // }

  getActiveScreen() {
    switch (this.props.nav) {
      case 'InfoListScreen':
      case 'InfoPostScreen':
        return MENU_INFO;
      case 'ServiceScreen':
        return MENU_SERVICE;
      case 'ProfileScreen':
        return MENU_SERVICE;
      default:
        return MENU_CONTACTS;
    }
  }

  onPressContacts = () => this.props.navigation.navigate('ContactsScreen')
  onPressInfoList = () => this.props.navigation.navigate('InfoListScreen')
  onPressProfile = () => this.props.navigation.navigate('ProfileScreen')
  onPressService = () => this.props.navigation.navigate('ServiceScreen')
  onPressNotReadyScreen = () => Alert.alert('Раздел появится в ближайших обновлениях');

  render() {
    const activeScreen = this.getActiveScreen();

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            resizeMode="cover"
            style={styles.logo}
            source={require('../../contacts/aboutholding/assets/company_logo.png')}
          />
        </View>

        <TouchableOpacity onPress={this.onPressContacts} style={[styles.item, activeScreen === MENU_CONTACTS ? styles.itemActive : {}]}>
          <Image
            style={styles.icon}
            source={require('../assets/contacts.png')}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Контакты</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onPressInfoList} style={[styles.item, activeScreen === MENU_INFO ? styles.itemActive : {}]}>
          <Image
            style={styles.icon}
            source={require('../assets/info.png')}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Акции</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onPressService} style={[styles.item, activeScreen === MENU_SERVICE ? styles.itemActive : {}]}>
          <Image
            style={styles.icon}
            source={require('../assets/service.png')}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Заявка на СТО</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={this.onPressNotReadyScreen}>
          <Image
            style={styles.icon}
            source={require('../assets/car_delivery.png')}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Табло выдачи авто</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={this.onPressNotReadyScreen}>
          <Image
            style={styles.icon}
            source={require('../assets/catalog_auto.png')}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Каталог автомобилей</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={this.onPressNotReadyScreen}>
          <Image
            style={styles.icon}
            source={require('../assets/indicators.png')}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Индикаторы</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={this.onPressNotReadyScreen}>
          <Image
            style={styles.icon}
            source={require('../assets/reviews.png')}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Отзывы и предложения</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onPressProfile} style={[styles.item, activeScreen === MENU_PROFILE ? styles.itemActive : {}]}>
          <Image
            style={styles.icon}
            source={require('../assets/profile.png')}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Личный кабинет</Text>
          </View>
        </TouchableOpacity>

      </View>
    );
  }
}
