import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchInfoPost, callMeForInfo } from '../actions';

// components
import DeviceInfo from 'react-native-device-info';
import { CachedImage } from 'react-native-cached-image';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, Content, Button, Footer, FooterTab } from 'native-base';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import WebViewAutoHeight from '../../core/components/WebViewAutoHeight';


// helpers
import _ from 'lodash';
import styleConst from '../../core/style-const';
import processHtml from '../../utils/process-html';
import { scale, verticalScale } from '../../utils/scale';
import styleHeader from '../../core/components/Header/style';
import { CALL_ME_INFO__SUCCESS, CALL_ME_INFO__FAIL } from '../actionTypes';

const buttonIconSize = 28;
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  textContainer: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: styleConst.ui.horizontalGap,
  },
  button: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: styleConst.color.border,
    justifyContent: 'flex-start',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  buttonIcon: {
    marginRight: 10,
    width: buttonIconSize,
    height: buttonIconSize,
  },
});

const mapStateToProps = ({ dealer, info, profile }) => {
  return {
    list: info.list,
    posts: info.posts,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    dealerSelected: dealer.selected,
    isCallMeRequest: info.meta.isCallMeRequest,
    isFetchInfoPost: info.meta.isFetchInfoPost,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchInfoPost,
    callMeForInfo,
  }, dispatch);
};

class InfoPostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageWidth: width,
      imageHeight: scale(155),
      webViewWidth: width - styleConst.ui.verticalGap,
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Об акции',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const {
        posts,
        navigation,
        fetchInfoPost,
      } = this.props;

      const id = navigation.state.params.id;
      const post = posts[id];

      if (!post) {
        fetchInfoPost(id);
      }
    });
  }

  onLayoutImage = (e) => {
    const {
      width: imageWidth,
      height: imageHeight,
    } = e.nativeEvent.layout;

    this.setState({
      imageWidth,
      imageHeight,
    });
  }

  onLayoutWebView= (e) => {
    const { width: webViewWidth } = e.nativeEvent.layout;

    this.setState({ webViewWidth });
  }

  getPost = () => {
    const { posts, navigation } = this.props;
    const id = navigation.state.params.id;

    return posts[id];
  }

  onPressCallMe = () => {
    const {
      name,
      email,
      phone,
      navigation,
      callMeForInfo,
      dealerSelected,
    } = this.props;

    if (!name || !phone) {
      return Alert.alert(
        'Не хватает информации',
        'Для обратного звонка необходимо заполнить ФИО и номер контактного телефона в профиле',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Заполнить',
            onPress() { navigation.navigate('ProfileScreen'); },
          },
        ],
      );
    }

    const post = this.getPost();
    const action = post.id;
    const dealerID = dealerSelected.id;
    const device = `${DeviceInfo.getBrand()} ${DeviceInfo.getSystemVersion()}`;

    callMeForInfo({
      name,
      email,
      phone,
      device,
      action,
      dealerID,
    })
      .then(action => {
        if (action.type === CALL_ME_INFO__SUCCESS) {
          setTimeout(() => Alert.alert('Успешно', 'Ваш запрос на обратный звонок принят'), 100);
        }

        if (action.type === CALL_ME_INFO__FAIL) {
          setTimeout(() => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'), 100);
        }
      });
  }

  render() {
    const { list, navigation, isCallMeRequest } = this.props;

    const id = navigation.state.params.id;
    const post = this.getPost();
    const currentPostInList = _.find(list, { id });
    let text = _.get(post, 'text');

    if (text) {
      text = processHtml(text, this.state.webViewWidth);
    }

    console.log('render info post screen');

    return (
      <Container>
        <Content style={styles.content}>

        <Spinner visible={isCallMeRequest} color={styleConst.color.blue} />

          {
            !text ?
              <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} /> :
              (
                <View>
                  <CachedImage
                    onLayout={this.onLayoutImage}
                    style={[
                      styles.image,
                      {
                        width: this.state.imageWidth,
                        height: this.state.imageHeight,
                      },
                    ]}
                    source={{ uri: _.get(currentPostInList, 'img') }}
                  />
                  <View
                    style={styles.textContainer}
                    onLayout={this.onLayoutWebView}
                  >
                    <WebViewAutoHeight source={{ html: text }} />
                  </View>
                </View>
              )
          }
        </Content>
        <Footer>
          <FooterTab>
            <Button
              onPress={this.onPressCallMe}
              full
              style={styles.button}
            >
              <Image
                source={require('../../contacts/assets/call_me.png')}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Позвоните мне</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPostScreen);
