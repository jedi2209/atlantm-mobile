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
} from 'react-native';
import PropTypes from 'prop-types';
import {Container, Text, StyleProvider, Icon} from 'native-base';
import {Offer} from '@core/components/Offer';

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 20;

// redux
import {connect} from 'react-redux';
import {fetchInfoList, actionListReset} from '../actions';
import {
  actionSetPushGranted,
  actionSetPushActionSubscribe,
} from '@core/actions';
import {INFO_LIST__FAIL} from '../actionTypes';

// helpers
import {get, isFunction} from 'lodash';
import {ERROR_NETWORK} from '@core/const';
import getTheme from '../../../native-base-theme/components';
import styleConst from '@core/style-const';
import stylesHeader from '@core/components/Header/style';
import {verticalScale} from '../../utils/scale';

// components
// import DealerItemList from '../../core/components/DealerItemList';
// import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '@core/components/HeaderIconBack/HeaderIconBack';
import PushNotifications from '@core/components/PushNotifications';

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
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

    return {
      headerTitle: <Text style={stylesHeader.blueHeaderTitle}>Акции</Text>,
      headerStyle: stylesHeader.blueHeader,
      headerTitleStyle: stylesHeader.blueHeaderTitle,
      headerLeft: (
        <View>
          <HeaderIconBack
            theme="white"
            navigation={navigation}
            returnScreen={returnScreen}
          />
        </View>
      ),
      headerRight: (
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
      ),
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

    if (pushActionSubscribeState === false) {
      PushNotifications.subscribeToTopic('actions', dealerSelected.id).then(
        isPermission => {
          actionSetPushActionSubscribe(isPermission);
          this.props.navigation.setParams({
            pushActionSubscribeState: isPermission,
          });
        },
      );
    } else {
      PushNotifications.unsubscribeFromTopic('actions');
      actionSetPushActionSubscribe(false);
      this.props.navigation.setParams({
        pushActionSubscribeState: false,
      });
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
    });

    if (!isFetchInfoList) {
      actionListReset();
      fetchInfoList(region, dealer).then(action => {
        if (action.type === INFO_LIST__FAIL) {
          let message = get(
            action,
            'payload.message',
            'Произошла ошибка, попробуйте снова',
          );

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }

          setTimeout(() => Alert.alert(message), 100);
        }
      });
    }
  }

  onRefresh = () => {
    const {dealerSelected, list, fetchInfoList} = this.props;
    const {region, id: dealer} = dealerSelected;

    this.setState({isRefreshing: true});

    fetchInfoList(region, dealer).then(() => {
      this.setState({isRefreshing: false});
    });
  };

  shouldComponentUpdate(nextProps) {
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

    return isActiveScreen;
  }

  renderItem = data => {
    return (
      <View
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
      </View>
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
      <Text style={styles.message}>В данный момент нет акций</Text>
    );
  };

  render() {
    const {
      list,
      visited,
      navigation,
      dealerSelected,
      isFetchInfoList,
    } = this.props;

    // Для iPad меню, которое находится вне роутера
    // window.atlantmNavigation = navigation;

    console.log('== InfoListScreen ==');
    console.log('list', list);
    return (
      <StyleProvider style={getTheme()}>
        <Container style={styles.container}>
          <StatusBar barStyle="light-content" />
          <FlatList
            data={list}
            extraData={isFetchInfoList}
            onRefresh={this.onRefresh}
            refreshing={this.state.isRefreshing}
            ListEmptyComponent={this.renderEmptyComponent}
            style={styles.list}
            renderItem={this.renderItem}
            keyExtractor={item => `${item.hash.toString()}`}
          />
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InfoListScreen);
