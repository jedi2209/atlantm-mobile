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

import {get} from 'lodash';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

import Imager from '../../core/components/Imager';
import ActionSheetMenu from '../../core/components/ActionSheetMenu';

import {API_LANG} from '../../core/const';

const mapStateToProps = ({dealer}) => {
  return {
    dealerSelected: dealer.selected,
  };
};

const _renderDivision = divisions => {
  return divisions.map((div, divNum) => {
    if (get(div, 'worktimeShort', []).length) {
      return (
        <Box
          rounded={'lg'}
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
            {renderDayTimeShort(get(div, 'worktimeShort', []), 0, 2)}
            {renderDayTimeShort(get(div, 'worktimeShort', []), 2, 3)}
          </Stack>
        </Box>
      );
    }
  });
};

const renderDayTimeShort = (worktime, first = 0, last = null) => {
  let mode = 'space-between';
  if (last) {
    worktime = worktime.slice(first, last);
  }
  if (worktime.length === 1) {
    mode = 'center';
  }
  if (!worktime.length) {
    return;
  }
  return (
    <HStack justifyContent={mode} alignItems="flex-start">
      {worktime.map((day, dayNum) => {
        const start = get(day, 'time.start', null);
        const finish = get(day, 'time.finish', null);
        return (
          <HStack
            key={'dayTimeShort' + dayNum}
            alignItems="center"
            justifyContent={mode}>
            <Text
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}
              fontWeight="400">
              {get(day, 'days.' + API_LANG, null)}:{' '}
            </Text>
            <Text>{start && finish ? start + '-' + finish : null}</Text>
          </HStack>
        );
      })}
    </HStack>
  );
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

  const renderLocations = (val, num) => {
    const phoneMobile = get(val, 'phoneMobile', []);
    return (
      <View key={'dealerLocation' + num}>
        <Stack space={2} px={2} mt={2} mb={2}>
          <HStack justifyContent={'space-between'}>
            <VStack w={'87%'}>
              <Heading size="md" ellipsizeMode="tail" numberOfLines={1}>
                {get(val, 'name')}
              </Heading>
              <Pressable
                onPress={() => {
                  navigation.navigateDeprecated('MapScreen', {
                    returnScreen: 'Home',
                    name: get(val, 'name'),
                    city: get(val, 'city.name'),
                    address: get(val, 'address'),
                    coords: get(val, 'coords'),
                  });
                }}>
                <Text
                  fontSize="sm"
                  _light={{
                    color: 'blue.500',
                  }}
                  _dark={{
                    color: 'blue.400',
                  }}
                  fontWeight="500">
                  {[get(val, 'city.name'), get(val, 'address')].join(', ')}
                </Text>
              </Pressable>
            </VStack>
            <Pressable
              borderColor="blue.500"
              borderWidth="1"
              p={1}
              rounded={'lg'}
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
                        icon: {
                          name: 'close',
                          color: '#f70707',
                        },
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
        </Stack>
        <VStack space={3} px={2} mb={4}>
          {_renderDivision(get(val, 'divisions', null))}
        </VStack>
      </View>
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
        <View>{get(dealerSelected, 'locations', []).map((val, num) => {
          renderLocations(val, num);
        })}</View>
      </ScrollView>
      <ActionSheetMenu
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        actionSheetData={actionSheetData}
      />
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

export default connect(mapStateToProps, null)(WorkTimeScreen);
