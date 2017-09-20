import React, { PureComponent } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';

// components
import {
  ListItem,
  Body,
  Item,
  Label,
  Input,
} from 'native-base';
import DatePicker from 'react-native-datepicker';

// styles
import styleListProfile from '../../core/components/Lists/style';

// helpers
import styleConst from '../../core/style-const';
import { yearMonthDay } from '../../utils/date';

const LIST_ITEM_HEIGHT = 44;
const styles = StyleSheet.create({
  datePicker: {
    alignSelf: Platform.OS === 'ios' ? 'stretch' : 'flex-start',
    flex: 2.1,
  },
});
const datePickerStyles = {
  dateTouchBody: {
    height: LIST_ITEM_HEIGHT,
  },
  dateInput: {
    borderWidth: 0,
    height: LIST_ITEM_HEIGHT,
    alignItems: 'flex-start',
  },
  placeholderText: {
    alignSelf: 'flex-start',
    fontSize: 17,
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
  },
  dateText: {
    fontSize: 17,
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
  },
  datePicker: {
    borderTopColor: 0,
  },
  dateIcon: {
    width: 0,
    marginLeft: 0,
    marginRight: 0,
  },
};

export default class ProfileForm extends PureComponent {
  static propTypes = {
    car: PropTypes.string,
    date: PropTypes.object,
    carFill: PropTypes.func,
    dateFill: PropTypes.func,
  }

  static defaultProps = {
    car: '',
    date: {},
  }

  onChangeCar = (value) => this.props.carFill(value)
  onChangeDate = (formatted, date) => this.props.dateFill({
    date,
    formatted,
  })

  render() {
    const { car, date } = this.props;

    return (
      <View>
        <View style={styleListProfile.listItemContainer}>
          <ListItem style={styleListProfile.listItem} >
            <Body>
              <Item style={styleListProfile.inputItem} fixedLabel>
                <Label style={styleListProfile.label}>Авто</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Поле для заполнения"
                  onChangeText={this.onChangeCar}
                  value={car}
                  returnKeyType="done"
                  returnKeyLabel="Готово"
                  underlineColorAndroid="transparent"
                />
              </Item>
            </Body>
          </ListItem>
        </View>

        <View style={styleListProfile.listItemContainer}>
          <ListItem last style={styleListProfile.listItem}>
            <Body>
              <Item style={styleListProfile.inputItem} fixedLabel last>
                  <Label style={[
                    styleListProfile.label,
                    { flex: 1 },
                  ]}>Дата</Label>
                  <DatePicker
                    style={styles.datePicker}
                    showIcon={false}
                    date={date.formatted}
                    mode="date"
                    minDate={yearMonthDay(Date.now())}
                    placeholder="Выбрать"
                    format="DD MMMM YYYY"
                    confirmBtnText="Выбрать"
                    cancelBtnText="Отмена"
                    customStyles={datePickerStyles}
                    onDateChange={this.onChangeDate}
                  />
                </Item>
            </Body>
          </ListItem>
        </View>

      </View>
    );
  }
}
