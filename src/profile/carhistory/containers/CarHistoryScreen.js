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
  },
  date: {
    color: styleConst.new.blueHeader,
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
    headerLeft: <HeaderIconBack theme="blue" navigation={navigation} />,
    headerRight: <View />,
  });

  componentDidMount() {
    // eslint-disable-next-line no-shadow
    const {profile, navigation, actionFetchCarHistory} = this.props;
    const vin = get(navigation, 'state.params.car.vin');
    const token = profile.SAP.TOKEN;
    const userid = profile.SAP.ID;

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

  // onPressLevel1 = hash => {
  //   this.props.actionSetCarHistoryLevel1(
  //     this.isActiveLevel1(hash) ? null : hash,
  //   );
  // };
  // onPressLevel2 = hash => {
  //   this.props.actionSetCarHistoryLevel2(
  //     this.isActiveLevel2(hash) ? null : hash,
  //   );
  // };

  // isActiveLevel1 = hash => this.props.level1hash === hash;
  // isActiveLevel2 = hash => this.props.level2hash === hash;

  renderLevel1 = carHistory => {
    return Object.keys(carHistory)
      .reverse()
      .map((carHistoryYear, idx, yearsArray) => {
        const item = carHistory[carHistoryYear];
        const hash = item.hash;
        // const isActive = true; //this.isActiveLevel1(hash);
        // const onPressHandler = () => this.onPressLevel1(hash);

        return <View key={hash}>{this.renderLevel2(item.history)}</View>;
      });
  };

  renderLevel2 = carHistoryItemByMonth => {
    return Object.keys(carHistoryItemByMonth)
      .reverse()
      .map((month, idx, monthArray) => {
        const item = carHistoryItemByMonth[month];
        const hash = item.hash;
        // const isActive = true; //this.isActiveLevel2(hash);
        // const onPressHandler = () => this.onPressLevel2(hash);

        return <View key={hash}>{this.renderLevel3(item.history)}</View>;
      });
  };

  renderLevel3 = works => {
    const {navigation} = this.props;
    const vin = get(navigation, 'state.params.car.vin');

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

  renderLevel3Item = ({prop, value, color}) => {
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
    const {date, document, master, summ} = work;
    const works = get(summ, 'works');
    const parts = get(summ, 'parts');
    const total = get(summ, 'total');
    const currency = get(summ, 'currency');

    return (
      <Body style={[styles.body]}>
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

    if (isFetchCarHistory) {
      return <SpinnerView containerStyle={{backgroundColor: '#fff'}} />;
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
        <View>
          <StyleProvider style={getTheme()}>
            <View>
              {/* ВОТ ТУТ НАЧИНАЕТСЯ ПРОБЛЕМА С ОБРАТНОЙ ВЫБОРКОЙ ЭЛЕМЕНТОВ */}
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
