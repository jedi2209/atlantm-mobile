import React, { PureComponent } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';

// helpers
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  container: {
    // padding: styleConst.ui.horizontalGap,
    // backgroundColor: '#fff',
    // minHeight: 80,
    // borderBottomWidth: styleConst.ui.borderWidth,
    // borderBottomColor: styleConst.color.greyText,
  },
  textarea: {
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
    fontSize: 18,
  },
});

export default class CommentOrderForm extends PureComponent {
  static propTypes = {
    comment: PropTypes.string,
    commentFill: PropTypes.func,
  }

  onChangeText = text => this.props.commentFill(text)

  render() {
    const { comment } = this.props;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textarea}
          multiline={true}
          numberOfLines={2}
          value={comment}
          returnKeyType="done"
          returnKeyLabel="Готово"
          placeholder="Поле для заполнения"
          onChangeText={this.onChangeText}
          underlineColorAndroid="transparent"
          blurOnSubmit={true}
          textAlignVertical="top"
          placeholderTextColor={styleConst.color.greyText}
        />
      </View>
    );
  }
}
