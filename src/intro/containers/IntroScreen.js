import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, Animated} from 'react-native';
import {View, HStack, Text} from 'native-base';
import TransitionView from '../../core/components/TransitionView';

// helpers
import styleConst from '../../core/style-const';
import LogoTitle from '../../core/components/LogoTitle';
import LogoLoader from '../../core/components/LogoLoader';
import FlagButton from '../../core/components/FlagButton';
import PushNotifications from '../../core/components/PushNotifications';
import {strings} from '../../core/lang/const';

// actions
import {connect} from 'react-redux';
import {selectRegion} from '../../dealer/actions';

const mapDispatchToProps = {
  selectRegion,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConst.color.blue,
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
  flagButtonWrapper: {
    width: '40%',
    marginBottom: '5%',
  },
  flagButtonHeight: {
    height: 70,
  },
  flagButtonText: {
    fontSize: 20,
    color: styleConst.color.blueNew,
  },
});

const IntroScreen = ({navigation, selectRegion}) => {
  const [isLoading, setLoading] = useState(false);

  const onPressButton = async regionSelected => {
    setLoading(true);
    selectRegion(regionSelected);
    PushNotifications.addTag('region', regionSelected);
    PushNotifications.unsubscribeFromTopic(['dealer', 'actions']);
    navigation.navigateDeprecated('BottomTabNavigation', {screen: 'ContactsScreen'});
    setLoading(false);
  };

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
          <LogoTitle theme={'white'} />
        </Animated.View>
      </View>
      <TransitionView
        style={styles.buttonsContainer}
        animation={'bounceInLeft'}
        duration={500}
        index={1}>
        <Text
          alignSelf={'center'}
          fontSize={24}
          my={16}
          fontFamily={styleConst.font.regular}
          color={styleConst.color.white}>
          {strings.IntroScreen.chooseRegion}
        </Text>
      </TransitionView>
      <HStack alignContent={'center'} justifyContent={'space-around'}>
        <TransitionView
          style={[styles.flagButtonWrapper, styles.flagButtonHeight]}
          animation={'zoomInUp'}
          duration={300}
          index={2}>
          <FlagButton
            onPress={() => onPressButton('by')}
            country={'by'}
            type="button"
            leftIcon={null}
            _pressed={{
              shadow: null,
            }}
            variant={'solid'}
            colorScheme={'white'}
            style={styles.flagButtonHeight}
            styleText={styles.flagButtonText}
          />
        </TransitionView>
        <TransitionView
          style={[styles.flagButtonWrapper, styles.flagButtonHeight]}
          animation={'zoomInUp'}
          duration={300}
          index={3}>
          <FlagButton
            onPress={() => onPressButton('ru')}
            country={'ru'}
            type="button"
            leftIcon={null}
            _pressed={{
              shadow: null,
            }}
            variant={'solid'}
            colorScheme={'white'}
            style={styles.flagButtonHeight}
            styleText={styles.flagButtonText}
          />
        </TransitionView>
      </HStack>
    </SafeAreaView>
  );
};
// "outline" | "ghost" | "solid" | "subtle" | "link" | "unstyled"
export default connect(null, mapDispatchToProps)(IntroScreen);
