import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { StyleProvider, Container, Content, ListItem, Body, Right, Icon, Row, Col } from 'native-base';

// redux
import { connect } from 'react-redux';
import { CAR_HISTORY__FAIL } from '../../actionTypes';
import {
  actionFetchCarHistory,
  actionSetCarHistoryLevel1,
  actionSetCarHistoryLevel2,
} from '../../actions';

// components
import * as Animatable from 'react-native-animatable';
import SpinnerView from '../../../core/components/SpinnerView';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import { get, isEmpty } from 'lodash';
import { dayMonthYear } from '../../../utils/date';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import { MONTH_TEXT } from '../../const';
import { ERROR_NETWORK } from '../../../core/const';

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
    fontSize: 15,
    color: styleConst.color.greyText3,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    marginTop: 5,
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
    fontSize: 17,
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 16,
  },
});

const mapStateToProps = ({ nav, profile }) => {
  return {
    nav,
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

class CarHistoryScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'История обслуживания',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  componentDidMount() {
    const { auth, navigation, actionFetchCarHistory } = this.props;
    const vin = get(navigation, 'state.params.car.vin');
    const token = get(auth, 'token.id');

    actionFetchCarHistory({
      vin,
      token,
    })
      .then(action => {
        if (action.type === CAR_HISTORY__FAIL) {
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
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'CarHistoryScreen';
      }
    }

    return isActiveScreen;
  }

  onPressLevel1 = hash => {
    this.props.actionSetCarHistoryLevel1(this.isActiveLevel1(hash) ? null : hash);
  }
  onPressLevel2 = hash => {
    this.props.actionSetCarHistoryLevel2(this.isActiveLevel2(hash) ? null : hash);
  }

  isActiveLevel1 = hash => this.props.level1hash === hash;
  isActiveLevel2 = hash => this.props.level2hash === hash;

  renderLevel1 = (carHistory) => {
    return Object.keys(carHistory).map((carHistoryYear, idx, yearsArray) => {
      const item = carHistory[carHistoryYear];
      const isLast = (yearsArray.length - 1) === idx;
      const hash = item.hash;
      const isActive = this.isActiveLevel1(hash);
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
          {
            isActive ?
              (
                <Animatable.View
                  style={[styles.accContent, styles.accContentLevel1]}
                  animation="slideInDown"
                  useNativeDriver={true}
                  duration={700}
                >
                  {this.renderLevel2(item.history)}
                </Animatable.View>
              ) : null
          }
        </View>
      );
    });
  }

  renderLevel2 = (carHistoryItemByMonth) => {
    return Object.keys(carHistoryItemByMonth).map((month, idx, monthArray) => {
      const item = carHistoryItemByMonth[month];
      const isLast = (monthArray.length - 1) === idx;
      const hash = item.hash;
      const isActive = this.isActiveLevel2(hash);
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
          {
            isActive ?
              (
                <Animatable.View
                  animation="pulse"
                  useNativeDriver={true}
                  duration={700}
                >
                {this.renderLevel3(item.history)}
              </Animatable.View>
              ) : null
          }
        </View>
      );
    });
  }

  renderLevel3 = (works) => {
    return works.map((work, idx) => {
      const isLast = (works.length - 1) === idx;

      console.log('work', work);

      return this.renderItemHeader({
        work,
        isLast,
        key: work.hash,
        theme: 'itemLevel3',
      });
    });
  }

  renderLevel3Item = ({ prop, value }) => (
    <Row style={styles.sectionRow}>
      <Col style={styles.sectionProp}>
        <Text style={styles.sectionPropText}>{`${prop}:`}</Text>
      </Col>
      <Col style={styles.sectionValue}>
        <Text style={styles.sectionValueText}>{value}</Text>
      </Col>
    </Row>
  )

  renderLevel3Content = ({ work }) => {
    const { date, document, master, summ } = work;
    const works = get(summ, 'works');
    const parts = get(summ, 'parts');
    const total = get(summ, 'total');

    return (
      <Body style={styles.body}>
        { date ? <Text style={styles.date}>{dayMonthYear(date)}</Text> : null }
        { document ? this.renderLevel3Item({ prop: document.name, value: `#${document.number}` }) : null}
        { master ? this.renderLevel3Item({ prop: 'Мастер', value: master }) : null}
        { works ? this.renderLevel3Item({ prop: 'Ст-ть работ', value: works }) : null}
        { parts ? this.renderLevel3Item({ prop: 'Ст-ть запчастей', value: parts }) : null}
        { total ? this.renderLevel3Item({ prop: 'Всего', value: total }) : null}
      </Body>
    );
  }

  renderItemHeader = ({ work, key, label, theme, isActive, isArrow, onPressHandler }) => {
    const isLevel3 = theme === 'itemLevel3';

    return (
      <View key={key} style={[stylesList.listItemContainer, styles[theme]]}>
        <ListItem
          icon
          last
          style={[stylesList.listItem, isLevel3 ? styles.listItem : null]}
          onPress={onPressHandler}
        >
          {
            isLevel3 ?
              this.renderLevel3Content({ work }) :
              (
                <Body>
                  <Text style={stylesList.label}>{label}</Text>
                </Body>
              )
          }
          <Right>
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

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      carHistory,
      isFetchCarHistory,
    } = this.props;

    console.log('== CarHistory ==');

    if (isFetchCarHistory) {
      return <SpinnerView />;
    }

    if (isEmpty(carHistory) || !carHistory.items) {
      return (
        <View style={[styles.emptyContainer, styles.content]}>
          <Text style={styles.emptyText}>
            Истории пока нет
          </Text>
        </View>
      );
    }

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
            {Object.keys(get(carHistory, 'items'), []).length ? this.renderLevel1(carHistory.items) : null}
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarHistoryScreen);
