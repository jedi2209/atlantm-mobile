import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, StyleSheet} from 'react-native';
import {
  Icon,
  View,
  VStack,
  HStack,
  Box,
  Pressable,
  ScrollView,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {decode} from 'html-entities';

// components
import RatingStars from './RatingStars';

// helpers
import {dayMonthYear} from '../../../utils/date';
import styleConst from '../../../core/style-const';

const styles = StyleSheet.create({
  itemFull: {
    paddingTop: 10,
    paddingBottom: 3,
    minHeight: 150,
    marginBottom: 10,
    marginHorizontal: 7,
    borderRadius: 5,
    padding: 10,
  },
  itemInList: {
    paddingBottom: 3,
    minHeight: 150,
    backgroundColor: 'white',
    marginBottom: 10,
    width: '96%',
    marginHorizontal: '2%',
    borderRadius: 5,
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  reviewFull: {
    marginBottom: 15,
    marginRight: 40,
    alignItems: 'flex-start',
  },
  reviewIcon: {
    marginRight: 15,
  },
  reviewIconPlus: {
    color: styleConst.color.green,
  },
  reviewIconMinus: {
    color: styleConst.color.red,
  },
  reviewText: {
    fontFamily: styleConst.font.light,
    marginTop: -2,
    fontSize: 16,
    color: styleConst.color.greyText3,
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
  };

  static defaultProps = {
    review: null,
    visited: [],
    inList: false,
    onPressHandler: null,
  };

  onPress = () => {
    const {review, onPressHandler} = this.props;
    onPressHandler && onPressHandler(review);
  };

  processDate = date => dayMonthYear(date);

  checkVisited = () => {
    const {visited, review} = this.props;
    return visited.includes(review.id);
  };

  renderName = (name, isVisited) => {
    if (!name) {
      return null;
    }

    const visitedStyle = {
      color: isVisited ? styleConst.color.greyText : '#000',
    };

    return <Text style={[styles.row, styles.name, visitedStyle]}>{name}</Text>;
  };

  renderRatingAndDate = (grade, date, id) => {
    if (!grade && !date) {
      return null;
    }

    return (
      <View style={[styles.row, styles.ratingRow]}>
        {grade ? <RatingStars rating={grade} itemId={id} /> : null}
        {grade && date ? <Text style={styles.dash}>—</Text> : null}
        {date ? (
          <Text style={styles.date}>{this.processDate(date)}</Text>
        ) : null}
      </View>
    );
  };

  renderPlusReview = text => this.renderReview('plus', text);

  renderMinusReview = text => this.renderReview('minus', text);

  renderReview = (type, text) => {
    if (!text || text === 'null') {
      return null;
    }

    const {inList} = this.props;
    const isPlus = type === 'plus';

    text = decode(text, {level: 'xml'});

    return (
      <HStack mb={1} style={[inList ? {width: '90%'} : styles.reviewFull]}>
        <Icon
          name={isPlus ? 'ios-add-circle-outline' : 'ios-remove-circle-outline'}
          as={Ionicons}
          size={6}
          style={[
            styles.reviewIcon,
            isPlus ? styles.reviewIconPlus : styles.reviewIconMinus,
          ]}
        />
        <Text
          style={styles.reviewText}
          ellipsizeMode="tail"
          numberOfLines={inList ? 2 : null}>
          {text}
        </Text>
      </HStack>
    );
  };

  ReviewWrapper = props => {
    if (!props.inList) {
      return (
        <Box
          shadow={3}
          backgroundColor="white"
          p={2}
          pb={2}
          mb={5}
          mx={3}
          borderRadius={5}>
          {props.children}
        </Box>
      );
    } else {
      return (
        <Pressable onPress={this.onPress} shadow={3} style={styles.itemInList}>
          {props.children}
        </Pressable>
      );
    }
  };

  render() {
    const {review, visited, inList} = this.props;
    const {name, grade, date, text, id} = review;
    const isVisited = this.checkVisited();

    return (
      <this.ReviewWrapper inList={inList}>
        <HStack>
          <VStack w="96%">
            {this.renderName(name, isVisited)}
            {this.renderRatingAndDate(grade, date, id)}
            {this.renderPlusReview(text.plus)}
            {this.renderMinusReview(text.minus)}
          </VStack>
          {inList ? (
            <Icon
              name="chevron-forward"
              as={Ionicons}
              size={6}
              style={{
                color: isVisited
                  ? styleConst.color.systemGray
                  : styleConst.color.systemBlue,
              }}
            />
          ) : null}
        </HStack>
      </this.ReviewWrapper>
    );
  }
}
