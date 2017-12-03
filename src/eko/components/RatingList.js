import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

// components
import { Body, Label, ListItem } from 'native-base';
import RadioIcon from '../../core/components/RadioIcon';

// styles
import stylesList from '../../core/components/Lists/style';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../../core/style-const';
import {
  REVIEW_ADD_RATING_5,
  REVIEW_ADD_RATING_4,
  REVIEW_ADD_RATING_3,
  REVIEW_ADD_RATING_2,
  REVIEW_ADD_RATING_1,
} from '../constants';

const styles = StyleSheet.create({
  titleContainer: {
    marginVertical: 20,
    marginHorizontal: styleConst.ui.horizontalGapInList,
  },
  title: {
    fontSize: 20,
    fontFamily: styleConst.font.medium,
    letterSpacing: styleConst.ui.letterSpacing,
  },
});

export default class RatingList extends Component {
  static propTypes = {
    selectRatingValue: PropTypes.func,
    selectRatingVariant: PropTypes.func,
    ratingValue: PropTypes.number,
    ratingVariant: PropTypes.string,
  }

  componentDidMount() {
    const { selectRatingValue, selectRatingVariant } = this.props;

    selectRatingValue(5);
    selectRatingVariant(REVIEW_ADD_RATING_5);
  }

  onPressItem = (selectedRatingVariant) => {
    requestAnimationFrame(() => {
      if (this.isRatingVariantSelected(selectedRatingVariant)) return false;

      const {
        selectRatingValue,
        selectRatingVariant,
      } = this.props;

      let rating;

      switch (selectedRatingVariant) {
        case REVIEW_ADD_RATING_1:
          rating = 1;
          break;
        case REVIEW_ADD_RATING_2:
          rating = 2;
          break;
        case REVIEW_ADD_RATING_3:
          rating = 3;
          break;
        case REVIEW_ADD_RATING_4:
          rating = 4;
          break;
        case REVIEW_ADD_RATING_5:
          rating = 5;
          break;
        default:
          rating = 5;
      }

      selectRatingVariant(selectedRatingVariant);
      selectRatingValue(rating);
    });
  }

  isRatingVariantSelected = selectedRatingVariant => this.props.ratingVariant === selectedRatingVariant

  renderItem = (ratingVariant, onPressHandler, isLast) => (
    <View key={ratingVariant} style={stylesList.listItemContainer}>
      <ListItem
        last={isLast}
        icon
        style={stylesList.listItemPressable}
        onPress={onPressHandler}
      >
        <RadioIcon
          containerStyle={{
            marginTop: 5,
          }}
          selected={this.isRatingVariantSelected(ratingVariant)} />
        <Body style={stylesList.bodyWithLeftGap} >
          <Label style={stylesList.label}>{ratingVariant}</Label>
        </Body>
      </ListItem>
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Насколько в целом вы удовлетворены нашей работой?</Text>
        </View>

        {
          [
            REVIEW_ADD_RATING_5,
            REVIEW_ADD_RATING_4,
            REVIEW_ADD_RATING_3,
            REVIEW_ADD_RATING_2,
            REVIEW_ADD_RATING_1,
          ].map((ratingVariant, idx, arrayRatingVariants) => {
            const handler = () => this.onPressItem(ratingVariant);
            const isLast = (arrayRatingVariants.length - 1) === idx;

            return this.renderItem(ratingVariant, handler, isLast);
          })
        }
      </View>
    );
  }
}
