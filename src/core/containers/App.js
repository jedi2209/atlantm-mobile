import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { store } from '../store';
import { navigationChange } from '../../navigation/actions';
import { setAppVersion } from '../actions';

// helpers
import { get } from 'lodash';
import { getPersistStore } from './Wrapper';
import styleConst from '../style-const';

// components
import Sidebar from '../../menu/containers/Sidebar';
import DeviceInfo from 'react-native-device-info';

// routes
import getRouter from '../router';

const mapStateToProps = ({ core }) => {
  return {
    appVersion: core.version,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    setAppVersion,
    navigationChange,
  }, dispatch);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  app: {
    flex: 2,
    overflow: 'hidden',
  },
});

class App extends Component {
  // componentDidMount() {

  // }

  onNavigationStateChange = (prevState, newState) => {
    this.props.navigationChange({ prevState, newState });
  }

  render() {
    const isTablet = DeviceInfo.isTablet();
    const mainScreen = isTablet ? 'ContactsScreen' : 'MenuScreen';
    const isDealerSelected = get(store.getState(), 'dealer.selected.id');
    const Router = getRouter(isDealerSelected ? mainScreen : 'IntroScreen');

    if (!this.props.appVersion) {
      getPersistStore(() => {
        getPersistStore(() => {
          this.props.setAppVersion(1);
        }).purge();
      });
    }

    if (isTablet) {
      return (
        <View style={styles.container}>
          <Sidebar />
          <View style={styles.app}>
            <Router onNavigationStateChange={this.onNavigationStateChange}
            />
          </View>
        </View>
      );
    }

    return <Router onNavigationStateChange={this.onNavigationStateChange}
    />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
