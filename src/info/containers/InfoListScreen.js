/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Stack, Box, Text} from 'native-base';
import {Offer} from '../../core/components/Offer';
import Badge from '../../core/components/Badge';
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
import styleConst from '../../core/style-const';
import {verticalScale} from '../../utils/scale';
import {strings} from '../../core/lang/const';

// components
import PushNotifications from '../../core/components/PushNotifications';

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
    paddingBottom: 20,
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
    filters: info.filters,
    visited: info.visited,
    dealerSelected: dealer.selected,
    isFetchInfoList: info.meta.isFetchInfoList,
    pushActionSubscribeState: core.pushActionSubscribeState,
    currLang: core.language.selected,
  };
};

const mapDispatchToProps = {
  fetchInfoList,
  actionListReset,
  actionSetPushGranted,
  actionSetPushActionSubscribe,
};

class InfoListScreen extends Component {
  static defaultProps = {
    type: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      type: null,
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
        isPermission => {
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

    if (!isFetchInfoList) {
      actionListReset();
      fetchInfoList(region, dealer, this.state.type).then(action => {
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

    this.props.fetchInfoList(region, dealer, this.state.type).then(() => {
      this.setState({isRefreshing: false});
    });
  };

  renderItem = data => {
    return (
      <TransitionView
        animation={this.zoomIn}
        duration={350}
        index={data.index}
        style={[
          styleConst.shadow.default,
          {
            width: cardWidth,
            backgroundColor: styleConst.color.white,
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
    const {
      list,
      filters,
      fetchInfoList,
      actionListReset,
      isFetchInfoList,
      dealerSelected,
      currLang,
    } = this.props;

    const {region, id: dealer} = dealerSelected;

    console.info('== InfoListScreen ==');
    return (
      <Box
        style={styles.container}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={this.state.refreshing}
        //     onRefresh={this._onRefresh}
        //     tintColor={styleConst.color.blue}
        //     title={strings.InfoListScreen.refresh}
        //     progressBackgroundColor={styleConst.color.blue}
        //   />
        // }
      >
        {!this.state.isRefreshing ? (
          <>
            {filters ? (
              <View
                style={{
                  marginBottom: 5,
                  marginHorizontal: 10,
                  flexDirection: 'row',
                }}>
                {filters.map((el, i) => {
                  return (
                    <Badge
                      id={el.id}
                      key={'badgeItem' + el.id + i}
                      index={i}
                      bgColor={el.badge?.background}
                      name={el.name[currLang]}
                      textColor={el.badge?.color}
                      badgeContainerStyle={{marginRight: 20, padding: 10}}
                      textStyle={{fontSize: 14}}
                      onPress={() => {
                        this.setState(
                          {
                            type: el.id,
                          },
                          () => {
                            if (!isFetchInfoList) {
                              actionListReset();
                              fetchInfoList(
                                region,
                                dealer,
                                this.state.type,
                              ).then(action => {
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
                          },
                        );
                      }}
                    />
                  );
                })}
              </View>
            ) : null}
            <FlatList
              data={list}
              extraData={isFetchInfoList}
              onRefresh={this._onRefresh}
              refreshing={this.state.isRefreshing}
              ListEmptyComponent={this.renderEmptyComponent}
              style={styles.list}
              renderItem={this.renderItem}
              keyExtractor={item => `${item.hash.toString()}`}
            />
          </>
        ) : (
          <ActivityIndicator
            color={styleConst.color.blue}
            style={styles.spinner}
          />
        )}
      </Box>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoListScreen);
