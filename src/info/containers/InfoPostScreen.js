import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  NetInfo,
  Platform,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
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
import { get, find } from 'lodash';
import styleConst from '../../core/style-const';
import processHtml from '../../utils/process-html';
import { verticalScale } from '../../utils/scale';
import styleHeader from '../../core/components/Header/style';
import { CALL_ME_INFO__SUCCESS, CALL_ME_INFO__FAIL } from '../actionTypes';
import { dayMonth, dayMonthYear } from '../../utils/date';

const isTablet = DeviceInfo.isTablet();

// image
let IMAGE_HEIGHT_GUARD = 0;
const { width: screenWidth } = Dimensions.get('window');
const IMAGE_WIDTH = isTablet ? null : screenWidth;
const IMAGE_HEIGHT = isTablet ? 220 : 178;

const isAndroid = Platform.OS === 'android';

const buttonIconSize = 28;

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
    paddingLeft: styleConst.ui.horizontalGap,
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
  date: {
    color: styleConst.color.greyText2,
    fontFamily: styleConst.font.regular,
    fontSize: 14,
    letterSpacing: styleConst.ui.letterSpacing,
    marginTop: verticalScale(5),
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
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
  state = {
    imageWidth: null,
    imageHeight: IMAGE_HEIGHT,
    webViewWidth: screenWidth - styleConst.ui.verticalGap,
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Об акции',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} returnScreen="InfoListScreen" />,
    headerRight: <View />,
  })

  componentDidMount() {
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
  }

  onLayoutImageTablet = () => {
    this.refs.imageContainer.measure((ox, oy, width, height, px, py) => {
      if (!IMAGE_HEIGHT_GUARD) {
        IMAGE_HEIGHT_GUARD = 1;

        this.setState({
          imageWidth: width,
          imageHeight: height,
        });
      }
    });
  }

  onLayoutImage = (e) => {
    if (isTablet) {
      return this.onLayoutImageTablet();
    }

    const {
      width: imageDynamicWidth,
      height: imageDynamicHeight,
    } = e.nativeEvent.layout;

    this.setState({
      imageHeight: imageDynamicHeight,
      imageWidth: imageDynamicWidth,
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
    NetInfo.isConnected.fetch().then(isConnected => {
      if (!isConnected) {
        setTimeout(() => Alert.alert('Отсутствует интернет соединение'), 100);
        return;
      }

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
            setTimeout(() => Alert.alert('Ваша заявка успешно отправлена'), 100);
          }

          if (action.type === CALL_ME_INFO__FAIL) {
            setTimeout(() => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'), 100);
          }
        });
    });
  }

  processDate(date = {}) {
    return `c ${dayMonth(date.from)} по ${dayMonthYear(date.to)}`;
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const nav = nextProps.nav.newState;
  //   const isActiveScreen = nav.routes[nav.index].routeName === 'InfoPostScreen';

  //   return (this.state.imageWidth !== nextState.imageWidth) ||
  //     (this.state.imageHeight !== nextState.imageHeight) ||
  //       (this.state.webViewWidth !== nextState.webViewWidth) ||
  //         (this.props.isСallMeRequest !== nextProps.isСallMeRequest && isActiveScreen);
  // }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const { list, navigation, isCallMeRequest } = this.props;

    // nav params
    const id = navigation.state.params.id;
    const date = navigation.state.params.date;

    const post = this.getPost();
    let text = get(post, 'text');
    const currentPostInList = find(list, { id });
    const imageUrl = get(currentPostInList, isTablet ? 'img.10000x220' : 'img.10000x150');

    if (text) {
      text = processHtml(text, this.state.webViewWidth);
    }

    console.log('== InfoPost ==');

    return (
      <Container>
        <Content style={styles.content}>

        <Spinner visible={isCallMeRequest} color={styleConst.color.blue} />

          {
            !text ?
              <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} /> :
              (
                <View>
                  <View ref="imageContainer">
                    <CachedImage
                      onLayout={this.onLayoutImage}
                      style={[
                        styles.image,
                        {
                          width: this.state.imageWidth,
                          height: this.state.imageHeight,
                        },
                      ]}
                      source={{ uri: imageUrl }}
                    />
                  </View>
                  <View
                    style={styles.textContainer}
                    onLayout={this.onLayoutWebView}
                  >
                  {
                    date ?
                      <Text style={styles.date}>{this.processDate(date)}</Text> :
                      null
                  }
                    <WebViewAutoHeight dataDetectorTypes={'phoneNumber'} source={{ html: text }} />
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
