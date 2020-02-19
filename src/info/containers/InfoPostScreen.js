import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Linking,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

// redux
import {connect} from 'react-redux';
import {fetchInfoPost, callMeForInfo} from '../actions';

import Spinner from 'react-native-loading-spinner-overlay';
import {Content, Button} from 'native-base';
// import FooterButton from '../../core/components/FooterButton';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import WebViewAutoHeight from '../../core/components/WebViewAutoHeight';
import Imager from '../../core/components/Imager';

// helpers
import {get} from 'lodash';
import styleConst from '../../core/style-const';
import processHtml from '../../utils/process-html';
import {verticalScale} from '../../utils/scale';
import stylesHeader from '../../core/components/Header/style';
import {dayMonth, dayMonthYear} from '../../utils/date';

// image
let IMAGE_HEIGHT_GUARD = 0;
const {width: screenWidth} = Dimensions.get('window');
const IMAGE_WIDTH = screenWidth;
const IMAGE_HEIGHT = 170;

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
    marginBottom: 90,
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

const mapStateToProps = ({dealer, info, profile}) => {
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

class InfoPostScreen extends Component {
  state = {
    imageWidth: IMAGE_WIDTH,
    imageHeight: IMAGE_HEIGHT,
    webViewWidth: screenWidth - styleConst.ui.verticalGap,
  };

  static navigationOptions = ({navigation}) => ({
    headerStyle: stylesHeader.blueHeader,
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: (
      <View>
        <HeaderIconBack theme="white" navigation={navigation} />
      </View>
    ),
    headerTitle: <Text style={stylesHeader.blueHeaderTitle}>Об акции</Text>,
    headerRight: <View />,
  });

  componentDidMount() {
    const {posts, navigation, fetchInfoPost} = this.props;

    const id = navigation.state.params.id;
    const post = posts[id];

    if (!post) {
      fetchInfoPost(id);
    }
  }

  onLayoutImage = e => {
    const {height: imageDynamicHeight} = e.nativeEvent.layout;

    this.setState({imageHeight: imageDynamicHeight});
  };

  onLayoutWebView = e => {
    const {width: webViewWidth} = e.nativeEvent.layout;

    this.setState({webViewWidth});
  };

  getPost = () => {
    const {posts, navigation} = this.props;
    const id = navigation.state.params.id;

    return posts[id];
  };

  onPressCallMe = () => {
    console.log('this.props', this.props);
    this.props.navigation.navigate('CallMeBackScreen');
  };

  processDate(date = {}) {
    return `c ${dayMonth(date.from)} по ${dayMonthYear(date.to)}`;
  }

  onMessage({nativeEvent}) {
    const data = nativeEvent.data;

    if (typeof data !== undefined && data !== null) {
      Linking.openURL(data);
    }
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {isCallMeRequest} = this.props;

    const post = this.getPost();
    let text = get(post, 'text');
    const img = get(post, 'img');
    const imageUrl = get(img, '10000x440');
    const date = get(post, 'date');

    if (text) {
      text = processHtml(text, this.state.webViewWidth);
    }

    console.log('== InfoPost ==');

    return (
      <SafeAreaView style={styles.safearea}>
        <StatusBar barStyle="light-content" />
        <Content>
          <Spinner visible={isCallMeRequest} color={styleConst.color.blue} />

          {!text ? (
            <ActivityIndicator
              color={styleConst.color.blue}
              style={styles.spinner}
            />
          ) : (
            <View>
              <View style={styles.imageContainer} ref="imageContainer">
                <Imager
                  resizeMode="cover"
                  onLayout={this.onLayoutImage}
                  style={[
                    styles.image,
                    {
                      width: this.state.imageWidth,
                      height: this.state.imageHeight,
                    },
                  ]}
                  source={{uri: imageUrl}}
                />
              </View>
              <View
                style={styles.textContainer}
                onLayout={this.onLayoutWebView}>
                {date ? (
                  <Text style={styles.date}>{this.processDate(date)}</Text>
                ) : null}
                <WebViewAutoHeight
                  source={{html: text}}
                  injectedJavaScript={injectScript}
                  onMessage={this.onMessage}
                />
              </View>
            </View>
          )}
        </Content>
        <Button
          full
          uppercase={false}
          title="позвоните мне"
          style={[
            styleConst.shadow.default,
            {
              backgroundColor: styleConst.color.lightBlue,
              borderColor: styleConst.color.lightBlue,
              color: 'white',
              height: 50,
              borderTopWidth: 0,
              paddingHorizontal: '5%',
              marginBottom: 20,
              position: 'absolute',
              bottom: 0,
              width: '80%',
              borderRadius: 5,
              marginHorizontal: '10%',
            },
          ]}
          onPress={this.onPressCallMe}>
          <Text
            style={{
              color: '#fff',
              fontFamily: styleConst.font.medium,
              fontSize: 16,
              letterSpacing: styleConst.ui.letterSpacing,
            }}>
            позвоните мне
          </Text>
        </Button>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InfoPostScreen);
