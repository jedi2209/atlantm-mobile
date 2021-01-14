import React, {PureComponent} from 'react';
import {View, StatusBar} from 'react-native';

// redux
import {connect} from 'react-redux';
import {actionSetPushActionSubscribe} from '../../core/actions';
import {actionSetGlobalLanguage} from '../../core/lang/actions';
// actions
import {
  fetchDealers,
  fetchBrands,
  selectDealer,
} from '../actions';

// components
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import SelectListByCountry from '../../core/components/SelectListByCountry';
import PushNotifications from '../../core/components/PushNotifications';

// helpers
import {get} from 'lodash';
import stylesHeader from '../../core/components/Header/style';
import strings from '../../core/lang/const';

const mapStateToProps = ({dealer, nav, core}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    region: dealer.region,
    listRussia: dealer.listRussia,
    listBrands: dealer.listBrands,
    listBelarussia: dealer.listBelarussia,
    listUkraine: dealer.listUkraine,
    isFetchDealersList: dealer.meta.isFetchDealersList,
    isFetchDealer: dealer.meta.isFetchDealer,
    pushGranted: core.pushGranted,
    pushActionSubscribeState: core.pushActionSubscribeState,
  };
};

const mapDispatchToProps = {
  fetchDealers,
  fetchBrands,
  selectDealer,
  actionSetPushActionSubscribe,
  actionSetGlobalLanguage,
};

class ChooseDealerScreen extends PureComponent {
  static navigationOptions = ({navigation}) => ({
    headerTitle: strings.ChooseDealerScreen.title,
    headerStyle: stylesHeader.blueHeader,
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: <HeaderIconBack theme="white" navigation={navigation} />,
    headerRight: <View />,
  });

  constructor(props) {
    super(props);
    if (props.listBrands && props.listBrands.length === 0) {
      props.fetchBrands();
    }
  }

  // ВАЖНО! ЯВНО ОТКЛЮЧЕН ИЗ-ЗА ПРОБЛЕМ ПЕРВОЙ ЗАГРУЗКИ НА IOS 11+
  // shouldComponentUpdate(nextProps) {
  //   const nav = nextProps.nav.newState;

  //   return nav.routes[nav.index].routeName === 'ChooseDealerScreen';
  // }

  onSelectDealer = ({prevDealer, newDealer, isLocal}) => {
    const {pushActionSubscribeState} = this.props;
    // статистика вне пушей, по тегу смотрим у какого дилера сколько пользователей

    if (newDealer && newDealer.region) {
      this.props.actionSetGlobalLanguage(newDealer.region);
      strings.setLanguage(newDealer.region);
    }

    if (!isLocal) {
      PushNotifications.addTag('dealer', newDealer.id);
      if (pushActionSubscribeState) {
        PushNotifications.subscribeToTopic('actions', newDealer.id);
      } else {
        PushNotifications.unsubscribeFromTopic('actions');
      }
    }
  };

  render() {
    console.log('== ChooseDealer ==', this.props);

    const {
      region,
      listRussia,
      listUkraine,
      listBelarussia,
      isFetchDealer,
      navigation,
      fetchDealers,
      fetchBrands,
      selectDealer,
      dealerSelected,
      isFetchDealersList,
    } = this.props;

    const goBack = get(navigation, 'state.params.goBack', false);
    const isLocal = get(navigation, 'state.params.isLocal', false);
    const returnScreen = get(navigation, 'state.params.returnScreen', null);
    const returnState = get(navigation, 'state.params.returnState', null);
    const listAll = get(navigation, 'state.params.listAll', null);

    return (
      <>
        <StatusBar barStyle="light-content" />
        <SelectListByCountry
          itemLayout="dealer"
          region={region}
          dataHandler={fetchDealers}
          isFetchList={isFetchDealersList || isFetchDealer}
          listRussia={listRussia}
          listUkraine={listUkraine}
          listAll={listAll}
          listBelarussia={listBelarussia}
          navigation={navigation}
          selectItem={selectDealer}
          returnScreen={returnScreen}
          returnState={returnState}
          selectedItem={dealerSelected}
          goBack={goBack}
          isLocal={isLocal}
          onSelect={this.onSelectDealer}
        />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDealerScreen);
