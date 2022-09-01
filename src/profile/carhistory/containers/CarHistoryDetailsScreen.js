/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, ScrollView} from 'react-native';
import {Button, HStack, View} from 'native-base';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {Divider} from 'react-native-paper';

// redux
import {connect} from 'react-redux';
import {CAR_HISTORY_DETAILS__FAIL} from '../../actionTypes';
import {actionFetchCarHistoryDetails} from '../../actions';

// components
import SpinnerView from '../../../core/components/SpinnerView';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import showPrice from '../../../utils/price';
import {ERROR_NETWORK} from '../../../core/const';
import {strings} from '../../../core/lang/const';

const styles = StyleSheet.create({
  section: {
    paddingTop: styleConst.ui.horizontalGap,
    paddingRight: styleConst.ui.horizontalGap,
    paddingBottom: styleConst.ui.horizontalGap,
    marginLeft: styleConst.ui.horizontalGap,
  },
  sectionTitle: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 14,
    color: '#141414',
    fontFamily: styleConst.font.regular,
    marginBottom: 15,
  },
  sectionHelperRow: {
    margin: 0,
    padding: 0,
  },
  sectionProp: {
    paddingRight: 5,
    marginTop: 0,
  },
  sectionValue: {
    marginTop: 5,
  },
  sectionHelper: {
    margin: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
  },
  sectionPropText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 13,
    color: '#141414',
    lineHeight: 18,
    marginTop: 6,
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 14,
    color: styleConst.color.greyText,
  },
  sectionHelperText: {
    // letterSpacing: styleConst.ui.letterSpacing,
    // fontFamily: styleConst.font.regular,
    lineHeight: 17,
    fontSize: 20,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConst.color.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  button: {
    backgroundColor: styleConst.color.lightBlue,
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: styleConst.color.white,
    textTransform: 'uppercase',
    fontSize: 16,
  },
  TabsTextStyle: {
    color: '#000',
  },
  TabsActiveTextStyle: {
    color: styleConst.color.lightBlue,
  },
});

const mapStateToProps = ({nav, profile}) => {
  return {
    nav,
    profile: profile.login,
    details: profile.carHistory.details,
    isFetchCarHistoryDetails: profile.carHistory.meta.isFetchCarHistoryDetails,
  };
};

const mapDispatchToProps = {
  actionFetchCarHistoryDetails,
};

const CarHistoryDetailsScreen = props => {
  const {isFetchCarHistoryDetails, details, profile, navigation} = props;
  const vin = get(props.route, 'params.vin');
  const title = get(props.route, 'params.title');
  const workId = get(props.route, 'params.workId');
  const workDealer = get(props.route, 'params.workDealer');
  const token = profile.SAP.TOKEN;
  const userid = profile.SAP.ID;

  let renderScene;

  const [routes, setRoutesHead] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [index, setIndex] = useState(0);

  const _renderTable = ({name, count, units, summ}, idx) => {
    return (
      <>
        <View key={`${name}${idx}`} style={styles.section}>
          {name ? <Text style={styles.sectionTitle}>{name}</Text> : null}
          {count
            ? _renderItem({
                prop: strings.CarHistoryDetailsScreen.count,
                value: `${count} ${units}.`,
              })
            : null}
          {get(summ, 'value')
            ? _renderItem({
                prop: strings.CarHistoryDetailsScreen.price,
                value: showPrice(
                  get(summ, 'value'),
                  get(summ, 'currency'),
                  true,
                ),
              })
            : null}
          {/* {get(summ, 'sale')
            ? this.renderHelper('-', styleConst.color.red)
            : null} */}
          {get(summ, 'sale')
            ? _renderItem({
                prop: strings.CarHistoryDetailsScreen.sale,
                value: showPrice(
                  get(summ, 'sale'),
                  get(summ, 'currency'),
                  true,
                ),
              })
            : null}
          {/* {get(summ, 'tax')
            ? this.renderHelper('+', styleConst.color.green)
            : null} */}
          {get(summ, 'tax')
            ? _renderItem({
                prop: strings.CarHistoryDetailsScreen.tax,
                value: showPrice(get(summ, 'tax'), get(summ, 'currency'), true),
              })
            : null}
          {get(summ, 'total')
            ? _renderItem({
                prop: strings.CarHistoryDetailsScreen.total.nds,
                value: showPrice(
                  get(summ, 'total'),
                  get(summ, 'currency'),
                  true,
                ),
              })
            : null}
        </View>
        <Divider />
      </>
    );
  };

  const _renderItem = ({prop, value}) => (
    <HStack>
      <View style={styles.sectionProp}>
        <Text style={styles.sectionPropText}>{`${prop}:`}</Text>
      </View>
      <View style={styles.sectionValue}>
        <Text style={styles.sectionValueText}>{value}</Text>
      </View>
    </HStack>
  );

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: styleConst.color.lightBlue}}
      style={[{backgroundColor: styleConst.color.white}]}
      renderLabel={({route, focused, color}) => {
        return (
          <Text
            style={{
              color: focused ? '#000' : styleConst.color.darkBg,
              margin: 8,
            }}>
            {route.title}
          </Text>
        );
      }}
    />
  );

  useEffect(() => {
    Analytics.logEvent('screen', 'lkk/carhistory/details');

    props
      .actionFetchCarHistoryDetails({vin, token, userid, workId, workDealer})
      .then(action => {
        if (action.type === CAR_HISTORY_DETAILS__FAIL) {
          let message = get(
            action,
            'payload.message',
            strings.Notifications.error.text,
          );

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }
        }
        setTimeout(() => {
          navigation.setParams({
            mainTitle: 'Заказ-наряд #' + workId,
          });
        }, 150);
      });
  }, []);

  useEffect(() => {
    let heads = [];
    let tabWorks, tabParts;
    if (details.works && details.works.length) {
      heads.push({
        key: 'works',
        title: strings.CarHistoryDetailsScreen.works,
      });
      tabWorks = () => (
        <ScrollView>
          {details.works.map((item, idx) => _renderTable(item, idx))}
        </ScrollView>
      );
    }

    if (details.parts && details.parts.length) {
      heads.push({
        key: 'parts',
        title: strings.CarHistoryDetailsScreen.materials,
      });
      tabParts = () => {
        return (
          <ScrollView>
            {details.parts.map((item, idx) => _renderTable(item, idx))}
          </ScrollView>
        );
      };
    }

    setTabs({works: tabWorks, parts: tabParts});
    setRoutesHead(heads);
  }, [details]);

  if (tabs.works || tabs.parts) {
    renderScene = SceneMap({
      works: tabs.works,
      parts: tabs.parts,
    });
  }

  if (isFetchCarHistoryDetails) {
    return (
      <SpinnerView containerStyle={{backgroundColor: styleConst.color.white}} />
    );
  }

  console.info('== CarHistoryDetails ==');

  // modalStyles.container

  return (
    <View style={{flex: 1}}>
      {renderScene ? (
        <TabView
          navigationState={{index, routes}}
          renderTabBar={renderTabBar}
          renderScene={renderScene}
          onIndexChange={setIndex}
        />
      ) : null}
      <View py={7} px={'5%'} shadow={5}>
        <Button
          style={modalStyles.button}
          _text={modalStyles.buttonText}
          onPress={() => navigation.goBack()}>
          {strings.ModalView.close}
        </Button>
      </View>
    </View>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CarHistoryDetailsScreen);
