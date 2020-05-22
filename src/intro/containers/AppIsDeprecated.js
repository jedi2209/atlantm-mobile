import React, { Component } from 'react';
import { StyleSheet, Image, View, Linking } from 'react-native';

import Modal from 'react-native-modal';

// helpers
import styleConst from '../../core/style-const';
import { scale } from '../../utils/scale';
import { Container, Icon, Button, Text } from 'native-base';
import { TextAnimationFadeIn } from 'react-native-text-effects';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleConst.color.blue,
  },
  logoContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: scale(200),
    height: scale(200),
    alignSelf: 'center',
  },
  modal: {
    backgroundColor: 'white',
    height: 268,
    width: '96%',
    marginHorizontal: '2%',
    borderRadius: 10,
    padding: 10,
    opacity: 0.96,
    shadowColor: "#fff",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.85,
    shadowRadius: 5.84,
  }
});

export default class AppIsDeprecated extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  onPressButton = () => this.props.navigation.navigate('ChooseDealerScreen')

  render() {
    return (
      <Container style={styles.container}>
        <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../assets/logo.png')}
            />
            <Modal 
            isVisible={true}
            backdropOpacity={0.4}
            swipeDirection="left"
            >
              <View style={styles.modal}>
                  <TextAnimationFadeIn value={"Время перемен!"} delay={100} duration={1000} style={{color: 'black', fontSize: 16, marginBottom: 10,}} />
                  <Text style={{ fontFamily: styleConst.font.regular, fontSize: 12, }}>
                      Мы выпустили принципиально новое приложение!{"\n"}{"\n"}
                      К сожалению, Apple не позволяет провести настолько глобальное обновление в рамках текущего приложения :({"\n"}
                      Поэтому мы вынуждены просить Вас удалить текущее приложение и скачать новое.{"\n"}{"\n"}Спасибо!
                  </Text>
                  <Button
                  iconLeft primary
                  style={{
                      marginTop: 15,
                      shadowColor: "#000",
                      shadowOffset: {
                          width: 0,
                          height: 2,
                      },
                      shadowOpacity: 0.23,
                      shadowRadius: 2.62,
                  }}
                  onPress={() => {
                      Linking.openURL('itms://apps.apple.com/app/apple-store/id1492492166');
                    }}>
                         <Icon name='ios-appstore' />
                        <Text>Скачать новое приложение</Text>
                    </Button>
                </View>
            </Modal>
        </View>
      </Container>
    );
  }
}
