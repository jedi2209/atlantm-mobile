/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {ActivityIndicator} from 'react-native';
import {ScrollView, Text, View} from 'native-base';
// import LogoLoader from '../../../core/components/LogoLoader';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Form from '../../../core/components/Form/Form';
import TransitionView from '../../../core/components/TransitionView';
import {
  CalendarProvider,
  Calendar,
  LocaleConfig,
  CalendarUtils,
} from 'react-native-calendars';

import Analytics from '../../../utils/amplitude-analytics';
import API from '../../../utils/api';
import {
  addDays,
  dayMonthYear,
  format,
  time,
  getDateFromTimestamp,
} from '../../../utils/date';

// redux
import {connect} from 'react-redux';
import {orderService} from '../../actions';
import {get, groupBy} from 'lodash';

import {strings} from '../../../core/lang/const';

import styleConst from '../../../core/style-const';

const mapStateToProps = ({dealer, service, nav}) => {
  return {
    nav,
    date: service.date,
  };
};

const mapDispatchToProps = {
  orderService,
};

const minDateParam = {
  inStorage: 4,
  default: 1,
};

LocaleConfig.locales.ru = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Янв',
    'Фев',
    'Март',
    'Апр',
    'Май',
    'Июнь',
    'Июль',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ],
  dayNames: [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье',
  ],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня',
};
LocaleConfig.defaultLocale = 'ru';

