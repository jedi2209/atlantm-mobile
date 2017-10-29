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

const removeDuplicateRoutes = (state) => {
  if (!state.routes) return state

  let duplicateRoutesCount = 0

  const routes = state.routes.reduce((out, route, index) => {
    const cleanRoute = removeDuplicateRoutes(route)

    if (!index) {
      out.push(cleanRoute)
    } else {
      const prevIndex = index - 1
      const prevRouteName = out[prevIndex].routeName
      if (prevRouteName === route.routeName) {
        ++duplicateRoutesCount
        out[prevIndex] = cleanRoute
      } else {
        out.push(cleanRoute)
      }
    }

    return out
  }, [])

  // don't clone state, we want to keep references intact (at least at the top
  // level)
  state.routes = routes
  state.index -= duplicateRoutesCount

  return state
}

class App extends Component {
  // componentDidMount() {
  //   if (!this.props.appVersion) {
  //     getPersistStore().purge();
  //     this.props.setAppVersion(1);
  //   }
  // }

  onNavigationStateChange = (prevState, newState) => {
    this.props.navigationChange({ prevState, newState });
  }

  render() {
    const isTablet = DeviceInfo.isTablet();
    const mainScreen = isTablet ? 'ContactsScreen' : 'MenuScreen';
    const isDealerSelected = get(store.getState(), 'dealer.selected.id');
    const Router = getRouter(isDealerSelected ? mainScreen : 'IntroScreen');

    // const defaultGetStateForAction = Router.router.getStateForAction;
    // Router.router.getStateForAction = (action, state) => {
    //   // console.log('action', action);
    //   // console.log('state', state);

    //   // if (state && action && action.routeName === 'UsedCarCityScreen') {
    //   //   console.log('state.routes[1].routes', state.routes[1].routes);
    //   //   state.routes[1].routes = state.routes[1].routes.filter(route => {
    //   //     console.log('route', route);
    //   //     // return route.routeName !== 'UsedCarListScreen';
    //   //     return true;
    //   //   });
    //   // }

    //   if (state) {
    //     console.log('before', state);
    //     let newState = { ...state };
    //     newState = removeDuplicateRoutes(state);
    //     console.log('after', newState);
    //   }

    //   // this.props.navigationChange(action.routeName ? action.routeName : mainScreen);
    //   return defaultGetStateForAction(action, state);
    // };

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
