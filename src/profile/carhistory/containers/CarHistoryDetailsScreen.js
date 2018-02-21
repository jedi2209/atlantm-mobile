import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import {
  Row,
  Col,
  Button,
  Content,
  Segment,
  Container,
  StyleProvider,
} from 'native-base';

// redux
import { connect } from 'react-redux';
import { CAR_HISTORY_DETAILS__FAIL } from '../../actionTypes';
import { actionFetchCarHistoryDetails } from '../../actions';

// components
import SpinnerView from '../../../core/components/SpinnerView';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import { get } from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import numberWithGap from '../../../utils/number-with-gap';
import { ERROR_NETWORK } from '../../../core/const';

const TABS = {
  WORKS: 'works',
  PARTS: 'parts',
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
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
  },
  sectionTitle: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 18,
    fontFamily: styleConst.font.regular,
    marginBottom: 10,
  },
  sectionProp: {
    paddingRight: 5,
    marginTop: 5,
  },
  sectionValue: {
    marginTop: 5,
  },
  sectionPropText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 17,
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 16,
  },
  tabText: {
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.greyBlueText,
  },
  tabTextActive: {
    color: '#fff',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  tabButton: {
    borderColor: styleConst.color.greyBlue,
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 0,
    paddingRight: 0,
  },
  tabButtonActive: {
    backgroundColor: styleConst.color.greyBlue,
    borderColor: styleConst.color.greyBlue,
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 0,
    paddingRight: 0,
  },
});

const mapStateToProps = ({ nav, profile }) => {
  return {
    nav,
    auth: profile.auth,
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

    this.state = { tabName: TABS.WORKS };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerTitle: params.title,
      headerStyle: stylesHeader.common,
      headerTitleStyle: stylesHeader.title,
      headerLeft: <HeaderIconBack navigation={navigation} />,
      headerRight: <View />,
    };
  }

  componentDidMount() {
    const { auth, navigation, actionFetchCarHistoryDetails } = this.props;
    const vin = get(navigation, 'state.params.vin');
    const title = get(navigation, 'state.params.title');
    const workId = get(navigation, 'state.params.workId');
    const workDealer = get(navigation, 'state.params.workDealer');
    const token = get(auth, 'token.id');

    navigation.setParams({ title });

    actionFetchCarHistoryDetails({ vin, token, workId, workDealer })
      .then(action => {
        if (action.type === CAR_HISTORY_DETAILS__FAIL) {
          let message = get(action, 'payload.message', 'Произошла ошибка, попробуйте снова');

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }

          setTimeout(() => Alert.alert(message), 100);
        }
      });
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'CarHistoryDetailsScreen';
      }
    }

    return isActiveScreen;
  }

  selectWorksTab = () => this.setState({ tabName: TABS.WORKS })
  selectPartsTab = () => this.setState({ tabName: TABS.PARTS })

  renderTable = ({ name, count, units, summ }, idx) => {
    return (
      <View key={`${name}${idx}`} style={styles.section}>
        {name ? <Text style={styles.sectionTitle}>{name}</Text> : null}
        {count ? this.renderItem({ prop: 'Количество', value: `${count} ${units}.` }) : null}
        {get(summ, 'value') ? this.renderItem({ prop: 'Стоимость', value: `${numberWithGap(get(summ, 'value'))} ${get(summ, 'currency')}` }) : null}
        {get(summ, 'sale') ? this.renderItem({ prop: 'Скидка', value: `${numberWithGap(get(summ, 'sale'))} ${get(summ, 'currency')}` }) : null}
        {get(summ, 'total') ? this.renderItem({ prop: 'Итого', value: `${numberWithGap(get(summ, 'total'))} ${get(summ, 'currency')}` }) : null}
      </View>
    );
  }

  renderItem = ({ prop, value }) => (
    <Row style={styles.sectionRow}>
      <Col style={styles.sectionProp}>
        <Text style={styles.sectionPropText}>{`${prop}:`}</Text>
      </Col>
      <Col style={styles.sectionValue}>
        <Text style={styles.sectionValueText}>{value}</Text>
      </Col>
    </Row>
  )

  render() {
    const { tabName } = this.state;
    const isActiveWorksTab = tabName === TABS.WORKS;
    const isActivePartsTab = tabName === TABS.PARTS;
    const { isFetchCarHistoryDetails, details } = this.props;

    console.log('== CarHistoryDetails ==');

    if (isFetchCarHistoryDetails) {
      return <SpinnerView />;
    }

    console.log('details', details);

    const works = get(details, 'works');
    const parts = get(details, 'parts');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
            <Segment style={styles.segment}>
              {
                works ?
                (
                  <Button
                    first
                    last={!parts}
                    active={isActiveWorksTab}
                    onPress={this.selectWorksTab}
                    style={isActiveWorksTab ? styles.tabButtonActive : styles.tabButton}
                  >
                    <Text style={isActiveWorksTab ? styles.tabTextActive : styles.tabText}>Работы</Text>
                  </Button>
                ) : null
              }
              {
                parts ? (
                  <Button
                    first={!works}
                    last
                    active={isActivePartsTab}
                    onPress={this.selectPartsTab}
                    style={isActivePartsTab ? styles.tabButtonActive : styles.tabButton}
                  >
                    <Text style={isActivePartsTab ? styles.tabTextActive : styles.tabText}>Материалы</Text>
                  </Button>
                ) : null
              }
            </Segment>

            {
              isActiveWorksTab && works ?
                (
                  <View style={styles.tabContent}>
                    {works.map((item, idx) => this.renderTable(item, idx))}
                  </View>
                ) : null }
              {
                isActivePartsTab && parts ?
                (
                  <View style={styles.tabContent}>
                    {parts.map((item, idx) => this.renderTable(item, idx))}
                  </View>
                ) : null
              }
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarHistoryDetailsScreen);
