import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// components
import {
  ListItem,
  Body,
  Item,
  Label,
  Input,
} from 'native-base';

// helpers
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  label: {
    color: '#000',
    fontSize: 18,
    fontFamily: styleConst.font.regular,
  },
  inputItem: {
    borderBottomWidth: 0,
  },
  listItemContainer: {
    backgroundColor: '#fff',
  },
  listItem: {
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
});

export default class ProfileForm extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,

    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
  }

  static defaultProps = {
    name: '',
    phone: '',
    email: '',
  }

  onChangeName = (value) => this.props.nameFill(value)
  onChangePhone = (value) => this.props.phoneFill(value)
  onChangeEmail = (value) => this.props.emailFill(value)

  render() {
    const { name, phone, email } = this.props;

    return (
      <View>
        <View style={styles.listItemContainer}>
          <ListItem style={styles.listItem} >
            <Body>
              <Item style={styles.inputItem} fixedLabel>
                <Label style={styles.label}>ФИО</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Поле для заполнения"
                  onChangeText={this.onChangeName}
                  value={name}
                  returnKeyType="done"
                  underlineColorAndroid="transparent"
                />
              </Item>
            </Body>
          </ListItem>
        </View>

        <View style={styles.listItemContainer}>
          <ListItem style={styles.listItem}>
            <Body>
              <Item style={styles.inputItem} fixedLabel>
                  <Label style={styles.label}>Телефон</Label>
                  <Input
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Поле для заполнения"
                    onChangeText={this.onChangePhone}
                    value={phone}
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    maxLength={20}
                  />
                </Item>
            </Body>
          </ListItem>
        </View>

        <View style={styles.listItemContainer}>
          <ListItem last style={styles.listItem}>
            <Body>
              <Item style={styles.inputItem} fixedLabel last>
                <Label style={styles.label}>Email</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Поле для заполнения"
                  onChangeText={this.onChangeEmail}
                  value={email}
                  keyboardType="email-address"
                  returnKeyType="done"
                  underlineColorAndroid="transparent"
                />
            </Item>
            </Body>
          </ListItem>
        </View>
      </View>
    );
  }
}
