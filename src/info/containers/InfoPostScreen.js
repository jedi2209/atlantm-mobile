import React, {Component} from 'react';
import {
  View,
  Text,
  Linking,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {StyleProvider} from 'native-base';

// redux
import {connect} from 'react-redux';
import {fetchInfoPost, callMeForInfo} from '../actions';

import {Content, Button} from 'native-base';
import WebViewAutoHeight from '../../core/components/WebViewAutoHeight';
import Imager from '../../core/components/Imager';
import Badge from '../../core/components/Badge';

// helpers
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import processHtml from '../../utils/process-html';
import Amplitude from '../../utils/amplitude-analytics';
import {verticalScale} from '../../utils/scale';
import {dayMonth, dayMonthYear} from '../../utils/date';
import strings from '../../core/lang/const';

// image
const {width: screenWidth} = Dimensions.get('window');
const IMAGE_WIDTH = screenWidth;
const IMAGE_HEIGHT = 300;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
    height: 300,
  },
  button: {
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
  buttonText: {
    color: styleConst.color.white,
    fontFamily: styleConst.font.medium,
    fontSize: 16,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  textContainer: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 0,
    marginBottom: 90,
  },
  date: {
    color: styleConst.color.greyText2,
    fontFamily: styleConst.font.regular,
    fontSize: 14,
    marginHorizontal: 10,
    letterSpacing: styleConst.ui.letterSpacing,
    marginTop: verticalScale(5),
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    top: 0,
  },
});

const mapStateToProps = ({dealer, info, profile}) => {
  return {
    list: info.list?.data,
    posts: info.posts,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  fetchInfoPost,
  callMeForInfo,
};

class InfoPostScreen extends Component {
  state = {
    imageWidth: IMAGE_WIDTH,
    imageHeight: IMAGE_HEIGHT,
    webViewWidth: screenWidth - styleConst.ui.verticalGap,
    refreshing: false,
  };

  componentDidMount() {
    const {posts, route} = this.props;

    const id = route.params.id;
    const post = posts[id];

    if (!post) {
      this.props.fetchInfoPost(id);
    }
    Amplitude.logEvent('screen', 'offer/item', {
      id: id,
    });
  }

  onLayoutImage = (e) => {
    const {height: imageDynamicHeight} = e.nativeEvent.layout;

    this.setState({imageHeight: imageDynamicHeight});
  };

  onLayoutWebView = (e) => {
    const {width: webViewWidth} = e.nativeEvent.layout;

    this.setState({webViewWidth});
  };

  getPost = () => {
    const {posts, route} = this.props;
    const id = route.params.id;

    return posts[id];
  };

  onPressCallMe = () => {
    const {navigation, route} = this.props;
    const id = route.params.id;
    navigation.navigate('CallMeBackScreen', {actionID: id});
  };

  processDate(date = {}) {
    return `${strings.InfoPostScreen.filter.from} ${dayMonth(date.from)} ${
      strings.InfoPostScreen.filter.to
    } ${dayMonthYear(date.to)}`;
  }

  onMessage({nativeEvent}) {
    const data = nativeEvent.data;

    if (typeof data !== undefined && data !== null) {
      Linking.openURL(data);
    }
  }

  _onRefresh = () => {
    const {route} = this.props;

    this.setState({refreshing: true});
    this.props.fetchInfoPost(route.params.id).then(() => {
      this.setState({refreshing: false});
    });
  };

  render() {
    const post = this.getPost();
    let text = get(post, 'text');
    const img = get(post, 'img');
    const imageUrl = get(img, '10000x440');
    const date = get(post, 'date');
    const type = get(post, 'type');
    const resizeMode =
      new Boolean(get(post, 'imgCropAvailable')) === true ? 'cover' : 'contain';

    if (text) {
      text = processHtml(text, this.state.webViewWidth);
    }

    console.log('== InfoPost ==');

    return (
      <StyleProvider style={getTheme()}>
        <View style={styles.safearea}>
          <Content
            style={{margin: 0, marginTop: -50, padding: 0}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }>
            {!text || this.state.refreshing ? (
              <ActivityIndicator
                color={styleConst.color.blue}
                style={styles.spinner}
              />
            ) : (
              <View>
                <View style={styles.imageContainer} ref="imageContainer">
                  {imageUrl ? (
                    <Imager
                      resizeMode={resizeMode}
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
                  ) : null}
                </View>
                <View
                  style={styles.textContainer}
                  onLayout={this.onLayoutWebView}>
                  {date ? (
                    <Text style={styles.date}>{this.processDate(date)}</Text>
                  ) : null}
                  {type && type.badge ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 3,
                        paddingHorizontal: 9,
                      }}>
                      <Badge
                        id={type.id}
                        key={'badgeItem' + type.id}
                        index={0}
                        bgColor={type?.badge?.[0]}
                        name={type.name}
                        textColor={type?.badge?.[1]}
                      />
                    </View>
                  ) : null}
                  <WebViewAutoHeight
                    style={{
                      backgroundColor: styleConst.color.bg,
                    }}
                    key={get(post, 'hash')}
                    source={{html: text}}
                    onMessage={this.onMessage}
                  />
                </View>
              </View>
            )}
          </Content>
          <Button
            full
            uppercase={false}
            title={strings.InfoPostScreen.button.callMe}
            style={[styleConst.shadow.default, styles.button]}
            onPress={this.onPressCallMe}>
            <Text style={styles.buttonText}>
              {strings.InfoPostScreen.button.callMe}
            </Text>
          </Button>
        </View>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPostScreen);
