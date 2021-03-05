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
import {
  StyleProvider,
  ListItem,
  Body,
  Right,
  Row,
  Col,
  Item,
  Label,
} from 'native-base';
import Amplitude from '../../../utils/amplitude-analytics';

// redux
import {connect} from 'react-redux';
import {CAR_HISTORY__FAIL} from '../../actionTypes';
import {
  actionFetchCarHistory,
  // actionSetCarHistoryLevel1,
  // actionSetCarHistoryLevel2,
} from '../../actions';

import SpinnerView from '../../../core/components/SpinnerView';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import {get, isEmpty} from 'lodash';
import {dayMonthYear} from '../../../utils/date';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import showPrice from '../../../utils/price';
import numberWithGap from '../../../utils/number-with-gap';
import {ERROR_NETWORK} from '../../../core/const';
import strings from '../../../core/lang/const';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.white,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: styleConst.font.regular,
    fontSize: 17,
    marginTop: 50,
  },
  itemLevel3: {
    backgroundColor: styleConst.color.white,
    marginBottom: 2,
  },
  listItem: {
    height: null,
  },
  body: {
    height: null,
    minHeight: styleConst.ui.listHeight,
    paddingBottom: 10,
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    color: styleConst.new.blueHeader,
    fontSize: 18,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    marginTop: 5,
    fontWeight: '400',
    paddingBottom: 0,
  },
  dealer: {
    color: styleConst.color.greyBlueText,
    fontSize: 14,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    marginTop: 5,
    fontWeight: '400',
    paddingBottom: 5,
  },
  mileage: {
    color: styleConst.new.blueHeader,
    fontSize: 14,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    marginTop: 5,
    fontWeight: '400',
    paddingBottom: 10,
  },

  // section
  sectionProp: {
    paddingRight: 5,
    marginTop: 5,
  },
  sectionValue: {
    marginTop: 5,
  },
  sectionPropText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 15,
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 16,
  },
  sectionValueReduceText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 14,
  },
  about: {
    marginBottom: 5,
  },
  iconArrow: {
    color: styleConst.color.greyText4,
  },
});

const mapStateToProps = ({nav, profile}) => {
  return {
    nav,
    profile: profile.login,
    carHistory: profile.carHistory.data,
    level1hash: profile.carHistory.level1Hash,
    level2hash: profile.carHistory.level2Hash,
    isFetchCarHistory: profile.carHistory.meta.isFetchCarHistory,
  };
};

