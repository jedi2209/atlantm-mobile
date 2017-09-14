import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { store } from '../store';
import { navigationChange } from '../../navigation/actions';

// helpers
import { get } from 'lodash';
import styleConst from '../style-const';

// components
import Sidebar from '../../menu/components/Sidebar';
import DeviceInfo from 'react-native-device-info';

// routes
import getRouter from '../router';

const mapStateToProps = () => {
  return {
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
    flex: 1.3,
    borderRightWidth: 1,
    borderRightColor: styleConst.color.greyText2,
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
      // this.props.navigationChange(action.routeName ? action.routeName : mainScreen);
      return defaultGetStateForAction(action, state);
    };

    if (isTablet) {
      return (
        <View style={styles.container}>
          <View style={styles.menu}>
            <Sidebar />
          </View>
          <View style={styles.app}>
            <Router onNavigationStateChange={(prevState, newState) => {
              this.props.navigationChange({
                prevState,
                newState,
              });
            }}
            />
          </View>
        </View>
      );
    }

    return <Router />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
