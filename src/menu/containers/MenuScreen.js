import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container,
  Text,
  Grid,
  Col,
  Row,
} from 'native-base';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styleConst from '../../core/style-const';
import { scale, verticalScale } from '../../utils/scale';
import styleHeader from '../../core/components/Header/style';

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.bg,
    justifyContent: 'space-around',
  },
  menu: {
    marginTop: verticalScale(15),
    marginBottom: verticalScale(50),
    marginLeft: scale(10),
    marginRight: scale(10),
  },
  text: {
    color: styleConst.color.greyText,
    fontSize: 12,
    fontFamily: styleConst.font.regular,
    textAlign: 'center',
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

const mapStateToProps = () => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({

  }, dispatch);
};

class MenuScreen extends Component {
  static navigationOptions = () => ({
    headerTitle: 'Атлант-М',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: null,
  })

  render() {
    return (
      <Container style={styles.container} >
        <Grid style={styles.menu} >
          <Row>
            <Col style={styles.item}>
              <Image
                style={styles.icon}
                source={require('../assets/contacts.png')}
              />
              <Text style={styles.text}>Контакты</Text>
            </Col>
            <Col style={styles.item}>
              <Image
                style={styles.icon}
                source={require('../assets/info.png')}
              />
              <Text style={styles.text}>Акции</Text>
            </Col>
          </Row>
          <Row>
            <Col style={styles.item}>
              <Image
                style={styles.icon}
                source={require('../assets/service.png')}
              />
              <Text style={styles.text}>Заявка на СТО</Text>
            </Col>
            <Col style={styles.item}>
              <Image
                style={styles.icon}
                source={require('../assets/car_delivery.png')}
              />
              <Text style={styles.text}>Табло выдачи авто</Text>
            </Col>
          </Row>
          <Row>
            <Col style={styles.item}>
              <Image
                style={styles.icon}
                source={require('../assets/phones.png')}
              />
              <Text style={styles.text}>Справочная</Text>
            </Col>
            <Col style={styles.item}>
              <Image
                style={styles.icon}
                source={require('../assets/indicators.png')}
              />
              <Text style={styles.text}>Индикаторы</Text>
            </Col>
          </Row>
          <Row>
            <Col style={styles.item}>
              <Image
                style={styles.icon}
                source={require('../assets/reviews.png')}
              />
              <Text style={styles.text}>Отзывы и предложения</Text>
            </Col>
            <Col style={styles.item}>
              <Image
                style={styles.icon}
                source={require('../assets/profile.png')}
              />
              <Text style={styles.text}>Личный кабинет</Text>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);
