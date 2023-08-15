/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {Pressable, Box, Text, Badge, Icon, Fab} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Offer from '../../core/components/Offer';
// import Badge from '../../core/components/Badge';
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
import style from '../../core/components/Footer/style';
import LogoLoader from '../../core/components/LogoLoader';

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
    listDealer: info.listDealer,
    filters: info.filters,
    filtersDealer: info.filtersDealer,
    visited: info.visited,
    dealerSelected: dealer.selected,
    isFetchInfoList: info.meta.isFetchInfoListDealer,
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

const InfoListScreen = ({
  navigation,
  dealerSelected,
  fetchInfoList,
  isFetchInfoList,
  actionListReset,
  list,
  listDealer,
  filters,
  filtersDealer,
  route,
  currLang,
}) => {
  const [isRefreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState(null);
  const zoomIn = {
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
  const {region, id: dealer} = dealerSelected;
  const fabEnable = region === 'by' ? true : false;
  let listRender = list;
  let filtersRender = filters;

  let dealerAPIRequest = null;
  if (route.params?.dealerID) {
    dealerAPIRequest = route.params?.dealerID;
    filtersRender = filtersDealer;
    listRender = listDealer;
  }

  useEffect(() => {
    console.info('== InfoListScreen ==');
    if (!isFetchInfoList) {
      actionListReset(dealerAPIRequest);
      fetchInfoList(region, dealerAPIRequest, filterType).then(action => {
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
  }, [filterType]);

  const _onRefresh = () => {
    let dealerAPIRequest = null;
    if (route.params?.dealerID) {
      dealerAPIRequest = route.params?.dealerID;
    }
    setRefreshing(true);
    fetchInfoList(region, dealerAPIRequest, filterType).then(() => {
      setRefreshing(false);
    });
  };

  const renderItem = data => {
    return (
      <TransitionView
        animation={zoomIn}
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
          bounceable={true}
          width={cardWidth}
          height={200}
          navigation={navigation.navigate}
        />
      </TransitionView>
    );
  };

  const renderEmptyComponent = () => {
    return isFetchInfoList ? (
      <View style={styles.spinnerContainer}>
        <LogoLoader
          style={{
            position: 'relative',
          }}
        />
      </View>
    ) : (
      <Text style={styles.message}>{strings.InfoListScreen.empty.text}</Text>
    );
  };

  return (
    <>
      <Box style={styles.container}>
        {!isRefreshing ? (
          <>
            {filtersRender ? (
              <View
                style={{
                  marginBottom: 5,
                  marginHorizontal: 10,
                  flexDirection: 'row',
                }}>
                {filtersRender.length > 1
                  ? filtersRender.map((el, i) => {
                      return (
                        <Pressable
                          onPress={() => {
                            filterType === el.id
                              ? setFilterType(null)
                              : setFilterType(el.id);
                          }}
                          key={'pressableFilter' + el.id + i}
                          mr={1}
                          padding={0.5}>
                          <Badge
                            key={'badgeItem' + el.id + i}
                            variant={'outline'}
                            alignSelf="center"
                            bgColor={
                              !filterType || filterType === el.id
                                ? el.badge?.background
                                : 'muted.300'
                            }
                            _text={{fontSize: 14, color: el.badge?.color}}
                            borderColor={styleConst.color.white}
                            rounded={'lg'}
                            rightIcon={
                              filterType === el.id ? (
                                <Icon
                                  size={4}
                                  as={Ionicons}
                                  name="close-outline"
                                  color="warmGray.50"
                                  _dark={{
                                    color: 'warmGray.50',
                                  }}
                                  mt={1}
                                />
                              ) : null
                            }>
                            {el.name[currLang]}
                          </Badge>
                        </Pressable>
                      );
                    })
                  : null}
              </View>
            ) : null}
            <FlatList
              data={listRender}
              extraData={isFetchInfoList}
              onRefresh={_onRefresh}
              refreshing={isRefreshing}
              ListEmptyComponent={renderEmptyComponent}
              style={styles.list}
              renderItem={renderItem}
              keyExtractor={item => `${item.hash.toString()}`}
            />
          </>
        ) : (
          <LogoLoader
            style={{
              position: 'relative',
            }}
          />
        )}
      </Box>
      {fabEnable && !isFetchInfoList ? (
        <Fab
          renderInPortal={false}
          size="sm"
          style={{backgroundColor: styleConst.new.blueHeader}}
          onPress={() =>
            navigation.navigate('ChatScreen', {
              prevScreen: 'Акции -- список',
            })
          }
          icon={
            <Icon
              size={7}
              as={Ionicons}
              name="chatbox-outline"
              color="warmGray.50"
              _dark={{
                color: 'warmGray.50',
              }}
            />
          }
        />
      ) : null}
    </>
  );
};

InfoListScreen.defaultProps = {
  type: null,
};

InfoListScreen.propTypes = {
  dealerSelected: PropTypes.object.isRequired,
  visited: PropTypes.array.isRequired,
  fetchInfoList: PropTypes.func.isRequired,
  isFetchInfoList: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoListScreen);
