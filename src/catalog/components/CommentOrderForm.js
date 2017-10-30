import React, { PureComponent } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';

// helpers
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  container: {
    padding: styleConst.ui.horizontalGap,
    backgroundColor: '#fff',
    minHeight: 200,
  },
  textarea: {
    backgroundColor: '#fff',
    fontSize: 17,
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
  },
});

export default class CarOrderList extends PureComponent {
  static propTypes = {
    comment: PropTypes.string,
    commentFill: PropTypes.func,
  }

  static defaultProps = {}

  onChangeText = (text) => {
    this.props.commentFill(text);
  }

  render() {
    const { comment } = this.props;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textarea}
          multiline={true}
          numberOfLines={12}
          onChangeText={this.onChangeText}
          value={comment}
          placeholder="Поле для заполнения"
        />
      </View>
    );
  }
}
