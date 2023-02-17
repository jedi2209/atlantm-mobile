/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {store} from '../../core/store';
import {get} from 'lodash';
import {CarCard} from './CarCard';
import {
  Icon,
  Button,
  HStack,
  Actionsheet,
  useDisclose,
  Box,
  Text,
  View,
  ScrollView,
  useToast,
} from 'native-base';
// import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ToastAlert from '../../core/components/ToastAlert';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {verticalScale} from '../../utils/scale';
import styleConst from '../../core/style-const';
import orderFunctions from '../../utils/orders';
import {strings} from '../../core/lang/const';

import {actionToggleCar} from '../actions';

const mapDispatchToProps = dispatch => {
  return {
    actionToggleCar: (item, id) => {
      return dispatch(actionToggleCar(item, id));
    },
  };
};

const styles = StyleSheet.create({
  scrollView: {},
  scrollViewInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  carChooseText: {
    textAlign: 'right',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    color: styleConst.color.greyText,
  },
  carChooseTextSelected: {
    textDecorationLine: 'none',
    color: 'black',
  },
});

let UserCars = ({actionToggleCar, activePanel}) => {
  const toast = useToast();
  const navigation = useNavigation();
  const cars = get(store.getState(), 'profile.cars');
  const [loading, setLoading] = useState(false);
  const [carsPanel, setActivePanel] = useState(activePanel);

  const {isOpen, onOpen, onClose} = useDisclose();
  const [actionSheetData, setActionSheetData] = useState({});

  let carsScrollView = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      carsScrollView &&
        carsScrollView.current &&
        carsScrollView.current.scrollToEnd({duration: 500});
    }, 2000);
    setTimeout(() => {
      carsScrollView &&
        carsScrollView.current &&
        carsScrollView.current.scrollTo({x: 0, y: 0, animated: true});
    }, 2500);
  }, []);

  const _renderCarsItems = ({cars}) => {
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{paddingLeft: 12, paddingRight: 5}}
        ref={carsScrollView}>
        {cars.map(item => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              key={item.vin}
              onPress={() => {
                navigation.navigate('CarInfoScreen', {car: item});
                return;
              }}>
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                }}>
                <CarCard data={item} type="profile" />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  let myCars = {
    default: [],
    hidden: [],
    owner: [],
  };
  cars.map(item => {
    if (item.hidden) {
      myCars.hidden.push(item);
    } else {
      myCars.default.push(item);
    }
    if (item.owner) {
      myCars.owner.push(item);
    }
  });
  if (myCars.hidden.length) {
    myCars.hidden.sort((a, b) => b.owner - a.owner);
  }
  if (myCars.default.length) {
    myCars.default.sort((a, b) => b.owner - a.owner);
  }
  return (
    <>
      <HStack
        style={{
          marginHorizontal: 20,
          marginTop: 10,
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 0.5,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: styleConst.color.greyText4,
            }}>
            {strings.UserCars.title}
          </Text>
        </View>
        <HStack
          style={{
            flex: 0.5,
          }}>
          {myCars.default.length > 0 ? (
            <TouchableOpacity
              style={{
                flex: myCars.hidden.length ? 0.6 : 1,
              }}
              onPress={() => {
                setActivePanel('default');
              }}>
              <Text
                selectable={false}
                style={[
                  styles.carChooseText,
                  carsPanel === 'default' ? styles.carChooseTextSelected : null,
                  {
                    marginRight: 5,
                  },
                ]}>
                {strings.UserCars.current}
              </Text>
            </TouchableOpacity>
          ) : null}
          {myCars.hidden.length > 0 ? (
            <TouchableOpacity
              style={{
                flex: myCars.default.length ? 0.4 : 1,
              }}
              onPress={() => {
                setActivePanel('hidden');
              }}>
              <Text
                selectable={false}
                style={[
                  styles.carChooseText,
                  carsPanel === 'hidden' ? styles.carChooseTextSelected : null,
                ]}>
                {strings.UserCars.archive}
              </Text>
            </TouchableOpacity>
          ) : null}
        </HStack>
      </HStack>
      {loading ? (
        <ActivityIndicator
          color={styleConst.color.blue}
          style={{
            alignSelf: 'center',
            marginTop: verticalScale(56),
            marginBottom: verticalScale(55),
          }}
        />
      ) : myCars[carsPanel].length > 0 ? (
        _renderCarsItems({
          cars: myCars[carsPanel],
          navigation: navigation,
        })
      ) : (
        <View
          style={[
            styles.scrollViewInner,
            {
              flex: 1,
              paddingHorizontal: 24,
              marginVertical: 29.5,
              textAlign: 'center',
              alignContent: 'center',
              width: '100%',
              alignItems: 'center',
            },
          ]}
          useNativeDriver>
          <Icon as={MaterialCommunityIcons} name="car-off" size={12} />
          <Text style={{marginTop: 5, marginLeft: 10, lineHeight: 20}}>
            {strings.UserCars.empty.text + '\r\n'}
          </Text>
          <Button
            variant="outline"
            _text={{padding: 1}}
            onPress={() => setActivePanel('hidden')}>
            {strings.UserCars.archiveCheck}
          </Button>
        </View>
      )}
      {/* <ActionSheetMenu /> */}
    </>
  );
};

UserCars.defaultProps = {
  activePanel: 'default',
};

export default connect(null, mapDispatchToProps)(UserCars);