const mapDispatchToProps = {
  actionFetchCarHistory,
  // actionSetCarHistoryLevel1,
  // actionSetCarHistoryLevel2,
};
class CarHistoryScreen extends Component {
  componentDidMount() {
    // eslint-disable-next-line no-shadow
    const {profile, navigation, actionFetchCarHistory} = this.props;
    const vin = get(this.props.route, 'params.car.vin');
    const token = profile.SAP.TOKEN;
    const userid = profile.SAP.ID;

    actionFetchCarHistory({
      vin,
      token,
      userid,
    }).then((action) => {
      if (action.type === CAR_HISTORY__FAIL) {
        let message = get(
          action,
          'payload.message',
          strings.Notifications.error.text,
        );

        if (message === 'Network request failed') {
          message = ERROR_NETWORK;
        }
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.navigation.isFocused();
  }

  renderListItem = (label, value) => {
    if (!value) {
      return null;
    }

    return (
      <View style={stylesList.listItemContainer}>
        <ListItem style={[stylesList.listItem, stylesList.listItemReset]}>
          <Body style={{width: '100%'}}>
            <Item style={stylesList.inputItem} fixedLabel>
              <Label style={stylesList.label}>{label}</Label>
              <View style={stylesList.listItemValueContainer}>
                <Text style={stylesList.listItemValue}>{value}</Text>
              </View>
            </Item>
          </Body>
        </ListItem>
      </View>
    );
  };

  renderLevel1 = (carHistory) => {
    return Object.keys(carHistory)
      .reverse()
      .map((carHistoryYear, idx, yearsArray) => {
        const item = carHistory[carHistoryYear];
        const hash = item.hash;

        return <View key={hash}>{this.renderLevel2(item.history)}</View>;
      });
  };

  renderLevel2 = (carHistoryItemByMonth) => {
    return Object.keys(carHistoryItemByMonth)
      .reverse()
      .map((month, idx, monthArray) => {
        const item = carHistoryItemByMonth[month];
        const hash = item.hash;

        return <View key={hash}>{this.renderLevel3(item.history)}</View>;
      });
  };

  renderLevel3 = (works) => {
    const {navigation, route} = this.props;
    const vin = get(route, 'params.car.vin');

    return works.map((work, idx) => {
      const workId = get(work, 'document.number');
      const workDealer = get(work, 'dealer.id');
      const onPressHandler = () => {
        navigation.navigate('CarHistoryDetailsScreen', {
          vin,
          workId,
          workDealer,
          title: `${get(work, 'document.name')} #${workId}`,
        });
      };

      return this.renderItemHeader({
        work,
        key: work.hash,
        onPressHandler,
        isArrowPress: true,
        theme: 'itemLevel3',
      });
    });
  };

  renderLevel3Item = ({prop, value, sale, color}) => {
    return (
      <Row>
        <Col style={styles.sectionProp}>
          <Text style={styles.sectionPropText}>{`${prop}:`}</Text>
        </Col>
        <Col style={styles.sectionValue}>
          <Text
            style={
              ([styles.sectionValueText],
              color ? {color: styleConst.new.blueHeader} : null)
            }>
            {value}
          </Text>
        </Col>
      </Row>
    );
  };

  renderLevel3Content = ({work}) => {
    const {date, document, master, summ, car} = work;
    const works = get(summ, 'works');
    const parts = get(summ, 'parts');
    const total = get(summ, 'total');
    const currency = get(summ, 'currency');
    const dealerName = get(work, 'dealer.name', null);
    // const sale = parseFloat(get(summ, 'sale.works') + get(summ, 'sale.parts'));

    return (
      <Body style={[styles.body]}>
        <View style={styles.dateContainer}>
          {date ? <Text style={styles.date}>{dayMonthYear(date)}</Text> : null}
          {car.mileage ? (
            <Text style={styles.mileage}>
              {strings.NewCarItemScreen.plates.mileage.toLowerCase() +
                ' ' +
                numberWithGap(car.mileage)}
            </Text>
          ) : null}
        </View>
        <View>
          {dealerName ? <Text style={styles.dealer}>{dealerName}</Text> : null}
        </View>
        {document
          ? this.renderLevel3Item({
              prop: document.name,
              value: `#${document.number}`,
              color: true,
            })
          : null}
        {master
          ? this.renderLevel3Item({
              prop: strings.CarHistoryScreen.master,
              value: master,
            })
          : null}
        {/* {works
          ? this.renderLevel3Item({
              prop: strings.CarHistoryScreen.price.work,
              value: showPrice(works, currency, true),
            })
          : null}
        {parts
          ? this.renderLevel3Item({
              prop: strings.CarHistoryScreen.price.materials,
              value: showPrice(parts, currency, true),
            })
          : null} */}
        {total
          ? this.renderLevel3Item({
              prop: strings.CarHistoryScreen.price.total,
              value: showPrice(total, currency, true),
            })
          : null}
        {/* {sale
          ? this.renderLevel3Item({
              prop: strings.CarHistoryScreen.sale,
              value: showPrice(sale, currency, true),
            })
          : null} */}
      </Body>
    );
  };

  renderItemHeader = ({work, key, label, theme, onPressHandler}) => {
    return (
      <View key={key} style={{borderBottomWidth: 1}}>
        <ListItem
          icon
          last
          style={[stylesList.listItem, styles.listItem]}
          onPress={onPressHandler}>
          {this.renderLevel3Content({work})}
          <Right />
        </ListItem>
      </View>
    );
  };

  render() {
    const {carHistory, isFetchCarHistory} = this.props;

    Amplitude.logEvent('screen', 'lkk/carhistory');

    if (isFetchCarHistory) {
      return (
        <SpinnerView
          containerStyle={{backgroundColor: styleConst.color.white}}
        />
      );
    }

    if (isEmpty(carHistory) || !carHistory.items) {
      return (
        <SafeAreaView style={styles.safearea}>
          <StatusBar barStyle="dark-content" />
          <Text style={styles.emptyText}>
            {strings.CarHistoryScreen.empty.text}
          </Text>
        </SafeAreaView>
      );
    }

    return (
      <ScrollView style={{backgroundColor: styleConst.color.white}}>
        <StatusBar barStyle="dark-content" />
        <View>
          <StyleProvider style={getTheme()}>
            <View>
              {Object.keys(get(carHistory, 'items'), []).length
                ? this.renderLevel1(carHistory.items)
                : null}
            </View>
          </StyleProvider>
        </View>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarHistoryScreen);
