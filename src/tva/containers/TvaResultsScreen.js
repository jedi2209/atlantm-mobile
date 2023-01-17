/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Alert, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Button,
  View,
  Text,
  ScrollView,
  HStack,
  Heading,
  Box,
  VStack,
  useToast,
} from 'native-base';
import {localUserDataUpdate} from '../../profile/actions';

// redux
import {connect} from 'react-redux';
import {
  actionTvaMessageSend,
  actionTvaMessageFill,
  actionSetActiveTvaOrderId,
} from '../actions';

import {TextInput} from '../../core/components/TextInput';
import ToastAlert from '../../core/components/ToastAlert';

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
  },
  header: {
    marginBottom: 36,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
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

const mapStateToProps = ({dealer, tva}) => {
  return {
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

const TvaResultsScreen = props => {
  const {
    dealerSelected,
    results,
    actionTvaMessageFill,
    actionSetActiveTvaOrderId,
    message,
    activeOrderId,
    isMessageSending,
    localUserDataUpdate,
    actionTvaMessageSend,
  } = props;
  const [comment, setComment] = useState(message || '');
  const [loading, setLoading] = useState(false);
  const [successSent, setsuccessSent] = useState(false);

  const messageField = useRef();

  const toast = useToast();
  const navigation = useNavigation();

  const {car, info = []} = results;
  const titleCar = `${car.brand} ${car.model}`;
  const titleCarNumber = car.number;

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
        setTimeout(() => {
          toast.show({
            render: ({id}) => {
              return (
                <ToastAlert
                  id={id}
                  status={'error'}
                  description={'Введите текст сообщения'}
                  title={strings.Notifications.error.title}
                />
              );
            },
          });
          setLoading(false);
        }, 100);

        return;
      }

      actionTvaMessageSend({
        text: comment,
        id: activeOrderId,
        dealer: dealerSelected.id,
      }).then(action => {
        const {type, payload} = action;

        if (type === TVA_SEND_MESSAGE__SUCCESS) {
          Analytics.logEvent('order', 'tva/message');

          setTimeout(() => {
            toast.show({
              render: ({id}) => {
                return (
                  <ToastAlert
                    id={id}
                    status={'success'}
                    description={payload.status}
                    title={strings.Notifications.success.title}
                  />
                );
              },
            });
            actionTvaMessageFill('');
            setComment('');
            messageField?.current.blur();
            setLoading(false);
          }, 100);
        }

        if (type === TVA_SEND_MESSAGE__FAIL) {
          setTimeout(
            () =>
              toast.show({
                render: ({id}) => {
                  return (
                    <ToastAlert
                      id={id}
                      status={'error'}
                      description={strings.Notifications.error.text}
                      title={strings.Notifications.error.title}
                    />
                  );
                },
              }),
            100,
          );
        }
      });
    }
  };

  return (
    <ScrollView flex={1}>
      <View style={styles.container}>
        <HStack justifyContent="space-between" mb={2}>
          <Text style={styles.heading}>{titleCar}</Text>
          <Text style={styles.heading}>{titleCarNumber}</Text>
        </HStack>
        {successSent ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View rounded={'md'} mb={'1/6'} p={3}>
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
                onPress={() => navigation.navigate('BottomTabNavigation')}>
                {strings.Navigation.back}
              </Button>
            </View>
          </View>
        ) : (
          <>
            {info.map(item => (
              <Box
                key={'ViewTvaResult' + item.id}
                rounded={'md'}
                mb={8}
                p={3}
                style={[
                  activeOrderId === item.id && {
                    backgroundColor: styleConst.color.white,
                  },
                ]}>
                <Heading mb={2} fontSize={18}>
                  № {item.id}
                </Heading>
                <VStack space={'md'}>
                  <HStack justifyContent="space-between">
                    <Text>{strings.TvaResultsScreen.serviceMan}</Text>
                    <Text>{item.name}</Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text>{strings.TvaResultsScreen.time}</Text>
                    <Text>{processDate(item.date)}</Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text>{strings.TvaResultsScreen.status}</Text>
                    <Text>{item.status}</Text>
                  </HStack>
                </VStack>
              </Box>
            ))}
            <View mb={4}>
              <TextInput
                ref={messageField}
                multiline={true}
                numberOfLines={4}
                style={{
                  height: Platform.OS === 'ios' ? 90 : 'auto',
                  color: '#222b45',
                  paddingTop: 25,
                  paddingLeft: 15,
                  paddingBottom: 0,
                  paddingHorizontal: 0,
                  maxHeight: 150,
                  backgroundColor: 'white',
                  fontSize: 18,
                }}
                label={strings.TvaResultsScreen.messageToServiceMan}
                value={comment}
                onChangeText={setComment}
              />
            </View>
            <View>
              <Button
                variant="solid"
                onPress={loading ? undefined : onPressMessageButton}
                isLoading={loading}
                _text={styles.buttonText}
                spinnerPlacement="start"
                isLoadingText={strings.Form.button.sending}
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
