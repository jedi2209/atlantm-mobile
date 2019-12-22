// Начни работать сука нет времени прокрастинировать
import React, {Component} from 'react';
import {View} from 'react-native';

// redux
import {connect} from 'react-redux';
import {actionSetPushActionSubscribe} from '../../core/actions';
// actions
import {fetchDealers, selectDealer, selectRegion} from '../actions';

// components
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import SelectListByCountry from '../../core/components/SelectListByCountry';
import PushNotifications from '../../core/components/PushNotifications';

// helpers
import {get} from 'lodash';
import stylesHeader from '../../core/components/Header/style';

const mapStateToProps = ({dealer, nav, core}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    region: dealer.region,
    listRussia: dealer.listRussia,
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
  selectDealer,
  selectRegion,
  actionSetPushActionSubscribe,
};

class ChooseDealerScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'выбор автоцентра',
    headerStyle: stylesHeader.blueHeader,
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: <HeaderIconBack theme="white" navigation={navigation} />,
    headerRight: <View />,
  });

  // ВАЖНО! ЯВНО ОТКЛЮЧЕН ИЗ-ЗА ПРОБЛЕМ ПЕРВОЙ ЗАГРУЗКИ НА IOS 11+
  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;

    return nav.routes[nav.index].routeName === 'ChooseDealerScreen';
  }

  onSelectDealer = ({prevDealer, newDealer}) => {
    const {pushActionSubscribeState} = this.props;
    // статистика вне пушей, по тегу смотрим у какого дилера сколько пользователей
    PushNotifications.addTag('dealer', newDealer.id);

    if (pushActionSubscribeState) {
      PushNotifications.subscribeToTopic('actions', newDealer.id);
    } else {
      PushNotifications.unsubscribeFromTopic('actions');
    }
  };

  render() {
    console.log('== ChooseDealer ==');

    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      region,
      listRussia,
      listUkraine,
      listBelarussia,
      isFetchDealer,
      navigation,
      fetchDealers,
      selectRegion,
      selectDealer,
      dealerSelected,
      isFetchDealersList,
    } = this.props;

    const goBack = get(navigation, 'state.params.goBack');

    return (
      <SelectListByCountry
        itemLayout="dealer"
        region={region}
        dataHandler={fetchDealers}
        isFetchList={isFetchDealersList || isFetchDealer}
        listRussia={listRussia}
        listUkraine={listUkraine}
        listBelarussia={listBelarussia}
        selectRegion={selectRegion}
        navigation={navigation}
        selectItem={selectDealer}
        selectedItem={dealerSelected}
        goBack={goBack}
        onSelect={this.onSelectDealer}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChooseDealerScreen);
