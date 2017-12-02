import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, ListItem, Body, Right } from 'native-base';

// components
import RatingStars from './RatingStars';

// helpers
import { get } from 'lodash';
import { dayMonthYear } from '../../../utils/date';
import styleConst from '../../../core/style-const';

const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dash: {
    marginLeft: 2,
    marginRight: 4,
    color: styleConst.color.greyText,
  },
  date: {
    fontSize: 15,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.greyText,
  },
  review: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  reviewIconPlus: {
    color: styleConst.color.green,
  },
  reviewIconMinus: {
    color: styleConst.color.red,
  },
  reviewText: {
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    marginTop: -2,
  },
  row: {
    marginBottom: 5,
  },
});

export default class ReviewsListItem extends Component {
  static propTypes = {
    review: PropTypes.object,
    visited: PropTypes.array,
    onPressHandler: PropTypes.func,
  }

  static defaultProps = {
    review: null,
    visited: [],
    onPressHandler: null,
  }

  onPress = () => {
    const { review, onPressHandler } = this.props;

    onPressHandler && onPressHandler(review);
  }

  processDate = (date) => dayMonthYear(date)

  processReviewText = (text) => {

  }

  checkVisited = () => {
    const { visited, review } = this.props;
    return visited.includes(review.id);
  };

  renderName = (name, isVisited) => {
    if (!name) return null;

    const visitedStyle = { color: isVisited ? styleConst.color.greyText : '#000' };

    return (
      <Text style={[styles.row, styles.name, visitedStyle]}>
        {name}
      </Text>
    );
  }

  renderRatingAndDate = (satisfy, date, id) => {
    if (!satisfy && !date) return null;

    return (
      <View style={[styles.ratingRow, styles.row]}>
        {satisfy ? <RatingStars rating={satisfy} itemId={id} /> : null}
        {satisfy && date ? <Text style={styles.dash}>—</Text> : null}
        {date ? <Text style={styles.date}>{this.processDate(date)}</Text> : null}
      </View>
    );
  }

  renderPlusReview = text => this.renderReview('plus', text);

  renderMinusReview = text => this.renderReview('minus', text)

  renderReview = (type, text) => {
    if (!text) return null;

    const isPlus = type === 'plus';

    return (
      <View style={[styles.review, styles.row]}>
        <Icon
          name={isPlus ? 'ios-add-circle-outline' : 'ios-remove-circle-outline'}
          style={[
            styles.reviewIcon,
            isPlus ? styles.reviewIconPlus : styles.reviewIconMinus,
          ]}
        />
        <Text style={styles.reviewText} numberOfLines={2}>{text}</Text>
      </View>
    );
  }

  render() {
    const { review, visited } = this.props;
    const { name, satisfy, date, text, id } = review;
    const isVisited = this.checkVisited();

    return (
      <ListItem onPress={this.onPress}>
        <Body>
          {this.renderName(name, isVisited)}
          {this.renderRatingAndDate(satisfy, date, id)}
          {this.renderPlusReview(text.plus)}
          {this.renderMinusReview(text.minus)}
        </Body>
        <Right>
          <Icon
            name="arrow-forward"
            style={{ color: isVisited ? styleConst.color.systemGray : styleConst.color.systemBlue }}
          />
        </Right>
      </ListItem>
    );
  }
}
