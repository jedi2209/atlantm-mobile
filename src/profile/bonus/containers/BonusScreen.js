import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Content, ListItem, StyleProvider, Icon, Body, Right, Button } from 'native-base';

// redux
import { connect } from 'react-redux';
import { actionSetBonusLevel1, actionSetBonusLevel2 } from '../../actions';

// components
import * as Animatable from 'react-native-animatable';
import Communications from 'react-native-communications';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import { get, isEmpty } from 'lodash';
import { dayMonthYear } from '../../../utils/date';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';

const MONTH_TEXT = {
  1: 'Январь',
  2: 'Февраль',
  3: 'Март',
  4: 'Апрель',
  5: 'Май',
  6: 'Июнь',
  7: 'Июль',
  8: 'Август',
  9: 'Сентябрь',
  10: 'Октябрь',
  11: 'Ноябрь',
  12: 'Декабрь',
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
  emptyContainer: {
    flex: 1,
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
    backgroundColor: styleConst.color.accordeonGrey1,
    marginBottom: 1,
  },
  itemLevel3: {
    backgroundColor: styleConst.color.accordeonGrey2,
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
  },
  date: {
    fontSize: 15,
    color: styleConst.color.greyText3,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    marginBottom: 5,
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
    height: styleConst.ui.footerHeight,
    backgroundColor: '#fff',
    borderTopWidth: styleConst.ui.borderWidth,
    borderBottomWidth: 1,
    borderTopColor: styleConst.color.border,
    borderBottomColor: styleConst.color.border,
    marginVertical: 30,
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

const mapStateToProps = ({ dealer, profile, nav }) => {
  return {
    nav,
    bonus: profile.bonus.data,
    level1hash: profile.bonus.level1Hash,
    level2hash: profile.bonus.level2Hash,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  actionSetBonusLevel1,
  actionSetBonusLevel2,
};

class BonusScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Бонусные баллы',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    bonus: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'BonusScreen';
      }
    }

    return isActiveScreen;
  }

  onPressLevel1 = hash => {
    this.props.actionSetBonusLevel1(this.isActiveLevel1(hash) ? null : hash);
  }
  onPressLevel2 = hash => {
    this.props.actionSetBonusLevel2(this.isActiveLevel2(hash) ? null : hash);
  }

  isActiveLevel1 = hash => this.props.level1hash === hash;
  isActiveLevel2 = hash => this.props.level2hash === hash;

  renderLevel1 = (bonuses) => {
    return Object.keys(bonuses).map((bonusYear, idx, yearsArray) => {
      const bonus = bonuses[bonusYear];
      const isLast = (yearsArray.length - 1) === idx;
      const hash = bonus.hash;
      const isActive = this.isActiveLevel1(hash);
      const onPressHander = () => this.onPressLevel1(hash);

      return (
        <View key={hash} style={styles.acc}>
          {this.renderItemHeader(bonusYear, bonus.total, onPressHander, 'itemLevel1', isActive, isLast, true)}
          {
            isActive ?
              (
                <Animatable.View
                  style={[styles.accContent, styles.accContentLevel1]}
                  animation="slideInDown"
                  useNativeDriver={true}
                  duration={700}
                >
                  {this.renderLevel2(bonus.history)}
                </Animatable.View>
              ) : null
          }
        </View>
      );
    });
  }

  renderLevel2 = (bonusesByMonth) => {
    return Object.keys(bonusesByMonth).map((bonusMonth, idx, monthArray) => {
      const bonus = bonusesByMonth[bonusMonth];
      const isLast = (monthArray.length - 1) === idx;
      const hash = bonus.hash;
      const isActive = this.isActiveLevel2(hash);
      const onPressHander = () => this.onPressLevel2(hash);

      return (
        <View key={hash} style={styles.acc}>
          {this.renderItemHeader(MONTH_TEXT[bonusMonth], bonus.total, onPressHander, 'itemLevel2', isActive, isLast, true)}
          {
            isActive ?
              (
                <Animatable.View
                  animation="pulse"
                  useNativeDriver={true}
                  duration={700}
                >
                {this.renderLevel3(bonus.history)}
              </Animatable.View>
              ) : null
          }
        </View>
      );
    });
  }

  renderLevel3 = (history) => {
    return history.map((bonus, idx) => {
      const isLast = (history.length - 1) === idx;

      return this.renderItemHeader(bonus.name, bonus.summ, null, 'itemLevel3', null, isLast, null, bonus.hash, bonus.date);
    });
  }

  renderItemHeader = (label, total, onPressHandler, theme, isActive, isLast, isArrow, key, date) => {
    const isLevel1 = theme === 'itemLevel1';
    const isLevel2 = theme === 'itemLevel2';
    const isLevel3 = theme === 'itemLevel3';

    return (
      <View key={key} style={[stylesList.listItemContainer, styles[theme]]}>
        <ListItem
          icon
          last
          style={[stylesList.listItem, isLevel3 ? styles.listItem : null]}
          onPress={onPressHandler}
        >
          <Body style={isLevel3 ? styles.body : null}>
            <Text style={[stylesList.label, isLevel3 ? styles.label : null]}>{label}</Text>
            {
              isLevel3 ?
                (
                  <Text style={styles.date}>{dayMonthYear(date)}</Text>
                ) : null
            }
          </Body>
          <Right>
            {total ? <Text style={stylesList.badgeText}>{total}</Text> : null}
            {
              isArrow ?
                (
                  <Icon
                    name={isActive ? 'ios-arrow-down' : 'ios-arrow-forward'}
                    style={[stylesList.iconArrow, stylesList.iconArrowWithText]}
                  />
                ) : null
            }
          </Right>
        </ListItem>
      </View>
    );
  }

  onPressBonusInfo = () => {
    const links = {
      ru: 'https://www.atlantm.ru/expert/bonus/',
      ua: 'https://www.atlant-m.ua/expert/bonus/',
      by: 'https://www.atlant-m.by/expert/bonus/',
    };

    Communications.web(links[this.props.dealerSelected.region]);
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    console.log('== Bonus Screen ==');

    const { bonus } = this.props;
    console.log('bonus', bonus);

    if (isEmpty(bonus) || !bonus.items) {
      return (
        <View style={[styles.emptyContainer, styles.content]}>
          <Text style={styles.emptyText}>
            Бонусов пока нет
          </Text>
        </View>
      );
    }

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            {Object.keys(get(bonus, 'items'), []).length ? this.renderLevel1(bonus.items) : null}

            <View style={styles.total}>
              <Text style={styles.totalText}>Всего: <Text style={styles.totalValue}>{get(bonus, 'saldo.value')}</Text> баллов</Text>
            </View>

            <Button onPress={this.onPressBonusInfo} full style={styles.button}>
              <Icon name="ios-information-circle-outline" style={styles.buttonIcon} />
              <Text numberOfLines={1} style={styles.buttonText}>БОНУСНАЯ ПРОГРАММА</Text>
            </Button>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BonusScreen);
