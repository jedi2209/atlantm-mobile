/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import {Row, Col, Button, Content, Segment} from 'native-base';

// redux
import {connect} from 'react-redux';
import {CAR_HISTORY_DETAILS__FAIL} from '../../actionTypes';
import {actionFetchCarHistoryDetails} from '../../actions';

// components
import SpinnerView from '../../../core/components/SpinnerView';

// helpers
import Amplitude from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import showPrice from '../../../utils/price';
import {ERROR_NETWORK} from '../../../core/const';
import {strings} from '../../../core/lang/const';

const TABS = {
  WORKS: 'works',
  PARTS: 'parts',
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.white,
  },
  // section
  section: {
    paddingTop: styleConst.ui.horizontalGap,
    paddingRight: styleConst.ui.horizontalGap,
    paddingBottom: styleConst.ui.horizontalGap,
    marginLeft: styleConst.ui.horizontalGap,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.border,
  },
  segment: {
    marginHorizontal: styleConst.ui.horizontalGap,
    marginBottom: 24,
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
  },
  sectionHelperText: {
    // letterSpacing: styleConst.ui.letterSpacing,
    // fontFamily: styleConst.font.regular,
    lineHeight: 17,
    fontSize: 20,
  },
  tabText: {
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    color: '#141414',
    fontSize: 20,
  },
  tabTextActive: {
    color: styleConst.color.lightBlue,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 20,
  },
  tabButton: {
    borderColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    color: '#141414',
    paddingLeft: 0,
    paddingRight: 0,
    height: 45,
  },
  tabButtonActive: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderBottomColor: styleConst.color.lightBlue,
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    height: 45,
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

    this.state = {tabName: TABS.WORKS};
  }

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;

    return {
      headerTitle: <Text>{params.title}</Text>,
    };
  };

  componentDidMount() {
    Amplitude.logEvent('screen', 'lkk/carhistory/details');

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

          console.log(message);
        } else {
          console.log('ya recive some data', this.props.details);
        }
      },
    );
  }

  selectWorksTab = () => this.setState({tabName: TABS.WORKS});
  selectPartsTab = () => this.setState({tabName: TABS.PARTS});

  renderTable = ({name, count, units, summ}, idx) => {
    return (
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
    );
  };

  renderItem = ({prop, value}) => (
    <Row style={styles.sectionRow}>
      <Col style={styles.sectionProp}>
        <Text style={styles.sectionPropText}>{`${prop}:`}</Text>
      </Col>
      <Col style={styles.sectionValue}>
        <Text style={styles.sectionValueText}>{value}</Text>
      </Col>
    </Row>
  );

  renderHelper = (value, color) => (
    <Row style={styles.sectionHelperRow}>
      <Col style={styles.sectionProp} />
      <Col style={styles.sectionHelper}>
        <Text style={[styles.sectionHelperText, color ? {color: color} : {}]}>
          {value}
        </Text>
      </Col>
    </Row>
  );

  render() {
    const {tabName} = this.state;
    const isActiveWorksTab = tabName === TABS.WORKS;
    const isActivePartsTab = tabName === TABS.PARTS;
    const {isFetchCarHistoryDetails, details} = this.props;

    console.log('== CarHistoryDetails ==');

    if (isFetchCarHistoryDetails) {
      return (
        <SpinnerView
          containerStyle={{backgroundColor: styleConst.color.white}}
        />
      );
    }

    const works = get(details, 'works');
    const parts = get(details, 'parts');

    console.log('works, parts', works, parts);

    return (
      <SafeAreaView style={styles.safearea}>
        <StatusBar barStyle="dark-content" />
        <ScrollView>
          <Content>
            <Segment style={styles.segment}>
              {works ? (
                <Button
                  active={isActiveWorksTab}
                  onPress={this.selectWorksTab}
                  style={
                    isActiveWorksTab ? styles.tabButtonActive : styles.tabButton
                  }>
                  <Text
                    style={
                      isActiveWorksTab ? styles.tabTextActive : styles.tabText
                    }>
                    {strings.CarHistoryDetailsScreen.works}
                  </Text>
                </Button>
              ) : null}
              {parts ? (
                <Button
                  active={isActivePartsTab}
                  onPress={this.selectPartsTab}
                  style={
                    isActivePartsTab ? styles.tabButtonActive : styles.tabButton
                  }>
                  <Text
                    style={
                      isActivePartsTab ? styles.tabTextActive : styles.tabText
                    }>
                    {strings.CarHistoryDetailsScreen.materials}
                  </Text>
                </Button>
              ) : null}
            </Segment>

            {isActiveWorksTab && works ? (
              <View style={styles.tabContent}>
                {works.map((item, idx) => this.renderTable(item, idx))}
              </View>
            ) : null}
            {isActivePartsTab && parts ? (
              <View style={styles.tabContent}>
                {parts.map((item, idx) => this.renderTable(item, idx))}
              </View>
            ) : null}
          </Content>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CarHistoryDetailsScreen);
