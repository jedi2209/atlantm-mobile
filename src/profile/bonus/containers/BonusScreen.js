/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {
  Icon,
  Button,
  HStack,
  View,
  Text,
  ScrollView,
} from 'native-base';

import Entypo from 'react-native-vector-icons/Entypo';

// redux
import {connect} from 'react-redux';
import {actionSetBonusLevel1, actionSetBonusLevel2} from '../../actions';
// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import {get, isEmpty} from 'lodash';
import {dayMonthYear} from '../../../utils/date';
import Analytics from '../../../utils/amplitude-analytics';
import styleConst from '../../../core/style-const';
import {strings} from '../../../core/lang/const';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: styleConst.color.white,
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
    backgroundColor: styleConst.color.white,
    marginBottom: 1,
  },
  label: {
    fontSize: 16,
    marginTop: 5,
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
    backgroundColor: styleConst.color.white,
    borderTopWidth: styleConst.ui.borderWidth,
    borderTopColor: styleConst.color.systemGray,
    marginHorizontal: 20,
    borderRadius: 5,
    marginBottom: 50,
    marginTop: 30,
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
class BonusScreen extends Component {
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

  onPressLevel1 = hash => {
    this.props.actionSetBonusLevel1(this.isActiveLevel1(hash) ? null : hash);
  };
  onPressLevel2 = hash => {
    this.props.actionSetBonusLevel2(this.isActiveLevel2(hash) ? null : hash);
  };

  isActiveLevel1 = hash => this.props.level1hash === hash;
  isActiveLevel2 = hash => this.props.level2hash === hash;

  renderLevel1 = bonuses => {
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

  renderLevel2 = bonusesByMonth => {
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

  renderLevel3 = history => {
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
        <HStack alignItems={"center"} justifyContent={'space-between'} onPress={onPressHandler}>
          <View ml={isLevel3 ? 2 : 0}>
            <Text style={[stylesList.label, isLevel3 ? styles.label : null]}>
              {label}
            </Text>
            {isLevel3 ? (
              <>
                <Text style={[styles.dealer]}>{dealer.name}</Text>
                <Text style={[styles.date]}>{dayMonthYear(date)}</Text>
              </>
            ) : null}
          </View>
          {isLevel3 && (total || total === 0) ? (
            <Text
              mr={1}
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
          ) : null}
        </HStack>
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
        leftIcon={
          <Icon name="price-ribbon" as={Entypo} style={styles.buttonIcon} />
        }
        _text={styles.buttonText}
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
        {strings.ProfileScreenInfo.bonus.moreInfo}
      </Button>
    );
  };

  render() {
    console.info('== Bonus Screen ==');

    const {bonus} = this.props;

    Analytics.logEvent('screen', 'lkk/bonus');

    if (isEmpty(bonus) || !bonus.items) {
      return (
        <View style={styles.mainContainer}>
          <Text style={styles.emptyText}>
            {strings.ProfileScreenInfo.bonus.empty.text}
          </Text>
          {this.renderBonusButton()}
        </View>
      );
    }

    let saldoValue = get(bonus, 'saldo.convert.value', null);
    if (!saldoValue) {
      saldoValue = get(bonus, 'saldo.value', 0);
    }
    return (
      <ScrollView>
        {Object.keys(get(bonus, 'items'), []).length
          ? this.renderLevel1(bonus.items)
          : null}

        <View style={styles.total}>
          <Text style={styles.totalText}>
            {strings.ProfileScreenInfo.bonus.total}:{' '}
            <Text style={styles.totalValue}>
              {parseFloat(saldoValue, 'ru-RU')}
            </Text>{' '}
          </Text>
        </View>
        {this.renderBonusButton()}
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BonusScreen);
