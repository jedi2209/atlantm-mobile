/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {get} from 'lodash';
import {CarCard} from './CarCard';
import {Icon, Button, HStack, Text, View, ScrollView} from 'native-base';
// import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {verticalScale} from '../../utils/scale';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

const mapStateToProps = ({profile}) => {
  return {
    cars: profile.cars,
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

let UserCars = ({activePanel = 'default', cars}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [carsPanel, setActivePanel] = useState(activePanel);
  const [myCars, setMyCars] = useState({default: [], hidden: [], owner: []});

  let carsScrollView = useRef(null);

  useEffect(() => {
    const myCarsTmp = {
      default: [],
      hidden: [],
      owner: [],
    };

    cars.map(item => {
      if (item.hidden) {
        myCarsTmp.hidden.push(item);
      } else {
        myCarsTmp.default.push(item);
      }
      if (item.owner) {
        myCarsTmp.owner.push(item);
      }
    });
    if (myCarsTmp.hidden.length) {
      myCarsTmp.hidden.sort((a, b) => b.owner - a.owner);
    }
    if (myCarsTmp.default.length) {
      myCarsTmp.default.sort((a, b) => b.owner - a.owner);
    }
    if (
      myCarsTmp.default.length ||
      myCarsTmp.hidden.length ||
      myCarsTmp.owner.length
    ) {
      setMyCars(myCarsTmp);
    }
  }, [cars]);

  useEffect(() => {
    if (!get(myCars, 'hidden.length')) {
      setActivePanel('default');
    } else if (!get(myCars, 'default.length')) {
      setActivePanel('hidden');
    }
  }, [myCars]);

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

  const _renderCarsItems = ({carsData}) => {
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{paddingLeft: 12, paddingRight: 5}}
        ref={carsScrollView}>
        {carsData.map(item => {
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
          carsData: myCars[carsPanel],
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
            rounded={'lg'}
            _text={{padding: 1}}
            onPress={() => setActivePanel('hidden')}>
            {strings.UserCars.archiveCheck}
          </Button>
        </View>
      )}
    </>
  );
};

export default connect(mapStateToProps, {})(UserCars);
