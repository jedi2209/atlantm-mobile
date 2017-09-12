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
  Content,
  Text,
  List,
  ListItem,
  Body,
  Right,
  StyleProvider,
} from 'native-base';

import Communications from 'react-native-communications';

import { connect } from 'react-redux';

import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import { verticalScale } from '../../../utils/scale';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';

import {
  RUSSIA,
  BELARUSSIA,
  UKRAINE,
} from '../../../dealer/regionConst';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
  textContainer: {
    paddingVertical: styleConst.ui.verticalGap - 5,
    paddingHorizontal: styleConst.ui.horizontalGap + 5,
  },
  text: {
    fontSize: 15,
    color: styleConst.color.greyText4,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  list: {
    backgroundColor: '#fff',
    marginTop: verticalScale(35),
    borderTopWidth: styleConst.ui.borderWidth,
    borderTopColor: styleConst.color.border,
  },
  rightText: {
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
  },
});

const mapStateToProps = ({ dealer }) => {
  return {
    dealerSelected: dealer.selected,
  };
};

class AboutHoldingScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Image
        resizeMode="cover"
        style={{
          width: 150,
          height: 36,
          resizeMode: 'contain',
          alignSelf: 'center',
        }}
        source={require('../assets/company_logo.png')}
      />
    ),
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />, // для выравнивания заголовка по центру на обоих платформах
  })

  getSite = () => {
    return {
      [RUSSIA]: 'https://www.atlantm.ru/',
      [BELARUSSIA]: 'https://www.atlant-m.by/',
      [UKRAINE]: 'https://www.atlant-m.ua/',
    }[this.props.dealerSelected.region];
  }

  onPressWebsite = () => Communications.web(this.getSite())

  shouldComponentUpdate() {
    return this.props.selectedDealer.id !== nextProps.selectedDealer.id &&
      this.props.navigation.state.routeName === 'AboutHoldingScreen';
  }

  render() {
    const { dealerSelected } = this.props;
    const site = this.getSite();

    console.log('== AboutHolding ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
            <List style={[styles.list, styles.listHolding]}>
              <View style={styles.listItemContainer}>
                {
                  <ListItem last icon style={styles.listItem}>
                    <Body>
                      <Text>Веб-сайт</Text>
                    </Body>
                    <Right>
                      <TouchableOpacity onPress={this.onPressWebsite}>
                        <Text style={styles.rightText}>{site}</Text>
                      </TouchableOpacity>
                    </Right>
                  </ListItem>
                }
              </View>
            </List>

            <View style={styles.textContainer}>
              <Text style={styles.text}>
              {
                `В 2017 году Международный автомобильный холдинг «Атлант-М» отмечает 26 лет со дня основания компании.

«Атлант-М» - крупное объединение компаний в СНГ (России, Украине и Республике Беларусь), специализирующееся на продаже, гарантийном и сервисном обслуживании автомобилей, а также на поставках запасных частей.

На начало 2017 года в состав холдинга входят 20 автомобильных предприятий, в том числе 18 автоцентров. Общая численность персонала составляет 1990 сотрудников.

Компании холдинга «Атлант-М» - официальные дилеры ведущих мировых производителей автомобилей. В портфеле брендов «Атлант-М» на сегодня - 10 автомобильных марок: Volkswagen, Skoda, Land Rover, Jaguar, Mazda, Ford, GM-AVTOVAZ, KIA, Nissan, Renault.

Совокупный оборот холдинга «Атлант-М» в 2016 году составил 342 млн. долларов США. За этот же период подразделения компании реализовали на территории России, Украины и Республики Беларусь 15063 новых и подержанных автомобиля.

В Республике Беларусь «Атлант-М» контролирует 23,6% рынка (по данным Белорусской автомобильной ассоциации).

За 26 лет работы на автомобильном рынке в холдинге «Атлант-М» накоплен уникальный опыт построения сбытовых сетей и эффективного управления предприятиями. За эти годы более 430 000 клиентов воспользовались услугами компании по приобретению и обслуживанию автомобилей и запасных частей, дополнительному оборудованию и финансовому сервису.`
              }
              </Text>
            </View>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, null)(AboutHoldingScreen);
