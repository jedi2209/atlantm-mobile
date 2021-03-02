/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import {Container, Text, StyleProvider, Icon} from 'native-base';
import {Offer} from '../../core/components/Offer';
import TransitionView from '../../core/components/TransitionView';

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 20;

// redux
import {connect} from 'react-redux';
import {fetchInfoList, actionListReset} from '../actions';
import {
  actionSetPushGranted,
  actionSetPushActionSubscribe,
} from '../../core/actions';
import {INFO_LIST__FAIL} from '../actionTypes';

// helpers
import {get} from 'lodash';
import {ERROR_NETWORK} from '../../core/const';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import {verticalScale} from '../../utils/scale';
import strings from '../../core/lang/const';

// components
import PushNotifications from '../../core/components/PushNotifications';

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
    height: 200,
  },
  message: {
    fontFamily: styleConst.font.regular,
    fontSize: 14,
    alignSelf: 'center',
    marginTop: verticalScale(60),
    letterSpacing: styleConst.ui.letterSpacing,
  },
});

const mapStateToProps = ({dealer, info, nav, core}) => {
  return {
    nav,
    list: info.list,
    visited: info.visited,
    dealerSelected: dealer.selected,
    isFetchInfoList: info.meta.isFetchInfoList,
    pushActionSubscribeState: core.pushActionSubscribeState,
  };
};

const mapDispatchToProps = {
  fetchInfoList,
  actionListReset,
  actionSetPushGranted,
  actionSetPushActionSubscribe,
};

class InfoListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
    };
    this.zoomIn = {
      1: {
        opacity: 1,
        scale: 1,
      },
      0.5: {
        opacity: 0.5,
        scale: 0.4,
      },
      0: {
        opacity: 0,
        scale: 0,
      },
    };
  }

  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    let pushActionSubscribeState =
      (navigation.state.params &&
        navigation.state.params.pushActionSubscribeState) ||
      false;

    let onSwitchSubscribe =
      navigation.state.params && navigation.state.params.onSwitchSubscribe;

    let pushStatusLoaded =
      navigation.state.params && navigation.state.params.pushStatusLoaded;

    return {
      headerRight: () => {
        return pushStatusLoaded ? (
          <Icon
            onPress={onSwitchSubscribe}
            active={pushActionSubscribeState}
            style={{
              color: 'white',
              marginHorizontal: 10,
            }}
            name={
              pushActionSubscribeState
                ? 'ios-notifications'
                : 'ios-notifications-off'
            }
          />
        ) : null;
      },
    };
  };

  static propTypes = {
    dealerSelected: PropTypes.object.isRequired,
    list: PropTypes.array.isRequired,
    visited: PropTypes.array.isRequired,
    fetchInfoList: PropTypes.func.isRequired,
    isFetchInfoList: PropTypes.bool.isRequired,
  };

  onSwitchActionSubscribe = () => {
    const {
      dealerSelected,
      actionSetPushActionSubscribe,
      pushActionSubscribeState,
    } = this.props;

    let text,
      title = '';

    if (pushActionSubscribeState === false) {
      PushNotifications.subscribeToTopic('actions', dealerSelected.id).then(
        (isPermission) => {
          actionSetPushActionSubscribe(isPermission);
          this.props.navigation.setParams({
            pushActionSubscribeState: isPermission,
            pushStatusLoaded: true,
          });
          if (isPermission) {
            title = strings.Notifications.success.title;
            text = strings.Notifications.success.textPush;
            Alert.alert(title, text);
          }
        },
      );
    } else {
      PushNotifications.unsubscribeFromTopic('actions');
      actionSetPushActionSubscribe(false);
      this.props.navigation.setParams({
        pushActionSubscribeState: false,
        pushStatusLoaded: true,
      });
      title = strings.Notifications.success.titleSad;
      text = strings.Notifications.success.textPushSad;
      Alert.alert(title, text);
    }
  };

  componentDidMount() {
    const {
      navigation,
      dealerSelected,
      fetchInfoList,
      isFetchInfoList,
      actionListReset,
    } = this.props;
    const {region, id: dealer} = dealerSelected;

    this.props.navigation.setParams({
      pushActionSubscribeState: this.props.pushActionSubscribeState,
      onSwitchSubscribe: this.onSwitchActionSubscribe,
      pushStatusLoaded: true,
    });

    if (!isFetchInfoList) {
      actionListReset();
      fetchInfoList(region, dealer).then((action) => {
        if (action.type === INFO_LIST__FAIL) {
          let message = get(
            action,
            'payload.message',
            strings.Notifications.error.text,
          );

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }

          setTimeout(() => Alert.alert(message), 100);
        }
      });
    }
  }

  _onRefresh = () => {
    const {dealerSelected} = this.props;
    const {region, id: dealer} = dealerSelected;

    this.setState({isRefreshing: true});

    this.props.fetchInfoList(region, dealer).then(() => {
      this.setState({isRefreshing: false});
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen =
          get(rootLevel, `routes[${rootLevel.index}].routeName`) ===
          'InfoListScreen';
      }
    }

    return true;
    // return isActiveScreen;
  }

  renderItem = (data) => {
    return (
      <TransitionView
        animation={this.zoomIn}
        duration={350}
        index={data.index}
        style={[
          styleConst.shadow.default,
          {
            width: cardWidth,
            backgroundColor: '#fff',
            borderRadius: 5,
            marginVertical: 10,
            marginHorizontal: 10,
          },
        ]}>
        <Offer
          theme="round"
          key={`carousel-article-${data.item.hash}`}
          data={data}
          width={cardWidth}
          height={200}
          navigation={this.props.navigation.navigate}
        />
      </TransitionView>
    );
  };

  renderEmptyComponent = () => {
    return this.props.isFetchInfoList ? (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styles.spinner}
        />
      </View>
    ) : (
      <Text style={styles.message}>{strings.InfoListScreen.empty.text}</Text>
    );
  };

  render() {
    const {list, isFetchInfoList} = this.props;

    console.log('== InfoListScreen ==');
    return (
      <StyleProvider style={getTheme()}>
        <Container
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              tintColor={styleConst.color.blue}
              title={strings.InfoListScreen.refresh}
              progressBackgroundColor={styleConst.color.blue}
            />
          }>
          <StatusBar hidden />
          {!this.state.isRefreshing ? (
            <FlatList
              data={list}
              extraData={isFetchInfoList}
              onRefresh={this._onRefresh}
              refreshing={this.state.isRefreshing}
              ListEmptyComponent={this.renderEmptyComponent}
              style={styles.list}
              renderItem={this.renderItem}
              keyExtractor={(item) => `${item.hash.toString()}`}
            />
          ) : (
            <ActivityIndicator
              color={styleConst.color.blue}
              style={styles.spinner}
            />
          )}
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoListScreen);
