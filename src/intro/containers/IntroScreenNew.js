import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, Animated} from 'react-native';
import {View, HStack, Text, Pressable} from 'native-base';
import {strings} from '../../core/lang/const';

// helpers
import styleConst from '../../core/style-const';
import LogoTitle from '../../core/components/LogoTitle';
import LogoLoader from '../../core/components/LogoLoader';
import FlagButton from '../../core/components/FlagButton';
import {year} from '../../utils/date';

// actions
import {connect} from 'react-redux';
import {selectDealer} from '../../dealer/actions';

const mapDispatchToProps = {
  selectDealer,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConst.color.blueNew,
    justifyContent: 'center',
  },
  logoContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 32,
  },
});

const mapStateToProps = ({dealer}) => {
  return {
    dealer,
    region: dealer.region,
  };
};

const currYearSubstract = year - 1991;

const IntroScreenNew = ({navigation, dealer, selectDealer, region}) => {
  const [isLoading, setLoading] = useState(false);

  const onPressButton = async dealers => {
    setLoading(true);
    selectDealer({
      dealerBaseData: dealer[dealers][0],
      dealerSelected: dealer[dealers][0],
      isLocal: false,
    })
      .then(action => {
        navigation.navigate('BottomTabNavigation', {screen: 'ContactsScreen'});
        // setLoading(false);
      })
      .catch(error => {
        console.error('IntroScreenNew onPressButton', error);
      });
  };

  const [countLogoClick, setCountLogoClick] = useState(0);

  const opacityAnimation = useRef(new Animated.Value(0)).current;

  const opacityStyle = {opacity: opacityAnimation};

  useEffect(() => {
    Animated.timing(opacityAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  if (isLoading) {
    return <LogoLoader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.View style={opacityStyle}>
          <Pressable onPress={() => setCountLogoClick(countLogoClick + 1)}>
            <LogoTitle theme={'white'} />
          </Pressable>
        </Animated.View>
      </View>
      <Animated.View style={[styles.buttonsContainer, opacityStyle]}>
        <Text
          alignSelf={'center'}
          fontSize={24}
          my={16}
          fontFamily={styleConst.font.regular}
          color={styleConst.color.white}>
          {strings.IntroScreen.chooseRegion}
        </Text>
        <HStack alignContent={'center'} justifyContent={'space-around'}>
          {countLogoClick === currYearSubstract && false ? (
            <FlagButton
              onPress={() => onPressButton('listBelarussia')}
              country={'belarusFree'}
              type="flag"
            />
          ) : (
            <FlagButton
              onPress={() => onPressButton('listBelarussia')}
              country={'by'}
              type="button"
              leftIcon={<></>}
              // shadow={null}
              variant={'solid'}
              style={{
                backgroundColor: styleConst.color.white,
                width: '40%',
                height: 70,
              }}
              styleText={{
                fontSize: 20,
                color: styleConst.color.blueNew,
              }}
            />
          )}
          <FlagButton
            onPress={() => onPressButton('listRussia')}
            country={'ru'}
            type="button"
            leftIcon={<></>}
            // shadow={null}
            variant={'solid'}
            style={{
              backgroundColor: styleConst.color.white,
              width: '40%',
              height: 70,
            }}
            styleText={{
              fontSize: 20,
              color: styleConst.color.blueNew,
            }}
          />
        </HStack>
      </Animated.View>
    </SafeAreaView>
  );
};
// "outline" | "ghost" | "solid" | "subtle" | "link" | "unstyled"
export default connect(mapStateToProps, mapDispatchToProps)(IntroScreenNew);
