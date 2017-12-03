import React, { PureComponent } from 'react';
import { Text, StyleSheet, TextInput, View } from 'react-native';

// components
import { Icon, Body, ListItem } from 'native-base';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import { TEXT_REVIEW_ADD_QUESTION__PLUS, TEXT_REVIEW_ADD_QUESTION__MINUS } from '../../constants';
import PropTypes from 'prop-types';
import styleConst from '../../../core/style-const';

const styles = StyleSheet.create({
  listItem: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  textarea: {
    backgroundColor: '#fff',
    fontSize: 16,
    color: styleConst.color.greyText3,
    fontFamily: styleConst.font.light,
    minHeight: 80,
  },
  question: {
    fontSize: 20,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    marginBottom: 10,
  },
  review: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 40,
  },
  reviewIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  reviewIconPlus: {
    color: styleConst.color.green,
  },
  reviewIconMinus: {
    color: styleConst.color.red,
  },
});

export default class ReviewAddMessageForm extends PureComponent {
  static propTypes = {
    messagePlus: PropTypes.string,
    messageMinus: PropTypes.string,
    messagePlusFill: PropTypes.func,
    messageMinusFill: PropTypes.func,
  }

  static defaultProps = {}

  onChangePlusText = text => this.props.messagePlusFill(text)
  onChangeMinusText = text => this.props.messageMinusFill(text)

  renderTextarea = (value, onChangeHandler) => (
    <TextInput
      style={styles.textarea}
      multiline={true}
      numberOfLines={4}
      value={value}
      returnKeyType="done"
      returnKeyLabel="Готово"
      placeholder="Поле для заполнения"
      onChangeText={onChangeHandler}
      underlineColorAndroid="transparent"
      blurOnSubmit={true}
      textAlignVertical="top"
      placeholderTextColor={styleConst.color.greyText}
    />
  )

  renderMessage = (type, value, onChangeHandler, isLast) => {
    const isPlus = type === 'plus';

    return (
      <View style={stylesList.listItemContainer}>
        <ListItem last={isLast} style={[stylesList.listItem, styles.listItem]}>
          <Body>
            <View style={styles.review}>
              <Icon
                name={isPlus ? 'ios-add-circle-outline' : 'ios-remove-circle-outline'}
                style={[
                  styles.reviewIcon,
                  isPlus ? styles.reviewIconPlus : styles.reviewIconMinus,
                ]}
              />
              <View style={styles.textContainer}>
                <Text style={styles.question}>
                  {isPlus ? TEXT_REVIEW_ADD_QUESTION__PLUS : TEXT_REVIEW_ADD_QUESTION__MINUS}
                </Text>
                {this.renderTextarea(value, onChangeHandler)}
              </View>
            </View>
          </Body>
        </ListItem>
      </View>
    );
  }

  render() {
    const {
      messagePlus,
      messageMinus,
      messagePlusFill,
      messageMinusFill,
    } = this.props;

    return (
      <View>
        {this.renderMessage('minus', messageMinus, messageMinusFill)}
        {this.renderMessage('plus', messagePlus, messagePlusFill, true)}
      </View>
    );
  }
}
