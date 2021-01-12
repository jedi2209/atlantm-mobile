/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View, Text, Platform} from 'react-native';
import {
  Icon,
  Content,
  ListItem,
  StyleProvider,
  Body,
  Right,
  Button,
} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionSetBonusLevel1, actionSetBonusLevel2} from '../../actions';
// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import {get, isEmpty} from 'lodash';
import {dayMonthYear} from '../../../utils/date';
import Amplitude from '../../../utils/amplitude-analytics';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import strings from '../../../core/lang/const';

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: styleConst.font.regular,
    fontSize: 17,
    marginTop: 30,
  },
  itemLevel1: {
    marginBottom: 1,
    backgroundColor: styleConst.color.accordeonGrey2,
  },
  itemLevel2: {
    marginBottom: 1,
    backgroundColor: styleConst.color.accordeonGrey1,
  },
  itemLevel3: {
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  label: {
    fontSize: 16,
    marginTop: 5,
  },
  listItem: {
    height: null,
  },
  body: {
    height: null,
    minHeight: styleConst.ui.listHeight,
    marginLeft: 20,
  },
  date: {
    fontSize: 15,
    color: styleConst.color.greyText3,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    marginVertical: 2,
  },
  dealer: {
    fontSize: 12,
    color: styleConst.color.greyText5,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
  },
  total: {
    marginHorizontal: styleConst.ui.horizontalGapInList,
    marginTop: 15,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    color: styleConst.color.greyText,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
  },
  totalValue: {
    color: '#000',
  },
  button: {
    height: styleConst.ui.footerHeightIphone,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: styleConst.ui.borderWidth,
    borderTopColor: styleConst.color.border,
    marginVertical: 30,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: styleConst.font.medium,
    fontSize: 16,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.lightBlue,
    paddingRight: styleConst.ui.horizontalGapInList,
  },
  buttonIcon: {
    fontSize: 30,
    marginRight: 10,
    color: styleConst.color.lightBlue,
    paddingLeft: styleConst.ui.horizontalGapInList,
  },
});

