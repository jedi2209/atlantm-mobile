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

// redux
import {connect} from 'react-redux';
import {CAR_HISTORY__FAIL} from '../../actionTypes';
import {
  actionFetchCarHistory,
  actionSetCarHistoryLevel1,
  actionSetCarHistoryLevel2,
} from '../../actions';

import SpinnerView from '../../../core/components/SpinnerView';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import {get, isEmpty} from 'lodash';
import {dayMonthYear} from '../../../utils/date';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import numberWithGap from '../../../utils/number-with-gap';
import {MONTH_TEXT} from '../../const';
import {ERROR_NETWORK} from '../../../core/const';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: styleConst.font.regular,
    fontSize: 17,
    marginTop: 50,
  },
  itemLevel1: {
    marginBottom: 1,
  },
  itemLevel2: {
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  itemLevel3: {
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  listItem: {
    height: null,
  },
  body: {
    height: null,
    minHeight: styleConst.ui.listHeight,
    paddingBottom: 10,
    borderBottomColor: '#afafaf',
    borderBottomWidth: 1,
  },
  date: {
    color: '#0061ED',
    fontSize: 18,
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
    auth: profile.auth,
    carHistory: profile.carHistory.data,
    level1hash: profile.carHistory.level1Hash,
    level2hash: profile.carHistory.level2Hash,
    isFetchCarHistory: profile.carHistory.meta.isFetchCarHistory,
  };
};

const mapDispatchToProps = {
  actionFetchCarHistory,
  actionSetCarHistoryLevel1,
  actionSetCarHistoryLevel2,
};
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../../core/components/Header/style';
class CarHistoryScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <Text style={stylesHeader.whiteHeaderTitle}>История ТО</Text>,
    headerStyle: stylesHeader.whiteHeader,
    headerTitleStyle: stylesHeader.whiteHeaderTitle,
    headerLeft: (
      <View
        style={{
          marginLeft: -16,
          marginTop: 2,
        }}>
        <HeaderIconBack theme="blue" navigation={navigation} />
      </View>
    ),
    headerRight: <View />,
  });

  componentDidMount() {
    // eslint-disable-next-line no-shadow
    const {profile, navigation, actionFetchCarHistory} = this.props;
    const vin = get(navigation, 'state.params.car.vin');
    const token = get(profile, 'token');
    const userid = get(profile, 'id');

    actionFetchCarHistory({
      vin,
      token,
      userid,
    }).then(action => {
      if (action.type === CAR_HISTORY__FAIL) {
        let message = get(
          action,
          'payload.message',
          'Произошла ошибка, попробуйте снова',
        );

        if (message === 'Network request failed') {
          message = ERROR_NETWORK;
        }

        // todo: другой способ показывать что ничего не найдено
        console.log(message);
      } else {
        console.log('history =====>', this.props.carHistory);
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.navigation.isFocused();
  }

  renderListItem = (label, value, isLast) => {
    if (!value) {
      return null;
    }

    return (
      <View style={stylesList.listItemContainer}>
        <ListItem
          last={isLast}
          style={[stylesList.listItem, stylesList.listItemReset]}>
          <Body>
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

  onPressLevel1 = hash => {
    this.props.actionSetCarHistoryLevel1(
      this.isActiveLevel1(hash) ? null : hash,
    );
  };
  onPressLevel2 = hash => {
    this.props.actionSetCarHistoryLevel2(
      this.isActiveLevel2(hash) ? null : hash,
    );
  };

  isActiveLevel1 = hash => this.props.level1hash === hash;
  isActiveLevel2 = hash => this.props.level2hash === hash;

  renderLevel1 = carHistory => {
    return Object.keys(carHistory).map((carHistoryYear, idx, yearsArray) => {
      const item = carHistory[carHistoryYear];
      const isLast = yearsArray.length - 1 === idx;
      const hash = item.hash;
      const isActive = true; //this.isActiveLevel1(hash);
      const onPressHandler = () => this.onPressLevel1(hash);

      return (
        <View key={hash} style={styles.acc}>
          {this.renderItemHeader({
            label: carHistoryYear,
            onPressHandler,
            theme: 'itemLevel1',
            isActive,
            isLast,
            isArrow: true,
          })}
          {isActive ? (
            <View
              style={[styles.accContent, styles.accContentLevel1]}
              animation="slideInDown"
              useNativeDriver={true}
              duration={700}>
              {this.renderLevel2(item.history)}
            </View>
          ) : null}
        </View>
      );
    });
  };

  renderLevel2 = carHistoryItemByMonth => {
    return Object.keys(carHistoryItemByMonth).map((month, idx, monthArray) => {
      const item = carHistoryItemByMonth[month];
      const isLast = monthArray.length - 1 === idx;
      const hash = item.hash;
      const isActive = true; //this.isActiveLevel2(hash);
      const onPressHandler = () => this.onPressLevel2(hash);

      return (
        <View key={hash} style={styles.acc}>
          {this.renderItemHeader({
            label: MONTH_TEXT[month],
            onPressHandler,
            theme: 'itemLevel2',
            isActive,
            isLast,
            isArrow: true,
          })}
          {isActive ? (
            <View animation="pulse" useNativeDriver={true} duration={700}>
              {this.renderLevel3(item.history)}
            </View>
          ) : null}
        </View>
      );
    });
  };

  renderLevel3 = works => {
    const {navigation} = this.props;
    const vin = get(navigation, 'state.params.car.vin');

    return works.map((work, idx) => {
      const workId = get(work, 'document.number');
      const workDealer = get(work, 'dealer.id');
      const isLast = works.length - 1 === idx;
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
        isLast,
        key: work.hash,
        onPressHandler,
        isArrowPress: true,
        theme: 'itemLevel3',
      });
    });
  };

  renderLevel3Item = ({prop, value, color}) => {
    return (
      <Row style={styles.sectionRow}>
        <Col style={styles.sectionProp}>
          <Text style={styles.sectionPropText}>{`${prop}:`}</Text>
        </Col>
        <Col style={styles.sectionValue}>
          <Text
            style={
              ([styles.sectionValueText], color ? {color: '#0061ED'} : null)
            }>
            {value}
          </Text>
        </Col>
      </Row>
    );
  };

  renderLevel3Content = ({work}) => {
    const {date, document, master, summ} = work;
    const works = get(summ, 'works');
    const parts = get(summ, 'parts');
    const total = get(summ, 'total');
    const currency = get(summ, 'currency');

    return (
      <Body style={styles.body}>
        {date ? <Text style={styles.date}>{dayMonthYear(date)}</Text> : null}
        {document
          ? this.renderLevel3Item({
              prop: document.name,
              value: `#${document.number}`,
              color: true,
            })
          : null}
        {master ? this.renderLevel3Item({prop: 'Мастер', value: master}) : null}
        {works
          ? this.renderLevel3Item({
              prop: 'Стоимость работ',
              value: `${numberWithGap(works)} ${currency}`,
            })
          : null}
        {parts
          ? this.renderLevel3Item({
              prop: 'Стоимость запчастей',
              value: `${numberWithGap(parts)} ${currency}`,
            })
          : null}
        {total
          ? this.renderLevel3Item({
              prop: 'Всего',
              value: `${numberWithGap(total)} ${currency}`,
            })
          : null}
      </Body>
    );
  };

  renderItemHeader = ({work, key, label, theme, onPressHandler}) => {
    const isLevel3 = theme === 'itemLevel3';

    return (
      <View
        key={key}
        style={[
          stylesList.listItemContainer,
          styles[theme],
          {marginHorizontal: 10},
        ]}>
        <ListItem
          icon
          last
          style={[
            stylesList.listItem,
            isLevel3 ? styles.listItem : {height: 0},
          ]}
          onPress={onPressHandler}>
          {isLevel3 ? this.renderLevel3Content({work}) : null}
          <Right />
        </ListItem>
      </View>
    );
  };

  render() {
    const {carHistory, isFetchCarHistory} = this.props;

    if (isFetchCarHistory) {
      return <SpinnerView />;
    }

    if (isEmpty(carHistory) || !carHistory.items) {
      return (
        <SafeAreaView style={styles.safearea}>
          <StatusBar barStyle="dark-content" />
          <Text style={styles.emptyText}>Истории пока нет</Text>
        </SafeAreaView>
      );
    }

    return (
      <ScrollView style={{backgroundColor: '#fff'}}>
        <StatusBar barStyle="dark-content" />
        <View style={{backgroundColor: '#fff'}}>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CarHistoryScreen);
