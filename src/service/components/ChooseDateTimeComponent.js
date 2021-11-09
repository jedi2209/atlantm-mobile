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
  Platform,
} from 'react-native';
import {Button, Toast} from 'native-base';
import {DatePickerCustom} from '../../core/components/DatePickerCustom';
import {time, yearMonthDay} from '../../utils/date';
import styleConst from '../../core/style-const';
import API from '../../utils/api';
import {strings} from '../../core/lang/const';

const styles = StyleSheet.create({
  scrollView: {},
  scrollViewInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  timeContainer: {
    marginTop: 6,
    width: '100%',
  },
  timeBlocksContainer: {
    marginVertical: 10,
    paddingLeft: 15,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
  },
  button: {
    width: 60,
    height: 40,
    marginRight: '3%',
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#027aff',
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 14,
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
    paddingLeft: 15,
  },
  labelActive: {
    color: styleConst.color.greyText7,
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
      date: props.value ? new Date(props.value) : undefined,
      availablePeriods: null,
      availablePeriodsFetch: false,
      availablePeriodsFetchCounts: 0,
      modal: false,
      noTimeAlways: false,
      serviceID: props.serviceID ? props.serviceID : undefined,
      reqiredTime: props.reqiredTime ? props.reqiredTime : undefined,
    };
  }

  static propTypes = {
    onChange: PropTypes.func,
    onFinishedSelection: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  };

  _animated = {};

  componentDidMount() {
    if (this.state.date) {
      switch (this.props.type) {
        case 'service':
          this._getTimeService(this.state.date);
          this.messageForSearch =
            strings.ChooseDateTimeComponent.loading.timeService;
          break;
        case 'testDrive':
          this._getTimeTestDrive(this.state.date);
          this.messageForSearch =
            strings.ChooseDateTimeComponent.loading.timeTestDrive;
          break;
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.carID !== this.props.carID ||
      (prevProps.date !== this.props.time && this.props.time === undefined) ||
      (prevProps.dealer &&
        this.props.dealer &&
        prevProps.dealer.id !== this.props.dealer.id)
    ) {
      this.setState({
        date: undefined,
        time: undefined,
      });
    }
  }

  async _getTimeService(date) {
    this.setState({
      modal: false,
      noTimeAlways: false,
      availablePeriods: null,
      availablePeriodsFetch: true,
    });
    this._animated.TimeBlock = new Animated.Value(0);

    const availablePeriods = await API.getPeriodForServiceInfo({
      date: yearMonthDay(date),
      service: this.state?.serviceID,
      seconds: this.state?.reqiredTime,
      dealer: this.props.dealer.id,
    });

    if (availablePeriods.status === 'error') {
      if (availablePeriods.error.code !== 521) {
        this.setState({
          availablePeriodsFetch: false,
          availablePeriods: false,
          availablePeriodsFetchCounts: this.state.availablePeriodsFetchCounts + 1,
        });
        if (this.state.availablePeriodsFetchCounts < 3) {
          Toast.show({
            text: availablePeriods.error.message,
            position: 'bottom',
            type: 'danger',
            duration: 3000,
          });
        } else {
          this.props.onFinishedSelection({
            date: yearMonthDay(date),
            noTimeAlways: true,
            time: undefined,
          });
        }
      } else {
        this.setState({
          availablePeriodsFetch: false,
          availablePeriods: false,
        });
      }
      return true;
    }

    if (availablePeriods.data === null) {
      Toast.show({
        text: strings.ChooseDateTimeComponent.Notifications.error.period,
        position: 'bottom',
        type: 'danger',
        duration: 3000,
      });
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
      useNativeDriver: true,
    }).start();
  }

  async _getTimeTestDrive(date) {
    this.setState({
      modal: false,
      availablePeriods: null,
      availablePeriodsFetch: true,
    });
    this._animated.TimeBlock = new Animated.Value(0);

    const availablePeriods = await API.getTimeForTestDrive({
      date: yearMonthDay(date),
      dealer: this.props.dealer.id,
      carID: this.props.carID,
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
      alert(strings.ChooseDateTimeComponent.Notifications.error.period);
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
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <>
        <DatePickerCustom
          style={{width: '100%'}}
          locale={'ru-RU'}
          styleContainer={{paddingLeft: 15}}
          confirmBtnText={strings.Picker.choose}
          value={this.state.date || null}
          isActive={this.state.modal || false}
          onPressButton={() => {
            if (Platform.OS === 'android') {
              if (
                !this.state.modal &&
                typeof this.state.modal !== 'undefined'
              ) {
                this.setState({modal: true});
              } else {
                this.setState({modal: false});
              }
            } else {
              this.setState({modal: true});
            }
          }}
          onHideModal={() => {
            //только для iOS
            if (!this.state.date || typeof this.state.date === 'undefined') {
              let currentDate = new Date();
              if (this.props.minimumDate) {
                currentDate = this.props.minimumDate;
              }
              this.setState({date: currentDate});
            }
            this.setState({modal: false}, () => {
              switch (this.props.type) {
                case 'service':
                  this._getTimeService(this.state.date);
                  break;
                case 'testDrive':
                  this._getTimeTestDrive(this.state.date);
                  break;
              }
            });
          }}
          onChange={(_, date) => {
            if (Platform.OS === 'android') {
              this.setState({date: date, modal: false});
              switch (this.props.type) {
                case 'service':
                  this._getTimeService(date);
                  break;
                case 'testDrive':
                  this._getTimeTestDrive(date);
                  break;
              }
            } else {
              this.setState({date: date});
            }
            this.props.onFinishedSelection({
              date: date,
              noTimeAlways: this.state.noTimeAlways
                ? this.state.noTimeAlways
                : false,
              time: this.state.time ? this.state.time : undefined,
            });
          }}
          {...this.props}
        />
        {this.state.date && (
          <View
            style={{width: '100%'}}
            key={'fieldTime' + Math.floor(Math.round() * 10000)}>
            {this.state.availablePeriodsFetch ? (
              <>
                <ActivityIndicator
                  color={styleConst.color.blue}
                  style={styleConst.spinner}
                />
                <Text
                  selectable={false}
                  style={{
                    width: '100%',
                    fontSize: 12,
                    color: '#ababab',
                    textAlign: 'center',
                  }}>
                  {this.messageForSearch}
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
                  {strings.ChooseDateTimeComponent.chooseTime}
                </Text>
                <View style={styles.timeBlocksContainer}>
                  {(this.state.availablePeriods || []).map((item, idx) => {
                    const from = time(item.from * 1000);
                    // eslint-disable-next-line eqeqeq
                    const isActive = item.from == this.state.time;
                    return (
                      <Button
                        key={'timeSelectButton' + idx}
                        style={[
                          styles.button,
                          {
                            backgroundColor: isActive
                              ? '#027aff'
                              : styleConst.color.white,
                          },
                        ]}
                        onPress={() => {
                          this.setState({time: item.from});
                          this.props.onFinishedSelection({
                            date: yearMonthDay(this.state.date),
                            time: item.from,
                            tech_place: item.tech_place,
                          });
                        }}>
                        <Text
                          selectable={false}
                          style={[
                            styles.buttonText,
                            {
                              color: isActive
                                ? styleConst.color.white
                                : '#027aff',
                            },
                          ]}>
                          {`${from}`}
                        </Text>
                      </Button>
                    );
                  })}
                </View>
              </Animated.View>
            ) : null}
          </View>
        )}
      </>
    );
  }
}
