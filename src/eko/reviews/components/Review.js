import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, ListItem, Body, Right } from 'native-base';

// components
import RatingStars from './RatingStars';

// helpers
import { dayMonthYear } from '../../../utils/date';
import styleConst from '../../../core/style-const';

const styles = StyleSheet.create({
  item: {
    paddingTop: 10,
    paddingBottom: 3,
  },
  name: {
    fontSize: 20,
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
    fontSize: 16,
  },
  row: {
    marginBottom: 7,
  },
});

export default class Review extends Component {
  static propTypes = {
    review: PropTypes.object,
    visited: PropTypes.array,
    onPressHandler: PropTypes.func,
    inList: PropTypes.bool,
  }

  static defaultProps = {
    review: null,
    visited: [],
    inList: false,
    onPressHandler: null,
  }

  onPress = () => {
    const { review, onPressHandler } = this.props;

    onPressHandler && onPressHandler(review);
  }

  processDate = (date) => dayMonthYear(date)

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

    const { inList } = this.props;
    const isPlus = type === 'plus';

    return (
      <View style={[styles.review, styles.row, inList ? null : {
        marginBottom: 15,
        marginRight: 40,
        // paddingRight: styleConst.ui.horizontalGapInList,
      }]}>
        <Icon
          name={isPlus ? 'ios-add-circle-outline' : 'ios-remove-circle-outline'}
          style={[
            styles.reviewIcon,
            isPlus ? styles.reviewIconPlus : styles.reviewIconMinus,
          ]}
        />
        <Text
          style={styles.reviewText}
          numberOfLines={inList ? 2 : null}>
            {text}
          </Text>
      </View>
    );
  }

  render() {
    const { review, visited, inList } = this.props;
    const { name, satisfy, date, text, id } = review;
    const isVisited = this.checkVisited();

    return (
      <ListItem onPress={inList ? this.onPress : null} style={styles.item}>
        <Body>
          {this.renderName(name, isVisited)}
          {this.renderRatingAndDate(satisfy, date, id)}
          {this.renderPlusReview(text.plus)}
          {this.renderMinusReview(text.minus)}
        </Body>
          {
            inList ?
              (
                <Right>
                  <Icon
                    name="arrow-forward"
                    style={{
                      color: isVisited ? styleConst.color.systemGray : styleConst.color.systemBlue
                    }}
                  />
                </Right>
              ) : null
          }
      </ListItem>
    );
  }
}
