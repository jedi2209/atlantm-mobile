import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Linking} from 'react-native';
import {
  Text,
  Icon,
  Actionsheet,
  useDisclose,
  Box,
  HStack,
  View,
  Pressable,
  VStack,
  Stack,
  Heading,
  ScrollView,
} from 'native-base';
import {connect} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {get} from 'lodash';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

import Imager from '../../core/components/Imager';

import {callMe} from '../actions';
import {fetchInfoList, actionListReset} from '../../info/actions';

const mapStateToProps = ({dealer}) => {
  return {
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  callMe,
  fetchInfoList,
  actionListReset,
};

const _renderDivision = divisions => {
  return divisions.map((div, divNum) => {
    return (
      <Box
        rounded="lg"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{
          borderColor: 'coolGray.600',
          backgroundColor: 'gray.700',
        }}
        _light={{
          backgroundColor: 'gray.50',
        }}
        key={'division' + get(div, 'id') + divNum}>
        <Stack p="4" space={3}>
          <Heading size="sm">{get(div, 'name')}</Heading>
          <HStack justifyContent={'space-between'} alignItems="flex-start">
            <VStack fontWeight="400" space={1} justifyContent="space-between">
              {renderDayTime(get(div, 'worktime', []), true)}
            </VStack>
            <VStack fontWeight="400" space={1} justifyContent="space-between">
              {renderDayTime(get(div, 'worktime', []), false)}
            </VStack>
          </HStack>
        </Stack>
      </Box>
    );
  });
};

const renderDayTime = (worktime, first) => {
  const divider = 4;
  return worktime.map((day, dayNum) => {
    if (first) {
      if (dayNum >= divider) {
        return;
      }
    } else {
      if (dayNum < divider) {
        return;
      }
    }
    const start = get(day, 'start.fulltime', null);
    const finish = get(day, 'finish.fulltime', null);
    return (
      <HStack alignItems="center" justifyContent={'space-between'}>
        <Text
          color="coolGray.600"
          _dark={{
            color: 'warmGray.200',
          }}
          fontWeight="400">
          {strings.WorkTimeScreen.weeekdayShort[dayNum]}:{' '}
        </Text>
        <Text>{start && finish ? start + '-' + finish : null}</Text>
      </HStack>
    );
  });
};

const WorkTimeScreen = ({dealerSelected, navigation, phonesMobile}) => {
  const screenTitle =
    strings.ContactsScreen.timework.charAt(0).toUpperCase() +
    strings.ContactsScreen.timework.slice(1);

  const [actionSheetData, setActionSheetData] = useState({});
  const {isOpen, onOpen, onClose} = useDisclose();

  const renderLocations = locations => {
    return locations.map(val => {
      const phoneMobile = get(val, 'phoneMobile', []);
      return (
        <View>
          <Stack space={2} px={2} mt={2} mb={2}>
            <HStack justifyContent={'space-between'}>
              <Heading size="md">{get(val, 'address')}</Heading>
              <Pressable
                borderColor="blue.500"
                borderWidth="1"
                p={1}
                rounded="lg"
                onPress={() => {
                  if (phoneMobile.length > 1) {
                    phonesMobile = [];
                    let i = 1;
                    phoneMobile.map((phoneVal, phoneNum) => {
                      phonesMobile.push({
                        priority: i,
                        id: 'phoneMobileLocation' + phoneNum,
                        text: phoneVal,
                        link: 'tel:' + phoneVal.replace(/[^+\d]+/g, ''),
                      });
                      i = i + 1;
                    });
                    setActionSheetData({
                      options: phonesMobile.concat([
                        {
                          priority: phonesMobile.length + 1,
                          id: 'cancel',
                          text: strings.Base.cancel.toLowerCase(),
                          icon: 'ios-close',
                          iconColor: '#f70707',
                        },
                      ]),
                      cancelButtonIndex: phonesMobile.length - 1,
                      title: strings.ContactsScreen.call,
                      destructiveButtonIndex: phonesMobile.length - 1 || null,
                    });
                    onOpen();
                  } else {
                    Linking.openURL(
                      'tel:' + phoneMobile[0].replace(/[^+\d]+/g, ''),
                    ).catch(
                      console.error('phoneMobile[0] failed', phoneMobile),
                    );
                  }
                }}>
                <Icon
                  size={8}
                  as={MaterialIcons}
                  name="phone"
                  color="blue.500"
                  _dark={{
                    color: 'blue.500',
                  }}
                />
              </Pressable>
            </HStack>
            <Text
              fontSize="sm"
              _light={{
                color: 'blue.500',
              }}
              _dark={{
                color: 'blue.400',
              }}
              fontWeight="500"
              mt="-6">
              {get(val, 'city.name')}
            </Text>
          </Stack>
          <VStack space={3} px={2} mb={4}>
            {_renderDivision(get(val, 'divisions', []))}
          </VStack>
        </View>
      );
    });
  };

  const ActionSheetMenu = ({actionSheetData}) => {
    if (!actionSheetData || !actionSheetData['options']) {
      return <></>;
    }
    return (
      <Actionsheet
        hideDragIndicator
        size="full"
        isOpen={isOpen}
        onClose={onClose}>
        <Actionsheet.Content>
          {actionSheetData?.title ? (
            <Box w="100%" my={4} px={4} justifyContent="space-between">
              <Text
                fontSize="xl"
                color="gray.800"
                _dark={{
                  color: 'gray.300',
                }}>
                {actionSheetData.title}
              </Text>
            </Box>
          ) : null}
          {actionSheetData.options.map(el => {
            return (
              <Actionsheet.Item
                onPress={() => {
                  onClose();
                  if (el.navigate) {
                    navigation.navigate(el.navigate, el.navigateOptions);
                  } else {
                    if (el?.link) {
                      Linking.openURL(el.link);
                    }
                  }
                }}
                _text={{
                  fontSize: 'md',
                  color: 'gray.600',
                  w: '100%',
                }}
                startIcon={
                  el.icon ? (
                    <Icon
                      as={Ionicons}
                      color={el.iconColor}
                      mr="1"
                      size={6}
                      name={el.icon}
                    />
                  ) : null
                }>
                {el?.text}
                {el?.subtitle ? (
                  <Text color={'gray.500'}>{el.subtitle}</Text>
                ) : null}
              </Actionsheet.Item>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>
    );
  };

  return (
    <>
      <ScrollView style={styleConst.safearea.default}>
        <Imager
          style={styles.imgHero}
          source={{
            uri:
              get(dealerSelected, 'img.thumb') +
              '1000x1000' +
              '&hash=' +
              get(dealerSelected, 'hash'),
            cache: 'web',
          }}
        />
        <View>{renderLocations(dealerSelected.locations)}</View>
      </ScrollView>
      <ActionSheetMenu actionSheetData={actionSheetData} />
    </>
  );
};

const styles = StyleSheet.create({
  imgHero: {
    left: 0,
    right: 0,
    width: null,
    height: 300,
    resizeMode: 'cover',
    zIndex: 0,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkTimeScreen);