const mapStateToProps = ({dealer, profile, nav}) => {
  return {
    nav,
    bonus: profile.bonus.data,
    level1hash: profile.bonus.data.level1Hash,
    level2hash: profile.bonus.data.level2Hash,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  actionSetBonusLevel1,
  actionSetBonusLevel2,
};
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../../core/components/Header/style';
class BonusScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: (
      <Text style={stylesHeader.whiteHeaderTitle}>
        {strings.ProfileScreenInfo.bonus.title}
      </Text>
    ),
    headerStyle: stylesHeader.whiteHeader,
    headerTitleStyle: stylesHeader.whiteHeaderTitle,
    headerLeft: <HeaderIconBack theme="blue" navigation={navigation} />,
    headerRight: <View />,
  });

  // constructor(props) {
  //   super(props);

  //   if (props.dealerSelected && props.dealerSelected.region === 'by') {
  //     this.bonusCurr = 'BYN';
  //   } else {
  //     this.bonusCurr = 'бонусов';
  //   }
  // }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen =
          get(rootLevel, `routes[${rootLevel.index}].routeName`) ===
          'BonusScreen';
      }
    }

    return isActiveScreen;
  }

  onPressLevel1 = (hash) => {
    this.props.actionSetBonusLevel1(this.isActiveLevel1(hash) ? null : hash);
  };
  onPressLevel2 = (hash) => {
    this.props.actionSetBonusLevel2(this.isActiveLevel2(hash) ? null : hash);
  };

  isActiveLevel1 = (hash) => this.props.level1hash === hash;
  isActiveLevel2 = (hash) => this.props.level2hash === hash;

  renderLevel1 = (bonuses) => {
    return Object.keys(bonuses)
      .reverse()
      .map((bonusYear, idx, yearsArray) => {
        const bonus = bonuses[bonusYear];
        const isLast = yearsArray.length - 1 === idx;
        const hash = bonus.hash;
        const isActive = true; //this.isActiveLevel1(hash);
        const onPressHander = () => this.onPressLevel1(hash);

        return (
          <View key={hash} style={styles.acc}>
            {this.renderItemHeader(
              bonusYear,
              bonus.total,
              bonus.curr,
              onPressHander,
              'itemLevel1',
              isActive,
              isLast,
              false,
              false,
            )}
            {isActive ? (
              <View
                style={[styles.accContent, styles.accContentLevel1]}
                animation="slideInDown"
                useNativeDriver={true}
                duration={700}>
                {this.renderLevel2(bonus.history)}
              </View>
            ) : null}
          </View>
        );
      });
  };

  renderLevel2 = (bonusesByMonth) => {
    return Object.keys(bonusesByMonth)
      .reverse()
      .map((bonusMonth, idx, monthArray) => {
        const bonus = bonusesByMonth[bonusMonth];
        const isLast = monthArray.length - 1 === idx;
        const hash = bonus.hash;
        const isActive = true; //this.isActiveLevel2(hash);
        const onPressHander = () => this.onPressLevel2(hash);

        return (
          <View key={hash} style={styles.acc}>
            {this.renderItemHeader(
              strings.DatePickerCustom.month[bonusMonth],
              bonus.total,
              bonus.curr,
              onPressHander,
              'itemLevel2',
              isActive,
              isLast,
              false,
              false,
            )}
            {isActive ? (
              <View animation="pulse" useNativeDriver={true} duration={700}>
                {this.renderLevel3(bonus.history)}
              </View>
            ) : null}
          </View>
        );
      });
  };

  renderLevel3 = (history) => {
    return history.map((bonus, idx) => {
      return this.renderItemHeader(
        bonus.name,
        bonus.summ,
        bonus.curr,
        null,
        'itemLevel3',
        bonus.hash,
        bonus.date,
        bonus.dealer,
      );
    });
  };

  renderItemHeader = (
    label,
    total,
    curr,
    onPressHandler,
    theme,
    key,
    date,
    dealer,
  ) => {
    const isLevel3 = theme === 'itemLevel3';

    return (
      <View key={key} style={[stylesList.listItemContainer, styles[theme]]}>
        <ListItem
          icon
          last
          style={[stylesList.listItem, isLevel3 ? styles.listItem : null]}
          onPress={onPressHandler}>
          <Body style={isLevel3 ? styles.body : null}>
            <Text style={[stylesList.label, isLevel3 ? styles.label : null]}>
              {label}
            </Text>
            {isLevel3 ? (
              <>
                <Text style={[styles.dealer]}>{dealer.name}</Text>
                <Text style={[styles.date]}>{dayMonthYear(date)}</Text>
              </>
            ) : null}
          </Body>
          <Right>
            {isLevel3 && (total || total === 0) ? (
              <>
                <Text
                  style={[
                    stylesList.badgeText,
                    {
                      color:
                        total > 0
                          ? styleConst.color.green
                          : styleConst.color.red,
                    },
                  ]}>
                  {parseFloat(total).toLocaleString('ru-RU')}
                </Text>
                {/* <Text
                  style={{
                    marginLeft: 2,
                    color: styleConst.color.greyText,
                    fontSize: 12,
                  }}>
                  {curr}
                </Text> */}
              </>
            ) : null}
          </Right>
        </ListItem>
      </View>
    );
  };

  onPressBonusInfo = () =>
    this.props.navigation.navigate('BonusScreenInfo', {
      refererScreen: 'profile/bonus',
      returnScreen: 'BonusScreen',
    });

  renderBonusButton = () => {
    return (
      <Button
        onPress={this.onPressBonusInfo}
        full
        iconLeft
        style={[
          styleConst.shadow.default,
          styles.button,
          {
            borderBottomWidth: 0,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
          },
        ]}>
        <Icon name="price-ribbon" type="Entypo" style={styles.buttonIcon} />
        <Text numberOfLines={1} style={styles.buttonText}>
          {strings.ProfileScreenInfo.bonus.moreInfo}
        </Text>
      </Button>
    );
  };

  render() {
    console.log('== Bonus Screen ==');

    const {bonus} = this.props;

    Amplitude.logEvent('screen', 'lkk/bonus');

    if (isEmpty(bonus) || !bonus.items) {
      return (
        <SafeAreaView style={styles.safearea}>
          <Text style={styles.emptyText}>
            {strings.ProfileScreenInfo.bonus.empty.text}
          </Text>
          {this.renderBonusButton()}
        </SafeAreaView>
      );
    }

    let saldoValue = get(bonus, 'saldo.convert.value', null);
    if (!saldoValue) {
      saldoValue = get(bonus, 'saldo.value', 0);
    }
    let saldoCurr = null;
    if (this.props.dealerSelected.region !== 'by') {
      saldoCurr = get(bonus, 'saldo.convert.curr', null);
      if (!saldoCurr) {
        saldoCurr = get(bonus, 'saldo.curr', 'бонусов');
      }
    }
    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            {Object.keys(get(bonus, 'items'), []).length
              ? this.renderLevel1(bonus.items)
              : null}

            <View style={styles.total}>
              <Text style={styles.totalText}>
                {strings.ProfileScreenInfo.bonus.total}:{' '}
                <Text style={styles.totalValue}>
                  {parseFloat(saldoValue, 'ru-RU')}
                </Text>{' '}
                {saldoCurr}
              </Text>
            </View>
            {this.renderBonusButton()}
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BonusScreen);
