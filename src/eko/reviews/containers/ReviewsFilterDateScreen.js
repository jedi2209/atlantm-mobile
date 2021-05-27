/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {SafeAreaView, View, StatusBar} from 'react-native';
import {Body, Label, Content, ListItem, StyleProvider} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionDateFromFill, actionSelectFilterDatePeriod} from '../../actions';

// components
import RadioIcon from '../../../core/components/RadioIcon';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import PropTypes from 'prop-types';
import getTheme from '../../../../native-base-theme/components';
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

  onPressItem = (selectedDatePeriod) => {
    const {actionSelectFilterDatePeriod} = this.props;

    requestAnimationFrame(() => {
      if (this.isDatePeriodSelected(selectedDatePeriod)) {
        return false;
      }

      actionSelectFilterDatePeriod(selectedDatePeriod);

      this.processDate(selectedDatePeriod);
    });
  };

  processDate = (datePeriod) => {
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

  isDatePeriodSelected = (selectedDatePeriod) =>
    this.props.filterDatePeriod === selectedDatePeriod;

  render() {
    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styleConst.safearea.default}>
          <StatusBar barStyle="light-content" />
          <Content>
            {[
              strings.ReviewsFilterDateScreen.periods.all,
              strings.ReviewsFilterDateScreen.periods.week,
              strings.ReviewsFilterDateScreen.periods.month,
              strings.ReviewsFilterDateScreen.periods.year,
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
