import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  Linking,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

// redux
import { connect } from 'react-redux';
import { fetchInfoPost, callMeForInfo } from '../actions';

// components
import DeviceInfo from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';
import { Content } from 'native-base';
import FooterButton from '../../core/components/FooterButton';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import WebViewAutoHeight from '../../core/components/WebViewAutoHeight';
import Imager from '../../core/components/Imager';

// helpers
import { get } from 'lodash';
import styleConst from '../../core/style-const';
import processHtml from '../../utils/process-html';
import { verticalScale } from '../../utils/scale';
import stylesHeader from '../../core/components/Header/style';
import { CALL_ME_INFO__SUCCESS, CALL_ME_INFO__FAIL } from '../actionTypes';
import { dayMonth, dayMonthYear } from '../../utils/date';
import isInternet from '../../utils/internet';
import { ERROR_NETWORK } from '../../core/const';
import isIPhoneX from '@utils/is_iphone_x';

const isTablet = DeviceInfo.isTablet();

// image
let IMAGE_HEIGHT_GUARD = 0;
const { width: screenWidth } = Dimensions.get('window');
const IMAGE_WIDTH = isTablet ? null : screenWidth;
const IMAGE_HEIGHT = isTablet ? 220 : 170;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
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

const mapDispatchToProps = {
  fetchInfoPost,
  callMeForInfo,
};

const injectScript = `
(function () {
  window.onclick = function(e) {
    e.preventDefault();
    window.postMessage(e.target.href);
    e.stopPropagation()
  }
}());
`;

let amplitudeGuard = false;

class InfoPostScreen extends Component {
  state = {
    imageWidth: IMAGE_WIDTH,
    imageHeight: IMAGE_HEIGHT,
    webViewWidth: screenWidth - styleConst.ui.verticalGap,
  };

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Об акции',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  });

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
  };

  onLayoutImage = (e) => {
    if (isTablet) {
      return this.onLayoutImageTablet();
    }

    const { height: imageDynamicHeight } = e.nativeEvent.layout;

    this.setState({ imageHeight: imageDynamicHeight });
  };

  onLayoutWebView= (e) => {
    const { width: webViewWidth } = e.nativeEvent.layout;

    this.setState({ webViewWidth });
  };

  getPost = () => {
    const { posts, navigation } = this.props;
    const id = navigation.state.params.id;

    return posts[id];
  };

  onPressCallMe = async () => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {
        name,
        email,
        phone,
        navigation,
        callMeForInfo,
        dealerSelected,
      } = this.props;

      if (!phone) {
        return Alert.alert(
          'Добавьте номер телефона',
          'Для обратного звонка необходимо добавить номер контактного телефона в профиле',
          [
            { text: 'Отмена', style: 'cancel' },
            {
              text: 'Заполнить',
              onPress() { navigation.navigate('Profile2Screen'); },
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
    }
  };

  processDate(date = {}) {
    return `c ${dayMonth(date.from)} по ${dayMonthYear(date.to)}`;
  }

  onMessage({ nativeEvent }) {
    const data = nativeEvent.data;

    if (typeof data !== undefined && data !== null) {
      Linking.openURL(data);
    }
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const { isCallMeRequest, navigation } = this.props;

    const post = this.getPost();
    let text = get(post, 'text');
    const img = get(post, 'img');
    const imageUrl = get(img, isTablet ? '10000x440' : '10000x300');
    const date = get(post, 'date');

    if (text) {
      text = processHtml(text, this.state.webViewWidth);
    }

    console.log('== InfoPost ==');

    return (
      <SafeAreaView style={styles.safearea}>
        <Content>
          <Spinner visible={isCallMeRequest} color={styleConst.color.blue} />

          {
            !text ?
              <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} /> :
              (
                <View>
                  <View style={styles.imageContainer} ref="imageContainer">
                    <Imager
                      resizeMode="contain"
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
                    <WebViewAutoHeight
                      source={{ html: text }}
                      injectedJavaScript={injectScript}
                      onMessage={this.onMessage}
                    />
                  </View>
                </View>
              )
          }
        </Content>

        <FooterButton
          theme="white"
          icon="phone"
          uppercase={false}
          text="Позвоните мне"
          onPressButton={this.onPressCallMe}
        />
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPostScreen);
