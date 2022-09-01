/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
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
import {
  List,
  DefaultTheme,
  Provider as PaperProvider,
  Divider,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import Analytics from '../../../utils/amplitude-analytics';

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
import {dayMonthYear, dayMonth} from '../../../utils/date';
import styleConst from '../../../core/style-const';
import showPrice from '../../../utils/price';
import numberWithGap from '../../../utils/number-with-gap';
import {ERROR_NETWORK} from '../../../core/const';
import {strings} from '../../../core/lang/const';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: styleConst.color.blue,
  },
};

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
    color: styleConst.color.lightBlue,
    fontSize: 18,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    marginTop: 5,
    fontWeight: '400',
    paddingBottom: 0,
  },
  dealer: {
    color: styleConst.color.greyText,
    fontSize: 14,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    marginTop: 5,
    fontWeight: '400',
    paddingBottom: 5,
  },
  mileage: {
    color: styleConst.color.greyBlueText,
    fontSize: 14,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.light,
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
    color: styleConst.color.greyText,
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 16,
    color: styleConst.color.greyText,
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
  };
};

const mapDispatchToProps = {
  actionFetchCarHistory,
};
const CarHistoryScreen = ({
  profile,
  route,
  navigation,
  carHistory,
  actionFetchCarHistory,
}) => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const vin = get(route, 'params.car.vin');
    const token = profile.SAP.TOKEN;
    const userid = profile.SAP.ID;

    Analytics.logEvent('screen', 'lkk/carhistory');

    actionFetchCarHistory({
      vin,
      token,
      userid,
    }).then(action => {
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
      setLoading(false);
    });
    // return () => {
    // }
  }, []);

  const renderData = carHistory => {
    return Object.keys(carHistory)
      .reverse()
      .map(carHistoryYear => {
        const item = carHistory[carHistoryYear];
        const hash = item.hash;
        return (
          <List.Accordion
            key={'year' + hash}
            title={carHistoryYear}
            left={props => <List.Icon {...props} icon="calendar-multiple" />}>
            {Object.keys(item.history)
              .reverse()
              .map(month => renderLevel(item.history[month].history))}
          </List.Accordion>
        );
      });
  };

  const renderLevel = works => {
    const vin = get(route, 'params.car.vin');

    return works.map(work => {
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

      return renderLevelContent({work, onPress: onPressHandler});
    });
  };

  const renderLevelContent = ({work, onPress}) => {
    const {date, document, master, summ, car, hash} = work;
    const works = get(summ, 'works');
    const parts = get(summ, 'parts');
    const total = get(summ, 'total');
    const currency = get(summ, 'currency');
    const dealerName = get(work, 'dealer.name', null);
    // const sale = parseFloat(get(summ, 'sale.works') + get(summ, 'sale.parts'));

    return (
      <List.Item
        onPress={onPress}
        key={'item' + hash}
        descriptionNumberOfLines={2}
        title={[
          [dayMonth(work.date)].join(' '),
          ['#' + work.document.number].join(' '),
        ].join(', ')}
        description={[
          dealerName,
          [
            strings.NewCarItemScreen.plates.mileage.toLowerCase(),
            numberWithGap(car.mileage),
          ].join(' '),
          // master ? [strings.CarHistoryScreen.master, master].join(' ') : null,
        ].join('\r\n')}
        left={() => <List.Icon color={styleConst.color.blue} icon="car-info" />}
        right={props => (
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                textAlignVertical: 'center',
                fontSize: 16,
                color: styleConst.color.darkBg,
              }}>
              {[
                strings.CarHistoryScreen.price.total2,
                showPrice(total, currency, true),
              ].join(' ')}
            </Text>
          </View>
        )}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
        />
      </View>
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
    <PaperProvider theme={theme}>
      <ScrollView style={{backgroundColor: styleConst.color.white}}>
        <View style={{flex: 1}}>
          {Object.keys(get(carHistory, 'items'), []).length
            ? renderData(carHistory.items)
            : null}
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CarHistoryScreen);
