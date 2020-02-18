/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import {Row, Col, Button, Content, Segment} from 'native-base';

// redux
import {connect} from 'react-redux';
import {CAR_HISTORY_DETAILS__FAIL} from '../../actionTypes';
import {actionFetchCarHistoryDetails} from '../../actions';

// components
import SpinnerView from '../../../core/components/SpinnerView';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import Amplitude from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import numberWithGap from '../../../utils/number-with-gap';
import {ERROR_NETWORK} from '../../../core/const';

const TABS = {
  WORKS: 'works',
  PARTS: 'parts',
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#fff',
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
  sectionProp: {
    paddingRight: 5,
    marginTop: 0,
  },
  sectionValue: {
    marginTop: 5,
  },
  sectionPropText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 14,
    color: '#141414',
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 16,
  },
  tabText: {
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    color: '#141414',
    fontSize: 20,
  },
  tabTextActive: {
    color: styleConst.new.blueHeader,
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
    borderBottomColor: styleConst.new.blueHeader,
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
    auth: profile.auth,
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
      headerTitle: (
        <Text style={stylesHeader.whiteHeaderTitle}>{params.title}</Text>
      ),
      headerStyle: stylesHeader.whiteHeader,
      headerTitleStyle: stylesHeader.whiteHeaderTitle,
      headerLeft: <HeaderIconBack theme="blue" navigation={navigation} />,
      headerRight: <View />,
    };
  };

  componentDidMount() {
    Amplitude.logEvent('screen', 'lkk/carhistory/details');

    const {profile, navigation, actionFetchCarHistoryDetails} = this.props;
    const vin = get(navigation, 'state.params.vin');
    const title = get(navigation, 'state.params.title');
    const workId = get(navigation, 'state.params.workId');
    const workDealer = get(navigation, 'state.params.workDealer');
    const token = profile.SAP.TOKEN;
    const userid = profile.SAP.ID;

    navigation.setParams({title});

    actionFetchCarHistoryDetails({vin, token, userid, workId, workDealer}).then(
      action => {
        if (action.type === CAR_HISTORY_DETAILS__FAIL) {
          let message = get(
            action,
            'payload.message',
            'Произошла ошибка, попробуйте снова',
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
          ? this.renderItem({prop: 'Количество', value: `${count} ${units}.`})
          : null}
        {get(summ, 'value')
          ? this.renderItem({
              prop: 'Стоимость',
              value: `${numberWithGap(get(summ, 'value'))} ${get(
                summ,
                'currency',
              )}`,
            })
          : null}
        {get(summ, 'sale')
          ? this.renderItem({
              prop: 'Скидка',
              value: `${numberWithGap(get(summ, 'sale'))} ${get(
                summ,
                'currency',
              )}`,
            })
          : null}
        {get(summ, 'total')
          ? this.renderItem({
              prop: 'Итого с НДС',
              value: `${numberWithGap(get(summ, 'total'))} ${get(
                summ,
                'currency',
              )}`,
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

  render() {
    const {tabName} = this.state;
    const isActiveWorksTab = tabName === TABS.WORKS;
    const isActivePartsTab = tabName === TABS.PARTS;
    const {isFetchCarHistoryDetails, details} = this.props;

    console.log('== CarHistoryDetails ==');

    if (isFetchCarHistoryDetails) {
      return <SpinnerView containerStyle={{backgroundColor: '#fff'}} />;
    }

    const works = get(details, 'works');
    const parts = get(details, 'parts');

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
                    Работы
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
                    Материалы
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
