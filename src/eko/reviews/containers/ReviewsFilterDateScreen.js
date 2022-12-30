/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {VStack, HStack, Box, Text, View, Button, Pressable} from 'native-base';

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

const ReviewsFilterDateScreen = ({
  actionSelectFilterDatePeriod,
  dateFrom,
  actionDateFromFill,
  filterDatePeriod,
  navigation,
}) => {
  const _onPressItem = selectedDatePeriod => {
    requestAnimationFrame(() => {
      if (_isDatePeriodSelected(selectedDatePeriod)) {
        return false;
      }

      actionSelectFilterDatePeriod(selectedDatePeriod);

      _processDate(selectedDatePeriod);
      navigation.goBack();
    });
  };

  const _processDate = datePeriod => {
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

  const _isDatePeriodSelected = selectedDatePeriod =>
    filterDatePeriod === selectedDatePeriod;

  return (
    <VStack space={5} alignContent={'center'} mt={8}>
      {[
        strings.ReviewsFilterDateScreen.periods.all,
        strings.ReviewsFilterDateScreen.periods.week,
        strings.ReviewsFilterDateScreen.periods.month,
        strings.ReviewsFilterDateScreen.periods.year,
      ].map((period, idx, arrayPeriod) => {
        return (
          <Pressable
            key={period}
            ml={4}
            style={stylesList.listItemPressable}
            onPress={() => _onPressItem(period)}>
            <HStack alignItems={'center'}>
              <RadioIcon
                containerStyle={{
                  marginTop: 5,
                }}
                selected={_isDatePeriodSelected(period)}
              />
              <View style={stylesList.bodyWithLeftGap}>
                <Text style={[stylesList.label, {marginTop: 0}]}>{period}</Text>
              </View>
            </HStack>
          </Pressable>
        );
      })}
    </VStack>
  );
};

ReviewsFilterDateScreen.propTypes = {
  filterDatePeriod: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewsFilterDateScreen);
