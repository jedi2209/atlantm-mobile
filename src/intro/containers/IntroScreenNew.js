import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, Animated} from 'react-native';
import {View, HStack, Text, Pressable} from 'native-base';
import {strings} from '../../core/lang/const';

// helpers
import styleConst from '../../core/style-const';
import LogoTitle from '../../core/components/LogoTitle';
import FlagButton from '../../core/components/FlagButton';
import {year} from '../../utils/date';

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
  },
});

const currYearSubstract = year - 1991;

const IntroScreenNew = ({navigation}) => {
  const onPressButton = regions =>
    navigation.navigate('ChooseDealerScreen', {goBack: false, regions});

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
          fontFamily={styleConst.font.brand}
          color={styleConst.color.white}>
          {strings.IntroScreen.chooseRegion}
        </Text>
        <HStack alignContent={'center'} justifyContent={'space-around'}>
          {countLogoClick === currYearSubstract ? (
            <FlagButton
              onPress={() => onPressButton(['by'])}
              showCaption={true}
              country={'belarusFree'}
            />
          ) : (
            <FlagButton
              onPress={() => onPressButton(['by'])}
              country={'belarus'}
            />
          )}
          <FlagButton
            onPress={() => onPressButton(['ru'])}
            country={'russia'}
          />
        </HStack>
      </Animated.View>
    </SafeAreaView>
  );
};

export default IntroScreenNew;
