import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { store } from '../store';
import { navigationChange } from '../../navigation/actions';

// helpers
import { get } from 'lodash';

// components
import getRouter from '../router';
import Sidebar from '../../menu/components/Sidebar';
import DeviceInfo from 'react-native-device-info';

const mapStateToProps = ({ nav }) => {
  return {
    nav,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    navigationChange,
  }, dispatch);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  menu: {
    flex: 1,
    borderRightWidth: 5,
    borderRightColor: '#000',
  },
  app: {
    flex: 2,
    overflow: 'hidden',
  },
});

class App extends Component {
  render() {
    const isTablet = DeviceInfo.isTablet();
    const mainScreen = isTablet ? 'ContactsScreen' : 'MenuScreen';
    const isShowIntro = get(store.getState(), 'dealer.selected.id');
    const Router = getRouter(isShowIntro ? mainScreen : 'IntroScreen');

    const defaultGetStateForAction = Router.router.getStateForAction;
    Router.router.getStateForAction = (action, state) => {
      this.props.navigationChange(action.routeName ? action.routeName : mainScreen);
      return defaultGetStateForAction(action, state);
    };

    if (isTablet) {
      return (
        <View style={styles.container}>
          <View style={styles.menu}>
            <Sidebar
              nav={this.props.nav}
              navigation={this.props.navigation}
            />
          </View>
          <View style={styles.app}>
            <Router />
          </View>
        </View>
      );
    }

    return <Router />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
