import React from 'react';

// redux
import {connect} from 'react-redux';
import {actionSetPushActionSubscribe} from '../../core/actions';

// actions
import {fetchDealers, fetchBrands} from '../actions';

// components
import SelectListByCountry from '../../core/components/SelectListByCountry';
import PushNotifications from '../../core/components/PushNotifications';

// helpers
import {get} from 'lodash';

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
    settings: core.settings,
    pushActionSubscribeState: core.pushActionSubscribeState,
  };
};

const mapDispatchToProps = {
  fetchDealers,
  fetchBrands,
  actionSetPushActionSubscribe,
};

const _onSelectDealer = props => {
  const {pushActionSubscribeState, newDealer} = props;
  // статистика вне пушей, по тегу смотрим у какого дилера сколько пользователей

  if (pushActionSubscribeState) {
    PushNotifications.subscribeToTopic('actions', newDealer.id);
  } else {
    PushNotifications.unsubscribeFromTopic('actions');
  }
};

const ChooseDealerScreen = props => {
  const {
    region,
    listRussia,
    listUkraine,
    listBelarussia,
    isFetchDealer,
    dealerSelected,
    isFetchDealersList,
    settings,
  } = props;

  const goBack = get(props.route, 'params.goBack', false);
  const isLocal = get(props.route, 'params.isLocal', false);
  const returnScreen = get(props.route, 'params.returnScreen', null);
  const returnState = get(props.route, 'params.returnState', null);
  const listAll = get(props.route, 'params.listAll', null);

  if (props.listBrands && props.listBrands.length === 0) {
    props.fetchBrands();
  }

  console.info('== ChooseDealer ==', props);

  return (
    <>
      <SelectListByCountry
        itemLayout="dealer"
        region={region}
        dataHandler={props.fetchDealers}
        isFetchList={isFetchDealersList || isFetchDealer}
        listRussia={listRussia}
        listUkraine={listUkraine}
        listAll={listAll}
        listBelarussia={listBelarussia}
        returnScreen={returnScreen}
        returnState={returnState}
        selectedItem={dealerSelected}
        goBack={goBack}
        isLocal={isLocal}
        settings={settings}
        onSelect={_onSelectDealer}
      />
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDealerScreen);
