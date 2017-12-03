import React, { Component } from 'react';
import { Image, View, StyleSheet, Platform, Linking } from 'react-native';
import { Container, Content, Text, StyleProvider, List, ListItem, Left, Body, Right, Icon } from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionReviewsReset } from '../actions';

// components
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';
import InfoLine from '../components/InfoLine';

// helpers
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesList from '../../core/components/Lists/style';
import stylesHeader from '../../core/components/Header/style';
import { TEXT_MESSAGE_CONTROL, TEXT_RATE_APP } from '../constants';

const icons = {
  advocate: require('../assets/advocate.png'),
  contactMe: require('../assets/contact_me.png'),
  rateApp: require('../assets/rate_app.png'),
  reviews: require('../assets/reviews.png'),
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({ nav, dealer }) => {
  return {
    nav,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionReviewsReset,
  }, dispatch);
};

class EkoScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Отзывы и предложения',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <View />, // для выравнивания заголовка по центру на обоих платформах
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  componentDidMount() {
    this.props.actionReviewsReset();
  }

  shouldComponentUpdate(nextProps) {
    const { dealerSelected } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'EkoScreen';

    // console.log('Catalog this.props.navigation', this.props.navigation);
    // console.log('Catalog nextProps.navigation', nextProps.navigation);

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen);
  }

  onPressReviews = () => this.props.navigation.navigate('ReviewsScreen')
  onPressContactMe = () => this.props.navigation.navigate('ContactMeScreen')
  onPressAdvocate = () => this.props.navigation.navigate('AdvocateScreen')
  onPressRateApp = () => {
    const APP_STORE_LINK = 'itms://itunes.apple.com/gb/app/atlant-m/idXXXX?mt=8';
    const PLAY_STORE_LINK = 'market://details?id=com.atlantm';

    if (Platform.OS === 'ios') {
      Linking.openURL(APP_STORE_LINK).catch(err => console.error('APP_STORE_LINK failed', err));
    } else {
      Linking.openURL(PLAY_STORE_LINK).catch(err => console.error('PLAY_STORE_LINK failed', err));
    }
  }

  getRateAppLabel = () => {
    return `Оставить отзыв в ${this.getPlatformStore()}`;
  }

  getRateAppInfoText = () => {
    return `${TEXT_RATE_APP} ${this.getPlatformStore()}`;
  }

  getPlatformStore = () => Platform.OS === 'ios' ? 'App Store' : 'Google Play'

  renderItem = ({ label, iconName, onPressHandler, isFirst, isLast }) => {
    return (
      <View style={[
        stylesList.listItemContainer,
        isFirst ? stylesList.listItemContainerFirst : {},
      ]}>
        <ListItem
          icon
          last={isLast}
          style={stylesList.listItem}
          onPress={onPressHandler}
        >
          <Left>
            <Image style={stylesList.iconLeft} source={icons[iconName]} />
          </Left>
          <Body>
            <Text style={styles.text}>{label}</Text>
          </Body>
          <Right>
            <Icon name="arrow-forward" style={stylesList.iconArrow} />
          </Right>
        </ListItem>
      </View>
    );
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      navigation,
    } = this.props;

    console.log('== EkoScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            <List style={stylesList.list}>
              {this.renderItem({
                label: 'Отзывы о работе автоцентра',
                iconName: 'reviews',
                isFirst: true,
                onPressHandler: this.onPressReviews,
              })}
              {this.renderItem({
                label: 'Потребовать связаться с вами',
                iconName: 'contactMe',
                onPressHandler: this.onPressContactMe,
              })}
              {this.renderItem({
                label: 'Написать адвокату клиента',
                iconName: 'advocate',
                isLast: true,
                onPressHandler: this.onPressAdvocate,
              })}
            </List>

            <InfoLine infoIcon={true} text={TEXT_MESSAGE_CONTROL} />

            <List style={stylesList.list}>
              {this.renderItem({
                label: this.getRateAppLabel(),
                iconName: 'reviews',
                isFirst: true,
                isLast: true,
                onPressHandler: this.onPressRateApp,
              })}
            </List>

            <InfoLine text={this.getRateAppInfoText()} />
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EkoScreen);
