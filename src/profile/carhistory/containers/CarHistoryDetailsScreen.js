/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import {Row, Col, Button, Content, Tab, Tabs, DefaultTabBar} from 'native-base';
import { Divider } from 'react-native-paper';

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
  wrapper: {
    paddingHorizontal: '5%',
    paddingVertical: 10,
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

class CarHistoryDetailsScreen extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;

    return {
      headerTitle: <Text>{params.title}</Text>,
    };
  };

  componentDidMount() {
    Analytics.logEvent('screen', 'lkk/carhistory/details');

    const {profile, navigation, actionFetchCarHistoryDetails} = this.props;
    const vin = get(this.props.route, 'params.vin');
    const title = get(this.props.route, 'params.title');
    const workId = get(this.props.route, 'params.workId');
    const workDealer = get(this.props.route, 'params.workDealer');
    const token = profile.SAP.TOKEN;
    const userid = profile.SAP.ID;

    navigation.setParams({title});

    actionFetchCarHistoryDetails({vin, token, userid, workId, workDealer}).then(
      (action) => {
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
        }, 150)
      },
    );
  }


  renderTable = ({name, count, units, summ}, idx) => {
    return (
      <>
        <View key={`${name}${idx}`} style={styles.section}>
          {name ? <Text style={styles.sectionTitle}>{name}</Text> : null}
          {count
            ? this.renderItem({
                prop: strings.CarHistoryDetailsScreen.count,
                value: `${count} ${units}.`,
              })
            : null}
          {get(summ, 'value')
            ? this.renderItem({
                prop: strings.CarHistoryDetailsScreen.price,
                value: showPrice(get(summ, 'value'), get(summ, 'currency'), true),
              })
            : null}
          {/* {get(summ, 'sale')
            ? this.renderHelper('-', styleConst.color.red)
            : null} */}
          {get(summ, 'sale')
            ? this.renderItem({
                prop: strings.CarHistoryDetailsScreen.sale,
                value: showPrice(get(summ, 'sale'), get(summ, 'currency'), true),
              })
            : null}
          {/* {get(summ, 'tax')
            ? this.renderHelper('+', styleConst.color.green)
            : null} */}
          {get(summ, 'tax')
            ? this.renderItem({
                prop: strings.CarHistoryDetailsScreen.tax,
                value: showPrice(get(summ, 'tax'), get(summ, 'currency'), true),
              })
            : null}
          {get(summ, 'total')
            ? this.renderItem({
                prop: strings.CarHistoryDetailsScreen.total.nds,
                value: showPrice(get(summ, 'total'), get(summ, 'currency'), true),
              })
            : null}
        </View>
        <Divider />
      </>
    );
  };

  renderItem = ({prop, value}) => (
    <Row>
      <Col style={styles.sectionProp}>
        <Text style={styles.sectionPropText}>{`${prop}:`}</Text>
      </Col>
      <Col style={styles.sectionValue}>
        <Text style={styles.sectionValueText}>{value}</Text>
      </Col>
    </Row>
  );

  // renderHelper = (value, color) => (
  //   <Row style={styles.sectionHelperRow}>
  //     <Col style={styles.sectionProp} />
  //     <Col style={styles.sectionHelper}>
  //       <Text style={[styles.sectionHelperText, color ? {color: color} : {}]}>
  //         {value}
  //       </Text>
  //     </Col>
  //   </Row>
  // );

  renderTabBar = props => {
    props.tabStyle = Object.create(props.tabStyle);
    return <DefaultTabBar {...props} />;
  };

  render() {
    const {isFetchCarHistoryDetails, details} = this.props;

    console.info('== CarHistoryDetails ==');

    if (isFetchCarHistoryDetails) {
      return (
        <SpinnerView
          containerStyle={{backgroundColor: styleConst.color.white}}
        />
      );
    }

    const works = get(details, 'works');
    const parts = get(details, 'parts');

    return (
      <View style={modalStyles.container}>
        <SafeAreaView style={{flex: 1}}>
          <Tabs
            renderTabBar={this.renderTabBar}
            tabBarUnderlineStyle={{
              backgroundColor: styleConst.color.lightBlue,
            }}>
            {works && works.length ? (
              <Tab
                heading={strings.CarHistoryDetailsScreen.works}
                textStyle={modalStyles.TabsTextStyle}
                activeTextStyle={modalStyles.TabsActiveTextStyle}
                activeTabStyle={modalStyles.TabsActiveTabStyle}>
                <ScrollView>
                  <Content>
                    <View style={styles.tabContent}>
                      {works.map((item, idx) => this.renderTable(item, idx))}
                    </View>
                  </Content>
                </ScrollView>
              </Tab>
            ) : null}
            {parts && parts.length ? (
              <Tab
                heading={strings.CarHistoryDetailsScreen.materials}
                textStyle={modalStyles.TabsTextStyle}
                activeTextStyle={modalStyles.TabsActiveTextStyle}
                activeTabStyle={modalStyles.TabsActiveTabStyle}>
                <ScrollView>
                  <Content>
                    <View style={styles.tabContent}>
                      {parts.map((item, idx) => this.renderTable(item, idx))}
                    </View>
                  </Content>
                </ScrollView>
              </Tab>
            ) : null}
          </Tabs>
          <View style={modalStyles.wrapper}>
            <Button full style={modalStyles.button} onPress={() => this.props.navigation.goBack()}>
              <Text style={modalStyles.buttonText}>{strings.ModalView.close}</Text>
            </Button>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CarHistoryDetailsScreen);
