import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container,
  Footer,
  FooterTab,
  Button,
  Text,
} from 'native-base';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styleConst from '../../core/style-const';
import { scale } from '../../utils/scale';

const buttonIconSize = 18;
const styles = StyleSheet.create({
  container: {
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
  button: {
    backgroundColor: styleConst.color.lightBlue,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 15,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  buttonIcon: {
    marginLeft: 5,
    width: buttonIconSize,
    resizeMode: 'contain',
  },
});

const mapStateToProps = () => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({

  }, dispatch);
};

class IntroScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  })

  render() {
    return (
      <Container style={styles.container} >
        <View style={styles.logoContainer} >
            <Image
              style={styles.logo}
              source={require('../assets/logo.png')}
            />
          </View>
        <Footer>
          <FooterTab>
            <Button
              onPress={() => this.props.navigation.navigate('ChooseDealerScreen')}
              full
              style={styles.button}
            >
              <Text style={styles.buttonText}>ВЫБЕРЕТЕ СВОЙ АВТОЦЕНТР</Text>
              <Image
                source={require('../../core/components/CustomIcon/assets/arrow-right.png')}
                style={styles.buttonIcon}
              />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);
