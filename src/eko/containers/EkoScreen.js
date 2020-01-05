// Вводный экран ЭКО, сейчас отключен, возможно вернется в скором будущем.

import React, {Component} from 'react';
import {
  SafeAreaView,
  Image,
  View,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import {
  Content,
  Text,
  StyleProvider,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionReviewsReset} from '../actions';

// components
import InfoLine from '../components/InfoLine';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesList from '../../core/components/Lists/style';
import stylesHeader from '../../core/components/Header/style';
import {TEXT_MESSAGE_CONTROL, TEXT_RATE_APP} from '../constants';

const icons = {
  advocate: require('../assets/advocate.png'),
  contactMe: require('../assets/contact_me.png'),
  // rateApp: require('../assets/rate_app.png'),
  reviews: require('../assets/reviews.png'),
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({nav, dealer}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  actionReviewsReset,
};

class EkoScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Отзывы и предложения',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: (
      <HeaderIconBack returnScreen="BottomTabNavigation" navigation={navigation} />
    ),
    headerRight: <HeaderIconMenu navigation={navigation} />,
  });

  componentDidMount() {
    this.props.actionReviewsReset();
  }

  shouldComponentUpdate(nextProps) {
    const {dealerSelected} = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'EkoScreen';

    return dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen;
  }

  onPressReviews = () => this.props.navigation.navigate('ReviewsScreen');
  onPressContactMe = () => this.props.navigation.navigate('ContactMeScreen');
  onPressAdvocate = () => this.props.navigation.navigate('AdvocateScreen');
  onPressRateApp = () => {
    const APP_STORE_LINK =
      'itms-apps://itunes.apple.com/app/idXXXX?action=write-review';
    const PLAY_STORE_LINK = 'market://details?id=com.atlantm';

    if (Platform.OS === 'ios') {
      Linking.openURL(APP_STORE_LINK).catch(err =>
        console.error('APP_STORE_LINK failed', err),
      );
    } else {
      Linking.openURL(PLAY_STORE_LINK).catch(err =>
        console.error('PLAY_STORE_LINK failed', err),
      );
    }
  };

  getRateAppLabel = () => {
    return `Оставить отзыв в ${this.getPlatformStore()}`;
  };

  getRateAppInfoText = () => {
    return `${TEXT_RATE_APP} ${this.getPlatformStore()}`;
  };

  getPlatformStore = () =>
    Platform.OS === 'ios' ? 'App Store' : 'Google Play';

  renderItem = ({label, iconName, onPressHandler, isFirst, isLast}) => {
    return (
      <View
        style={[
          stylesList.listItemContainer,
          isFirst ? stylesList.listItemContainerFirst : {},
        ]}>
        <ListItem
          icon
          last={isLast}
          style={stylesList.listItem}
          onPress={onPressHandler}>
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
  };

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {navigation} = this.props;

    console.log('== EkoScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            <List style={stylesList.list}>
              {this.renderItem({
                label: 'Отзывы о работе автоцентра',
                iconName: 'reviews',
                isFirst: true,
                isLast: true,
                onPressHandler: this.onPressReviews,
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
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EkoScreen);
