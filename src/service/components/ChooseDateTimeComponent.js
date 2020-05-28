/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React, {Component} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {Button} from 'native-base';
import DatePicker from 'react-native-datepicker';
import {time, yearMonthDay} from '../../utils/date';
import API from '../../utils/api';

const styles = StyleSheet.create({
  scrollView: {},
  scrollViewInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  timeContainer: {
    marginTop: 6,
    marginLeft: -10,
    marginRight: -10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    width: 120,
    margin: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderColor: '#027aff',
    borderRadius: 5,
    borderWidth: 1,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 16,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: -2,
  },
});

const {width: screenWidth} = Dimensions.get('window');
const datePickerStyles = StyleSheet.create({
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
  // TODO: Для чего эти стили ???
  datePicker: {
    borderTopColor: 0,
  },
});

export default class ChooseDateTimeComponent extends Component {
  constructor(props) {
    super(props);

    console.log('props.time ====>', props.time);
    this.state = {
      time: props.time ? props.time / 1000 : undefined,
      date: props.time || undefined,
      availablePeriods: [],
    };
  }

  componentDidMount() {
    if (this.state.date) {
      this._getTimePeriod(this.state.date);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.time && this.props.time === undefined) {
      this.setState({
        date: undefined,
      });
    }
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

    if (availablePeriods.data == null) {
      alert('Нет доступных периодов, попробуйте выбрать другой день');
    }

    console.log('availablePeriods.data', availablePeriods.data);

    this.setState({availablePeriods: availablePeriods.data});
  }

  render() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
      <>
        <View style={styles.field}>
          <Text style={styles.label}>Выберите дату</Text>
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
        </View>

        {this.state.date && (
          <View style={styles.field}>
            <Text style={styles.label}>Выберите время</Text>
            <View style={styles.timeContainer}>
              {this.state.availablePeriods.map((item) => {
                const from = time(item.from * 1000);
                const to = time(item.to * 1000);
                console.log('time ===>', from, to);
                // eslint-disable-next-line eqeqeq
                const isActive = item.from == this.state.time;
                return (
                  <Button
                    style={[
                      styles.button,
                      {backgroundColor: isActive ? '#027aff' : '#fff'},
                    ]}
                    onPress={() => {
                      this.setState({time: item.from});
                      this.props.onChange({
                        date: this.state.date,
                        time: item.from,
                      });
                    }}>
                    <Text
                      style={[
                        styles.buttonText,
                        {color: isActive ? '#fff' : '#027aff'},
                      ]}>
                      {`${from} - ${to}`}
                    </Text>
                  </Button>
                );
              })}
            </View>
          </View>
        )}
      </>
    );
  }
}
