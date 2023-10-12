/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  VStack,
  HStack,
  Text,
  View,
  Pressable,
  Heading,
  Button,
  Select,
  Icon,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// redux
import {connect} from 'react-redux';
import {
  actionDateFromFill,
  actionSelectFilterDatePeriod,
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
} from '../../actions';

// components
import StarRating from 'react-native-star-rating-widget';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import {
  REVIEWS_RATING_TYPE__FROM,
  REVIEWS_RATING_TYPE__TO,
} from '../../constants';
import PropTypes from 'prop-types';

import {
  substructMonth,
  substractWeek,
  substractYears,
} from '../../../utils/date';
import {strings} from '../../../core/lang/const';
import styleConst from '../../../core/style-const';

const mapStateToProps = ({eko, nav}) => {
  return {
    nav,
    filterDatePeriod: eko.reviews.filterDatePeriod,
    filterRatingFrom: eko.reviews.filterRatingFrom,
    filterRatingTo: eko.reviews.filterRatingTo,
  };
};

const mapDispatchToProps = {
  actionDateFromFill,
  actionSelectFilterDatePeriod,
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
};

const ReviewsFilter = props => {
  const {
    actionSelectFilterDatePeriod,
    actionSelectFilterRatingFrom,
    actionSelectFilterRatingTo,
    dateFrom,
    actionDateFromFill,
    filterDatePeriod,
    filterRatingFrom,
    filterRatingTo,
    navigation,
  } = props;
  const [newDateFrom, setNewDateFrom] = useState(filterDatePeriod);
  const [ratingFrom, setRatingFrom] = useState(filterRatingFrom || 1);
  const [ratingTo, setRatingTo] = useState(filterRatingTo || 5);

  const _onPressItemDate = selectedDatePeriod => {
    actionSelectFilterDatePeriod(selectedDatePeriod);
    _processDate(selectedDatePeriod);
  };

  const _processDate = datePeriod => {
    let newDateFromLocal = null;

    switch (datePeriod) {
      case strings.ReviewsFilterDateScreen.periods.all:
        newDateFromLocal = substractYears(10);
        break;
      case strings.ReviewsFilterDateScreen.periods.week:
        newDateFromLocal = substractWeek();
        break;
      case strings.ReviewsFilterDateScreen.periods.month:
        newDateFromLocal = substructMonth();
        break;
      case strings.ReviewsFilterDateScreen.periods.year:
        newDateFromLocal = substractYears(1);
        break;
      default:
        newDateFromLocal = filterDatePeriod;
    }
    setNewDateFrom(newDateFromLocal);
  };

  return (
    <View padding={4} flex={1}>
      <VStack space={5} alignContent={'center'} mt={8}>
        <View>
          <Heading fontFamily={styleConst.font.regular}>
            {strings.ReviewsFilterDateScreen.title}
          </Heading>
          <View alignContent={'center'} mt={2}>
            <Select
              selectedValue={filterDatePeriod}
              _selectedItem={{
                endIcon: (
                  <Icon size="5" as={MaterialCommunityIcons} name="check" />
                ),
              }}
              mt={1}
              onValueChange={itemValue => _onPressItemDate(itemValue)}>
              {[
                strings.ReviewsFilterDateScreen.periods.all,
                strings.ReviewsFilterDateScreen.periods.week,
                strings.ReviewsFilterDateScreen.periods.month,
                strings.ReviewsFilterDateScreen.periods.year,
              ].map((period, idx) => {
                return (
                  <Select.Item
                    label={period}
                    value={period}
                    key={'period' + idx}
                  />
                );
              })}
            </Select>
          </View>
        </View>
        <View>
          <Heading fontFamily={styleConst.font.regular}>
            {strings.ReviewsFilterRatingScreen.title}
          </Heading>
          <VStack space={6} alignContent={'center'} mt={4}>
            <Heading size={'xs'} fontFamily={styleConst.font.regular}>
              {strings.ReviewsFilterRatingScreen.rating.from.toUpperCase()}
            </Heading>
            <StarRating
              color={styleConst.color.blue}
              enableHalfStar={false}
              rating={ratingFrom}
              maxStars={ratingTo - 1}
              onChange={setRatingFrom}
            />
            <Heading size={'xs'} fontFamily={styleConst.font.regular}>
              {strings.ReviewsFilterRatingScreen.rating.to.toUpperCase()}
            </Heading>
            <StarRating
              color={styleConst.color.blue}
              enableHalfStar={false}
              rating={ratingTo}
              onChange={setRatingTo}
            />
          </VStack>
        </View>
      </VStack>
      <Button
        onPress={() => {
          if (ratingFrom !== filterRatingFrom) {
            actionSelectFilterRatingFrom(ratingFrom);
          }
          if (ratingTo !== filterRatingTo) {
            actionSelectFilterRatingTo(ratingTo);
          }
          actionDateFromFill(newDateFrom);
          navigation.goBack();
        }}
        position={'absolute'}
        bottom={10}
        w={'100%'}
        mx={4}
        variant={'solid'}
        colorScheme={'primary'}>
        {strings.Base.ok}
      </Button>
    </View>
  );
};

ReviewsFilter.propTypes = {
  filterDatePeriod: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewsFilter);
