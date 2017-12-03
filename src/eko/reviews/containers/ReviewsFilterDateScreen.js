import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Body, Label, Content, ListItem, Container, StyleProvider } from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionReviewsDateFromFill, actionSelectReviewsFilterDatePeriod } from '../../actions';

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
import { substructMonth, substructWeek, substructYear, substruct10Years } from '../../../utils/date';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
});

const mapStateToProps = ({ eko, nav }) => {
  return {
    nav,
    filterDatePeriod: eko.reviews.filterDatePeriod,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionReviewsDateFromFill,
    actionSelectReviewsFilterDatePeriod,
  }, dispatch);
};

class ReviewsFilterDateScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Отзывы за период',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    navigation: PropTypes.object,
    filterDatePeriod: PropTypes.string,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.filterDatePeriod !== nextProps.filterDatePeriod;
  }

  onPressItem = (selectedDatePeriod) => {
    const {
      actionReviewsDateFromFill,
      actionSelectReviewsFilterDatePeriod,
    } = this.props;

    requestAnimationFrame(() => {
      if (this.isDatePeriodSelected(selectedDatePeriod)) return false;

      actionSelectReviewsFilterDatePeriod(selectedDatePeriod);

      this.processDate(selectedDatePeriod);
    });
  }

  processDate = (datePeriod) => {
    const { dateFrom, actionReviewsDateFromFill } = this.props;
    let newDateFrom = null;

    switch (datePeriod) {
      case REVIEWS_FILTER_DATE_PERIOD__ALL:
        newDateFrom = substruct10Years();
        break;
      case REVIEWS_FILTER_DATE_PERIOD__WEEK:
        newDateFrom = substructWeek();
        break;
      case REVIEWS_FILTER_DATE_PERIOD__MONTH:
        newDateFrom = substructMonth();
        break;
      case REVIEWS_FILTER_DATE_PERIOD__YEAR:
        newDateFrom = substructYear();
        break;
      default:
        newDateFrom = dateFrom;
    }

    actionReviewsDateFromFill(newDateFrom);
  }

  isDatePeriodSelected = selectedDatePeriod => this.props.filterDatePeriod === selectedDatePeriod

  render() {
    console.log('== ReviewsFilterDateScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
            {
              [
                REVIEWS_FILTER_DATE_PERIOD__ALL,
                REVIEWS_FILTER_DATE_PERIOD__WEEK,
                REVIEWS_FILTER_DATE_PERIOD__MONTH,
                REVIEWS_FILTER_DATE_PERIOD__YEAR,
              ].map((period, idx, arrayPeriod) => {
                const handler = () => this.onPressItem(period);

                return (
                  <View key={period} style={stylesList.listItemContainer}>
                    <ListItem
                      last={(arrayPeriod.length - 1) === idx}
                      icon
                      style={stylesList.listItemPressable}
                      onPress={handler}
                    >
                      <RadioIcon
                        containerStyle={{
                          marginTop: 5,
                        }}
                        selected={this.isDatePeriodSelected(period)} />
                      <Body style={stylesList.bodyWithLeftGap} >
                        <Label style={stylesList.label}>{period}</Label>
                      </Body>
                    </ListItem>
                  </View>
                );
              })
            }
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewsFilterDateScreen);
