/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'native-base';
import {localUserDataUpdate} from '../../profile/actions';

// redux
import {connect} from 'react-redux';
import {
  actionTvaMessageSend,
  actionTvaMessageFill,
  actionSetActiveTvaOrderId,
} from '../actions';

import {TextInput} from '../../core/components/TextInput';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import {get} from 'lodash';
import {dayMonthYearTime} from '../../utils/date';
import styleConst from '../../core/style-const';
import {
  TVA_SEND_MESSAGE__SUCCESS,
  TVA_SEND_MESSAGE__FAIL,
} from '../actionTypes';
import isInternet from '../../utils/internet';
import {ERROR_NETWORK} from '../../core/const';
import {strings} from '../../core/lang/const';

const $size = 40;
const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  list: {
    paddingBottom: $size,
  },
  serviceForm: {
    marginTop: $size,
  },
  // Скопировано из ProfileSettingsScreen.
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: styleConst.color.white,
  },
  header: {
    marginBottom: 36,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  field: {
    marginBottom: 18,
  },
  group: {
    marginBottom: 36,
    padding: 8,
    borderRadius: 4,
  },
  groupLabel: {
    marginBottom: 24,
    fontSize: 18,
  },
  textinput: {
    height: Platform.OS === 'ios' ? 50 : 'auto',
    paddingTop: 20,
    // borderColor: '#d8d8d8',
    // borderBottomWidth: 1,
    backgroundColor: styleConst.color.white,
    color: '#222b45',
    fontSize: 18,
  },
  buttonText: {
    color: styleConst.color.white,
    textTransform: 'uppercase',
    fontSize: 16,
  },
});

const processDate = date => dayMonthYearTime(date);

const mapStateToProps = ({dealer, nav, tva}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    results: tva.results,
    comment: tva.message,
    activeOrderId: tva.activeOrderId,
    isMessageSending: tva.meta.isMessageSending,
  };
};

const mapDispatchToProps = {
  actionTvaMessageFill,
  actionTvaMessageSend,
  actionSetActiveTvaOrderId,
  localUserDataUpdate,
};

const TvaResultsScreen = (props) => {
  const {dealerSelected, results, actionTvaMessageFill, actionSetActiveTvaOrderId, message, navigation, activeOrderId, isMessageSending, localUserDataUpdate, actionTvaMessageSend} = props;
  const [comment, setComment] = useState(message || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {car, info = []} = results;
  const titleCar = `${car.brand} ${car.model}`;
  const titleCarNumber = car.number;
  const textList = [titleCar, titleCarNumber];

  localUserDataUpdate({
    CARBRAND: car.brand,
    CARMODEL: car.model,
  });

  useEffect(() => {
    const activeTvaOrderId = get(results, 'info.0.id');

    actionTvaMessageFill('');
    actionSetActiveTvaOrderId(activeTvaOrderId);
  }, []);

  const onPressOrder = orderId => actionSetActiveTvaOrderId(orderId);

  const onPressMessageButton = async () => {
    setLoading(true);
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      // предотвращаем повторную отправку формы
      if (isMessageSending) {
        return;
      }

      if (!comment) {
        setLoading(false);
        setTimeout(() => {
          Alert.alert('Введи текст сообщения');
        }, 100);

        return;
      }

      actionTvaMessageSend({
        text: comment,
        id: activeOrderId,
        dealer: dealerSelected.id,
      }).then(action => {
        setLoading(false);
        const {type, payload} = action;

        if (type === TVA_SEND_MESSAGE__SUCCESS) {
          Analytics.logEvent('order', 'tva/message');

          setTimeout(() => {
            actionTvaMessageFill('');
            Alert.alert(payload.status);
          }, 100);
        }

        if (type === TVA_SEND_MESSAGE__FAIL) {
          setTimeout(
            () =>
              Alert.alert(
                strings.Notifications.error.title,
                strings.Notifications.error.text,
              ),
            100,
          );
        }
      });
    }
  };

  // onChangeField = fieldName => value => {
  //   this.setState({[fieldName]: value});
  // };
  

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>
            {`${titleCar}\r\n${titleCarNumber}`}
          </Text>
        </View>
        {success ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={styles.group}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {strings.TvaResultsScreen.Notifications.success.messageSent}
              </Text>
            </View>
            <View>
              <Button
                variant="solid"
                _text={styles.buttonText}
                size="lg"
                shadow={4}
                onPress={() =>
                  navigation.navigate('BottomTabNavigation')
                }>
                  {strings.Navigation.back}
              </Button>
            </View>
          </View>
        ) : (
          <>
            {info.map(item => (
              <View key={'ViewTvaResult' + item.id}>
                <View
                  style={[
                    styles.group,
                    activeOrderId === item.id && {
                      backgroundColor: styleConst.color.white,
                    },
                  ]}>
                  <Text style={styles.groupLabel}>№ {item.id}</Text>
                  <View style={styles.field}>
                    <TextInput
                      editable={false}
                      style={styles.textinput}
                      label={strings.TvaResultsScreen.serviceMan}
                      value={item.name}
                    />
                  </View>
                  <View style={styles.field}>
                    <TextInput
                      editable={false}
                      style={styles.textinput}
                      label={strings.TvaResultsScreen.time}
                      value={processDate(item.date)}
                    />
                  </View>
                  <View style={styles.field}>
                    <TextInput
                      editable={false}
                      style={styles.textinput}
                      label={strings.TvaResultsScreen.status}
                      value={item.status}
                    />
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.group}>
              <View style={styles.field}>
                <TextInput
                  multiline={true}
                  numberOfLines={2}
                  style={{
                    height: Platform.OS === 'ios' ? 90 : 'auto',
                    borderColor: '#d8d8d8',
                    paddingTop: 25,
                    borderBottomWidth: 1,
                    color: '#222b45',
                    fontSize: 18,
                  }}
                  label={strings.TvaResultsScreen.messageToServiceMan}
                  value={comment}
                  onChangeText={setComment}
                />
              </View>
            </View>
            <View style={styles.group}>
              <Button
                variant="solid"
                onPress={
                  loading ? undefined : onPressMessageButton
                }
                isLoading={loading}
                _text={styles.buttonText}
                spinnerPlacement="start"
                isLoadingText="Отправляем..."
                size="lg"
                shadow={loading ? 1 : 4}
                style={styles.button}>
                  {strings.Form.button.send}
              </Button>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

TvaResultsScreen.propTypes = {
  dealerSelected: PropTypes.object,
  isMessageSending: PropTypes.bool,
  actionTvaMessageFill: PropTypes.func,
  actionTvaMessageSend: PropTypes.func,
  actionSetActiveTvaOrderId: PropTypes.func,
  comment: PropTypes.string,
  results: PropTypes.object,
  activeOrderId: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(TvaResultsScreen);
