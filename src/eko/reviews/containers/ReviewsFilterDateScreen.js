/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {VStack, HStack, Box, Text, View, Button} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionDateFromFill, actionSelectFilterDatePeriod} from '../../actions';

// components
import RadioIcon from '../../../core/components/RadioIcon';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../../../core/style-const';
import {
  substructMonth,
  substractWeek,
  substractYears,
} from '../../../utils/date';
import {strings} from '../../../core/lang/const';

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
  static propTypes = {
    filterDatePeriod: PropTypes.string,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.filterDatePeriod !== nextProps.filterDatePeriod;
  }

  onPressItem = selectedDatePeriod => {
    const {actionSelectFilterDatePeriod} = this.props;

    requestAnimationFrame(() => {
      if (this.isDatePeriodSelected(selectedDatePeriod)) {
        return false;
      }

      actionSelectFilterDatePeriod(selectedDatePeriod);

      this.processDate(selectedDatePeriod);
    });
  };

  processDate = datePeriod => {
    const {dateFrom, actionDateFromFill} = this.props;
    let newDateFrom = null;

    switch (datePeriod) {
      case strings.ReviewsFilterDateScreen.periods.all:
        newDateFrom = substractYears(10);
        break;
      case strings.ReviewsFilterDateScreen.periods.week:
        newDateFrom = substractWeek();
        break;
      case strings.ReviewsFilterDateScreen.periods.month:
        newDateFrom = substructMonth();
        break;
      case strings.ReviewsFilterDateScreen.periods.year:
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
      <SafeAreaView style={styleConst.safearea.default}>
        <View>
          {[
            strings.ReviewsFilterDateScreen.periods.all,
            strings.ReviewsFilterDateScreen.periods.week,
            strings.ReviewsFilterDateScreen.periods.month,
            strings.ReviewsFilterDateScreen.periods.year,
          ].map((period, idx, arrayPeriod) => {
            const handler = () => this.onPressItem(period);

            return (
              <View key={period} style={stylesList.listItemContainer}>
                <Button
                  style={stylesList.listItemPressable}
                  onPress={handler}
                  leftIcon={
                    <RadioIcon
                      containerStyle={{
                        marginTop: 5,
                      }}
                      selected={this.isDatePeriodSelected(period)}
                    />
                  }>
                  <View style={stylesList.bodyWithLeftGap}>
                    <Text style={stylesList.label}>{period}</Text>
                  </View>
                </Button>
              </View>
            );
          })}
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewsFilterDateScreen);
