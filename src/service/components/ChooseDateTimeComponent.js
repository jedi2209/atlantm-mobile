/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'native-base';
import {DatePickerCustom} from '@core/components/DatePickerCustom';
import {time, yearMonthDay} from '../../utils/date';
import styleConst from '@core/style-const';
import API from '../../utils/api';

const styles = StyleSheet.create({
  scrollView: {},
  scrollViewInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  timeContainer: {
    marginTop: 6,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    width: 130,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
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
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  fieldRequiredFalse: {
    borderRightColor: 'red',
    borderRightWidth: 1,
  },
  fieldRequiredTrue: {
    borderRightColor: 'green',
    borderRightWidth: 1,
  },
  label: {
    fontSize: 14,
    color: '#bababa',
    marginBottom: -2,
  },
  labelActive: {
    color: '#808080',
  },
  spinner: {
    marginVertical: 15,
  },
});

export default class ChooseDateTimeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: props.time ? props.time / 1000 : undefined,
      date: props.time ? new Date(props.time) : undefined,
      availablePeriods: null,
      availablePeriodsFetch: false,
    };
  }

  static propTypes = {
    onChange: PropTypes.func,
    onFinishedSelection: PropTypes.func.isRequired,
  };

  _animated = {};

  componentDidMount() {
    if (this.state.date) {
      this._getTime(this.state.date);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.time && this.props.time === undefined) {
      this.setState({
        date: undefined,
      });
    }
  }

  async _getTime(date) {
    this.setState({availablePeriods: null, availablePeriodsFetch: true});
    this._animated.TimeBlock = new Animated.Value(0);
    console.log('date', yearMonthDay(date));
    console.log('dealer', this.props.dealer.id);

    const availablePeriods = await API.getPeriodForServiceInfo({
      date: yearMonthDay(date),
      dealer: this.props.dealer.id,
    });

    if (availablePeriods.status === 'error') {
      alert(availablePeriods.error.message);
      this.setState({
        availablePeriodsFetch: false,
        date: undefined,
      });
      return false;
    }

    if (availablePeriods.data == null) {
      alert('Нет доступных периодов, попробуйте выбрать другой день');
      this.setState({
        availablePeriodsFetch: false,
        date: undefined,
      });
      return false;
    }

    this.setState({
      availablePeriods: availablePeriods.data,
      availablePeriodsFetch: false,
    });
    Animated.timing(this._animated.TimeBlock, {
      toValue: 1,
      duration: 450,
    }).start();
  }

  render() {
    return (
      <>
        <DatePickerCustom
          showIcon={false}
          mode="date"
          locale="ru-RU"
          placeholder="Выберите дату"
          format="DD MMMM YYYY"
          confirmBtnText="Выбрать"
          cancelBtnText="Отмена"
          date={this.state.date}
          onDateChange={(_, date) => {
            this.setState({date});
            this.props.onFinishedSelection({
              date: date,
              time: undefined,
              tech_place: undefined,
            });
            this._getTime(date);
          }}
          {...this.props}
        />

        {this.state.date && (
          <View key={'fieldTime' + Math.floor(Math.round() * 10000)}>
            {this.state.availablePeriodsFetch ? (
              <>
                <ActivityIndicator
                  color={styleConst.color.blue}
                  style={styles.spinner}
                />
                <Text
                  selectable={false}
                  style={{fontSize: 12, color: '#ababab', textAlign: 'center'}}>
                  ищем свободное время на СТО
                </Text>
              </>
            ) : null}
            {this.state.availablePeriods ? (
              <Animated.View
                style={[
                  styles.timeContainer,
                  {opacity: this._animated.TimeBlock},
                ]}>
                <Text
                  selectable={false}
                  style={[styles.label, styles.labelActive]}>
                  Выберите удобное для вас время
                </Text>
                {(this.state.availablePeriods || []).map((item) => {
                  const from = time(item.from * 1000);
                  const to = time(item.to * 1000);
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
                        this.props.onFinishedSelection({
                          date: this.state.date,
                          time: item.from,
                          tech_place: item.tech_place,
                        });
                      }}>
                      <Text
                        selectable={false}
                        style={[
                          styles.buttonText,
                          {color: isActive ? '#fff' : '#027aff'},
                        ]}>
                        {`${from} - ${to}`}
                      </Text>
                    </Button>
                  );
                })}
              </Animated.View>
            ) : null}
          </View>
        )}
      </>
    );
  }
}