const ServiceStep3 = props => {
  const {route, region, navigation} = props;

  const minDate = addDays(
    myTyresInStorage ? minDateParam.inStorage : minDateParam.default,
  );
  const maxDate = addDays(30); // Максимальное кол-во дней для запроса
  const maxMonth = parseInt(format(maxDate, 'M'), 10);
  const minMonth = parseInt(format(minDate, 'M'), 10);

  const [hideLeftArrow, setHideLeftArrow] = useState(true);
  const [hideRightArrow, setHideRightArrow] = useState(false);
  const [loadingDate, setLoadingDate] = useState(false);
  const [loading, setLoading] = useState(false);

  const orderData = get(route, 'params', {});
  const myTyresInStorage = get(orderData, 'myTyresInStorage', false) === 1; // 1 - true, 2 - false

  const [selectedDay, setSelectedDay] = useState(minDate);
  const [maxDateDynamic, setMaxDateDynamic] = useState(maxDate);
  const [eventsByDate, setEventsByDate] = useState({});
  const [markedDatesDefault, setMarkedDatesDefault] = useState({});

  const onDayPress = useCallback(day => {
    setSelectedDay(day.dateString);
    setLoadingDate(true);
    setTimeout(() => {
      setLoadingDate(false);
    }, 500);
  }, []);

  const markedDate = useMemo(() => {
    return {
      [selectedDay]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: styleConst.color.blue,
      },
    };
  }, [selectedDay]);

  useEffect(() => {
    Analytics.logEvent('screen', 'service/step3');
    setLoading(true);
    const fetchDatesFromAPI = async () => {
      const availablePeriods = await API.getPeriodForServiceInfo({
        date: minDate,
        dateTo: maxDate,
        service: get(orderData, 'SERVICE', null),
        seconds: get(orderData, 'SERVICESecondFull.total.time', null),
        dealerID: get(orderData, 'DEALER'),
      });

      if (get(availablePeriods, 'status') === 'success') {
        const datesTmp = get(availablePeriods, 'data');
        let dates = [];
        let markedDatesTmp = {};
        let dateMaxTmp = null;
        let dateMinTmp = null;
        for (const [date, timeSlots] of Object.entries(datesTmp)) {
          if (!dateMinTmp && get(timeSlots, 'length', 0)) {
            dateMinTmp = date;
          }
          let timeSlotsTmp = [];
          timeSlots.map(el => {
            timeSlotsTmp.push({
              title: time(getDateFromTimestamp(get(el, 'from'))),
              start: [date, time(getDateFromTimestamp(get(el, 'from')))]
                .join(' ')
                .concat(':00'),
              end: [date, time(getDateFromTimestamp(get(el, 'to')))]
                .join(' ')
                .concat(':00'),
              color: styleConst.color.bg,
              srcData: el,
            });
          });
          dates.push(...timeSlotsTmp);
          if (timeSlotsTmp.length) {
            let dotColor = styleConst.color.green2;
            if (timeSlotsTmp.length <= 12) {
              dotColor = styleConst.color.yellow;
            }
            if (timeSlotsTmp.length <= 5) {
              dotColor = styleConst.color.orange2;
            }
            markedDatesTmp[date] = {
              selected: false,
              marked: true,
              dotColor: dotColor,
            };
            dateMaxTmp = date;
          } else {
            markedDatesTmp[date] = {
              disabled: true,
              disableTouchEvent: true,
              // dotColor: styleConst.color.red,
            };
          }
        }
        if (dateMaxTmp !== maxDate) {
          setMaxDateDynamic(dateMaxTmp);
        }
        if (dateMinTmp !== selectedDay) {
          setSelectedDay(dateMinTmp);
        }
        setEventsByDate(
          groupBy(dates, e => CalendarUtils.getCalendarDateString(e.start)),
        );
        setMarkedDatesDefault(markedDatesTmp);
      }
      setLoading(false);
    };

    fetchDatesFromAPI();
  }, [maxDate, minDate, orderData]);

  const _onPressOrder = async pushProps => {
    if (
      get(pushProps, 'DATETIME.noTimeAlways') === true ||
      !get(pushProps, 'DATETIME.time')
    ) {
      pushProps.lead = true;
    }
    navigation.navigate('ServiceStep4', {
      ...orderData,
      ...pushProps,
    });
  };

  const showDateSlots = eventsByDateTmp => {
    if (typeof eventsByDateTmp === 'undefined') {
      console.error(
        'showDateSlots',
        'typeof eventsByDateTmp === undefined',
        eventsByDateTmp,
      );
      return;
    }
    let datesTmp = [];
    const timeSlotsTmpArr = eventsByDateTmp.reduce(
      (accumulator, currentValue, currentIndex, array) => {
        if (currentIndex % 4 === 0) {
          accumulator.push(array.slice(currentIndex, currentIndex + 4));
        }
        return accumulator;
      },
      [],
    );
    timeSlotsTmpArr.map(el => {
      datesTmp.push(
        el.map((dateSlot, indx) => (
          <TransitionView
            animation={'zoomIn'}
            duration={35}
            index={indx}
            key={'TransitionTimeSlot' + get(dateSlot, 'srcData.from')}>
            <RNBounceable
              onPress={() => {
                const dateData = get(dateSlot, 'srcData');
                _onPressOrder({
                  DATETIME: {
                    noTimeAlways: false,
                    date: get(dateData, 'date'),
                    time: get(dateData, 'from'),
                  },
                });
              }}>
              <View
                rounded={'xl'}
                key={'ViewTimeSlot' + get(dateSlot, 'srcData.from')}
                background={styleConst.color.blue}
                padding={3}
                w={20}
                marginRight={4}
                marginBottom={4}
                alignItems={'center'}>
                <Text color={styleConst.color.white} fontSize={'md'}>
                  {time(get(dateSlot, 'start'))}
                </Text>
              </View>
            </RNBounceable>
          </TransitionView>
        )),
      );
    });
    return (
      <ScrollView padding={4}>
        <View
          flexDirection={'row'}
          flexWrap={'wrap'}
          alignItems={'center'}
          alignSelf={'center'}
          justifyContent={'center'}>
          {datesTmp.map(el => el)}
        </View>
      </ScrollView>
    );
  };

  if (get(orderData, 'lead', false)) {
    return (
      <Form
        contentContainerStyle={{
          paddingHorizontal: 14,
          marginTop: 20,
        }}
        key="ServiceForm"
        fields={{
          groups: [
            {
              name: strings.Form.field.label.date,
              fields: [
                {
                  name: 'DATETIME',
                  type: 'date',
                  label: strings.Form.field.label.date,
                  props: {
                    placeholder:
                      strings.Form.field.placeholder.date +
                      dayMonthYear(minDate),
                    required: true,
                    type: 'service',
                    serviceID: get(orderData, 'SERVICE', null),
                    minimumDate: new Date(minDate),
                    maximumDate: new Date(maxDate),
                    dealer: {
                      id: get(orderData, 'DEALER'),
                    },
                    reqiredTime: get(
                      orderData,
                      'SERVICESecondFull.total.time',
                      null,
                    ),
                  },
                },
                {
                  name: 'Text',
                  type: 'component',
                  value: (
                    <Text
                      style={{
                        color: styleConst.color.greyText3,
                        paddingVertical: 5,
                        fontStyle: 'italic',
                        fontSize: 13,
                      }}>
                      {strings.ServiceScreenStep3.additionalInfo}
                    </Text>
                  ),
                },
              ],
            },
          ],
        }}
        barStyle={'light-content'}
        defaultCountryCode={region}
        onSubmit={_onPressOrder}
        SubmitButton={{
          text: strings.Form.button.next,
          noAgreement: true,
        }}
      />
    );
  }

  if (
    !get(Object.keys(eventsByDate), 'length', 0) ||
    !get(Object.keys(markedDatesDefault), 'length', 0) ||
    loading
  ) {
    // return <LogoLoader />;
    return <ActivityIndicator color={styleConst.color.blue} marginTop={15} />;
  }

  return (
    <TransitionView animation={'fadeInDownBig'} duration={1200} flex={1}>
      <CalendarProvider date={selectedDay} disabledOpacity={0.6}>
        <Calendar
          onDayPress={onDayPress}
          minDate={minDate}
          maxDate={maxDateDynamic}
          firstDay={1}
          allowSelectionOutOfRange={false}
          hideExtraDays={true}
          onMonthChange={date => {
            get(date, 'month') === maxMonth
              ? setHideRightArrow(true)
              : setHideRightArrow(false);

            get(date, 'month') === minMonth
              ? setHideLeftArrow(true)
              : setHideLeftArrow(false);
          }}
          enableSwipeMonths={true}
          disableArrowLeft={hideLeftArrow}
          disableArrowRight={hideRightArrow}
          markedDates={{...markedDatesDefault, ...markedDate}}
        />
        {loadingDate ? (
          <View style={{marginTop: 20}}>
            <ActivityIndicator color={styleConst.color.blue} marginTop={15} />
          </View>
        ) : (
          showDateSlots(eventsByDate[selectedDay])
        )}
      </CalendarProvider>
    </TransitionView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceStep3);
