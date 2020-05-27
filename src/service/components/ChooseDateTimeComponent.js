/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React, {Component} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {Button} from 'native-base';
import DatePicker from 'react-native-datepicker';
import {time, yearMonthDay} from '../../utils/date';
import API from '../../utils/api';

const styles = {
  scrollView: {},
  scrollViewInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignContent: 'space-between',
    justifyContent: 'flex-start',
  },
  button: {
    width: 55,
    margin: 10,
    padding: 5,
    borderColor: '#0F66B2',
    borderWidth: 1,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 16,
  },
};

const {width: screenWidth} = Dimensions.get('window');
const datePickerStyles = {
  dateTouchBody: {
    width: screenWidth - 28,
    height: 40,
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
  },
  dateInput: {
    borderWidth: 0,
    alignItems: 'flex-start',
  },
  placeholderText: {
    fontSize: 18,
    color: '#d8d8d8',
  },
  dateText: {
    fontSize: 18,
    color: '#222b45',
  },
  datePicker: {
    borderTopColor: 0,
  },
};

export default class ChooseDateTimeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: undefined,
      date: undefined,
    };
  }

  async _getTimePeriod(date) {
    console.log('date', yearMonthDay(date));
    console.log('dealer', this.props.dealer.id);

    const availablePeriods = await API.getPeriodForServiceInfo({
      date: yearMonthDay(date),
      dealer: this.props.dealer.id,
    });

    if (availablePeriods.status === 'error') {
      alert(availablePeriods.error.message);
    }

    console.log('availablePeriods ===>', availablePeriods);
  }

  render() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stubTime = [
      {
        date: '2020-02-10',
        tech_place: 1,
        from: '1581357600',
        to: '1581357600',
      },
      {
        date: '2020-02-10',
        tech_place: 2,
        from: '1581314400',
        to: '1581357600',
      },
      {
        date: '2020-02-10',
        tech_place: 3,
        from: '1581314400',
        to: '1581357600',
      },
      {
        date: '2020-02-10',
        tech_place: 1,
        from: '1581314400',
        to: '1581357600',
      },
      {
        date: '2020-02-10',
        tech_place: 2,
        from: '1581314400',
        to: '1581357600',
      },
      {
        date: '2020-02-10',
        tech_place: 3,
        from: '1581314400',
        to: '1581357600',
      },
      {
        date: '2020-02-10',
        tech_place: 1,
        from: '1581314400',
        to: '1581357600',
      },
      {
        date: '2020-02-10',
        tech_place: 2,
        from: '1581314400',
        to: '1581357600',
      },
      {
        date: '2020-02-10',
        tech_place: 3,
        from: '1581314400',
        to: '1581357600',
      },
    ];

    return (
      <>
        <Text>Выберите дату</Text>
        <DatePicker
          showIcon={false}
          mode="date"
          minDate={tomorrow}
          placeholder="Выберите дату"
          format="DD MMMM YYYY"
          confirmBtnText="Выбрать"
          cancelBtnText="Отмена"
          customStyles={datePickerStyles}
          date={this.state.date}
          onDateChange={(_, date) => {
            this.setState({date});
            this._getTimePeriod(date);
          }}
        />
        {this.state.date && (
          <>
            <Text>Выберите время</Text>
            <View style={styles.timeContainer}>
              {stubTime.map((item) => {
                const from = time(item.from * 1000);
                const isActive = item.from === this.state.time;
                return (
                  <Button
                    style={[
                      styles.button,
                      {backgroundColor: isActive ? '#0F66B2' : '#fff'},
                    ]}
                    onPress={() => {
                      this.setState({time: item.from});
                      this.props.onChange({
                        date: this.state.date,
                        time: this.state.time,
                      });
                    }}>
                    <Text
                      style={[
                        styles.buttonText,
                        {color: isActive ? '#fff' : '#0F66B2'},
                      ]}>
                      {from}
                    </Text>
                  </Button>
                );
              })}
            </View>
          </>
        )}
      </>
    );
  }
}
