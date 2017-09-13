import React, { Component } from 'react';
import { BackHandler, Platform } from 'react-native';
// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { store } from '../store';
import { navigationChange } from '../../navigation/actions';

// helpers
import { get } from 'lodash';

// components
import getRouter from '../router';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    navigationChange,
  }, dispatch);
};

class App extends Component {
  // initBackButton() {
  //   if (Platform.OS !== 'android') return;

  //   BackHandler.addEventListener('hardwareBackPress', this.onBackButton);
  // }

  // onBackButton() {
  //   const state = store.getState();
  // }

  render() {
    const isShowIntro = get(store.getState(), 'dealer.selected.id');
    const Router = getRouter(isShowIntro ? 'MenuScreen' : 'IntroScreen');

    const defaultGetStateForAction = Router.router.getStateForAction;
    Router.router.getStateForAction = (action, state) => {
      this.props.navigationChange(action.routeName ? action.routeName : 'MenuScreen');
      return defaultGetStateForAction(action, state);
    };

    return <Router />;
  }
}

export default connect(null, mapDispatchToProps)(App);
