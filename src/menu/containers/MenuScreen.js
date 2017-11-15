import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Container,
  Text,
  Grid,
  Col,
  Row,
} from 'native-base';

import styleConst from '../../core/style-const';
import { scale, verticalScale } from '../../utils/scale';
import styleHeader from '../../core/components/Header/style';

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.bg,
    justifyContent: 'space-around',
  },
  menu: {
    marginTop: verticalScale(25),
    marginBottom: verticalScale(40),
    marginLeft: scale(10),
    marginRight: scale(10),
  },
  text: {
    color: styleConst.color.greyText,
    fontSize: 14,
    fontFamily: styleConst.font.regular,
    textAlign: 'center',
    letterSpacing: styleConst.ui.letterSpacing,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    resizeMode: 'contain',
    width: scale(60),
    height: scale(60),
    marginBottom: verticalScale(5),
  },
});

export default class MenuScreen extends Component {
  static navigationOptions = () => ({
    headerTitle: 'Атлант-М',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: null,
  })

  shouldComponentUpdate() {
    return false;
  }

  onPressContacts = () => this.props.navigation.navigate('ContactsScreen')
  onPressInfoList = () => this.props.navigation.navigate('InfoListScreen')
  onPressProfile = () => this.props.navigation.navigate('ProfileScreen')
  onPressService = () => this.props.navigation.navigate('ServiceScreen')
  onPressCatalog = () => this.props.navigation.navigate('Catalog2Screen')
  onPressTva = () => this.props.navigation.navigate('Tva2Screen')
  onPressIndicators = () => this.props.navigation.navigate('IndicatorsScreen')
  onPressNotReadyScreen = () => Alert.alert('Раздел появится в ближайших обновлениях');

  render() {
    console.log('== Menu ==');

    return (
      <Container style={styles.container} >
        <Grid style={styles.menu} >
          <Row>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressContacts}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/contacts.png')}
                />
                <Text style={styles.text}>Контакты</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressInfoList}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/info.png')}
                />
                <Text style={styles.text}>Акции</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressService}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/service.png')}
                />
                <Text style={styles.text}>Заявка на СТО</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressTva}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/car_delivery.png')}
                />
                <Text style={styles.text}>Табло выдачи авто</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressCatalog}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/catalog_auto.png')}
                />
                <Text style={styles.text}>Каталог автомобилей</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressIndicators}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/indicators.png')}
                />
                <Text style={styles.text}>Индикаторы</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressNotReadyScreen}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/reviews.png')}
                />
                <Text style={styles.text}>Отзывы и предложения</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressProfile}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/profile.png')}
                />
                <Text style={styles.text}>Личный кабинет</Text>
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }
}
