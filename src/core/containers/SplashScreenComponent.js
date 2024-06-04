import React, {useState} from 'react';
import {Dimensions, ActivityIndicator, StyleSheet, Text} from 'react-native';

import Modal from 'react-native-modal';

import TransitionView from '../components/TransitionView';
import LogoTitle from '../components/LogoTitle';

import {connect} from 'react-redux';
import styleConst from '../style-const';

const {height} = Dimensions.get('window');

const style = StyleSheet.create({
  modal: {
    flex: 1,
    width: '100%',
    height: '100%',
    margin: 0,
    backgroundColor: styleConst.color.blue,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    marginTop: 20,
  },
  logo: {
    marginTop: height * 0.4,
  },
  text: {
    color: styleConst.color.white,
    fontFamily: styleConst.font.medium,
    fontSize: 14,
    letterSpacing: styleConst.ui.letterSpacing,
    textTransform: 'uppercase',
  },
});

const duration = 350;

const SplashScreenComponent = ({region = null, isAppLoaded = false}) => {
  const [hasAnimationFinish, setAnimationFinish] = useState(false);

  const regionSelected = region !== null;

  const isModalVisible = !isAppLoaded && !hasAnimationFinish && regionSelected;

  return (
    <Modal visible={isModalVisible} animationType={'fade'} style={style.modal}>
      <LogoTitle theme={'white'} styleImage={style.logo} />
      <TransitionView
        style={style.row}
        animation={styleConst.animation.opacityIn}
        duration={duration}
        index={1}>
        <Text style={style.text}>Акции</Text>
      </TransitionView>
      <TransitionView
        style={style.row}
        animation={styleConst.animation.opacityIn}
        duration={duration}
        index={3}>
        <Text style={style.text}>Запись на сервис</Text>
      </TransitionView>
      <TransitionView
        style={style.row}
        animation={styleConst.animation.opacityIn}
        duration={duration}
        index={5}>
        <Text style={style.text}>Онлайн-чат</Text>
      </TransitionView>
      <TransitionView
        style={style.row}
        animation={styleConst.animation.opacityIn}
        duration={duration}
        index={7}>
        <Text style={style.text}>Оценка авто</Text>
      </TransitionView>
      <TransitionView
        style={style.row}
        animation={styleConst.animation.opacityIn}
        duration={duration}
        index={9}>
        <Text style={style.text}>Бонусная программа</Text>
      </TransitionView>
      <TransitionView
        style={style.row}
        animation={styleConst.animation.opacityIn}
        duration={duration}
        index={11}>
        <Text style={style.text}>Автомобили в наличии</Text>
      </TransitionView>
      <TransitionView
        style={style.row}
        animation={styleConst.animation.opacityIn}
        duration={duration}
        index={13}>
        <Text style={style.text}>Тест-драйв</Text>
      </TransitionView>
      <TransitionView
        style={style.row}
        animation={styleConst.animation.zoomIn}
        duration={duration}
        index={15}
        onAnimationEnd={() => setAnimationFinish(true)}>
        <ActivityIndicator color={styleConst.color.white} />
      </TransitionView>
    </Modal>
  );
};

const mapStateToProps = ({core, dealer}) => ({
  isAppLoaded: core.isAppLoaded,
  region: dealer.region,
});

export default connect(mapStateToProps)(SplashScreenComponent);
