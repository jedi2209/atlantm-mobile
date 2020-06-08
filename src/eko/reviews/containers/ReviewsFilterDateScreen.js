/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {SafeAreaView, View, StyleSheet, StatusBar} from 'react-native';
import {Body, Label, Content, ListItem, StyleProvider, Text} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionDateFromFill, actionSelectFilterDatePeriod} from '../../actions';

// components
import RadioIcon from '../../../core/components/RadioIcon';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import {
  REVIEWS_FILTER_DATE_PERIOD__ALL,
  REVIEWS_FILTER_DATE_PERIOD__WEEK,
  REVIEWS_FILTER_DATE_PERIOD__MONTH,
  REVIEWS_FILTER_DATE_PERIOD__YEAR,
} from '../../constants';

import PropTypes from 'prop-types';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import {
  substructMonth,
  substractWeek,
  substractYears,
} from '../../../utils/date';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({eko, nav}) => {
  return {
    nav,
    filterDatePeriod: eko.reviews.filterDatePeriod,
  };
};

const mapDispatchToProps = {
  actionDateFromFill,
  actionSelectFilterDatePeriod,
};

class ReviewsFilterDateScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: (
      <Text style={stylesHeader.blueHeaderTitle}>Отзывы за период</Text>
    ),
    headerStyle: stylesHeader.blueHeader,
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: (
      <View>
        <HeaderIconBack theme="white" navigation={navigation} />
      </View>
    ),
    headerRight: <View />,
  });

  static propTypes = {
    navigation: PropTypes.object,
    filterDatePeriod: PropTypes.string,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.filterDatePeriod !== nextProps.filterDatePeriod;
  }

  onPressItem = selectedDatePeriod => {
    const {actionDateFromFill, actionSelectFilterDatePeriod} = this.props;

    requestAnimationFrame(() => {
      if (this.isDatePeriodSelected(selectedDatePeriod)) {return false;}

      actionSelectFilterDatePeriod(selectedDatePeriod);

      this.processDate(selectedDatePeriod);
    });
  };

  processDate = datePeriod => {
    const {dateFrom, actionDateFromFill} = this.props;
    let newDateFrom = null;

    switch (datePeriod) {
      case REVIEWS_FILTER_DATE_PERIOD__ALL:
        newDateFrom = substractYears(10);
        break;
      case REVIEWS_FILTER_DATE_PERIOD__WEEK:
        newDateFrom = substractWeek();
        break;
      case REVIEWS_FILTER_DATE_PERIOD__MONTH:
        newDateFrom = substructMonth();
        break;
      case REVIEWS_FILTER_DATE_PERIOD__YEAR:
        newDateFrom = substractYears(1);
        break;
      default:
        newDateFrom = dateFrom;
    }

    actionDateFromFill(newDateFrom);
  };

  isDatePeriodSelected = selectedDatePeriod =>
    this.props.filterDatePeriod === selectedDatePeriod;

  render() {
    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <StatusBar barStyle="light-content" />
          <Content>
            {[
              REVIEWS_FILTER_DATE_PERIOD__ALL,
              REVIEWS_FILTER_DATE_PERIOD__WEEK,
              REVIEWS_FILTER_DATE_PERIOD__MONTH,
              REVIEWS_FILTER_DATE_PERIOD__YEAR,
            ].map((period, idx, arrayPeriod) => {
              const handler = () => this.onPressItem(period);

              return (
                <View key={period} style={stylesList.listItemContainer}>
                  <ListItem
                    icon
                    style={stylesList.listItemPressable}
                    onPress={handler}>
                    <RadioIcon
                      containerStyle={{
                        marginTop: 5,
                      }}
                      selected={this.isDatePeriodSelected(period)}
                    />
                    <Body style={stylesList.bodyWithLeftGap}>
                      <Label style={stylesList.label}>{period}</Label>
                    </Body>
                  </ListItem>
                </View>
              );
            })}
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewsFilterDateScreen);
