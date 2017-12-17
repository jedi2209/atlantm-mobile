import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Content, ListItem, StyleProvider, Icon, Body, Right } from 'native-base';

// redux
import { connect } from 'react-redux';
import { actionSetBonusLevel1, actionSetBonusLevel2, actionSetBonusLevel3 } from '../../actions';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import { get } from 'lodash';
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
  itemLevel1: {

  },
  itemLevel2: {

  },
  itemLevel3: {

  },
});

const mapStateToProps = ({ profile, nav }) => {
  return {
    nav,
    bonus: profile.bonus.data,
    level1hash: profile.bonus.level1Hash,
    level2hash: profile.bonus.level2Hash,
    level3hash: profile.bonus.level3Hash,
  };
};

const mapDispatchToProps = {
  actionSetBonusLevel1,
  actionSetBonusLevel2,
  actionSetBonusLevel3,
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

  onPressLevel1 = hash => this.props.actionSetBonusLevel1(hash)
  onPressLevel2 = hash => this.props.actionSetBonusLevel2(hash)
  onPressLevel3 = hash => this.props.actionSetBonusLevel3(hash)

  isActiveLevel1 = hash => this.props.level1hash === hash;
  isActiveLevel2 = hash => this.props.level2hash === hash;
  isActiveLevel3 = hash => this.props.level3hash === hash;

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
                <View style={[styles.accContent, styles.accContentLevel1]}>{this.renderLevel2(bonus.history)}</View>
              ) : null
          }
        </View>
      );
    });
  }

  renderLevel2 = () => {

  }

  renderLevel3 = () => {

  }

  renderItemHeader = (label, total, onPressHandler, theme, isActive, isLast, isArrow) => {
    return (
      <View style={[stylesList.listItemContainer, styles[theme]]}>
        <ListItem
          icon
          last={isLast}
          style={stylesList.listItem}
          onPress={onPressHandler}
        >
          <Body>
            <Text style={stylesList.label}>{label}</Text>
          </Body>
          <Right>
            {total ? <Text style={stylesList.badgeText}>{total}</Text> : null}
            {
              isArrow ?
                (
                  <Icon
                    name={isActive ? 'ios-arrow-down' : 'ios-arrow-forward'}
                    style={[stylesList.iconArrow, stylesList.stylesList]}
                  />
                ) : null
            }
          </Right>
        </ListItem>
      </View>
    );
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const { bonus } = this.props;

    console.log('== Bonus Screen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            {Object.keys(get(bonus, 'items'), []).length ? this.renderLevel1(bonus.items) : null}
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BonusScreen);
