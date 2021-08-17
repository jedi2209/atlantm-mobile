import React, {Component} from 'react';
import {
  View,
  Text,
  Linking,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import TransitionView from '../../core/components/TransitionView';
import {StyleProvider, Content, Button} from 'native-base';
import ResponsiveImageView from 'react-native-responsive-image-view';

// redux
import {connect} from 'react-redux';
import {fetchInfoPost, callMeForInfo} from '../actions';

import WebViewAutoHeight from '../../core/components/WebViewAutoHeight';
import Imager from '../../core/components/Imager';
import Badge from '../../core/components/Badge';

// helpers
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import processHtml from '../../utils/process-html';
import Analytics from '../../utils/amplitude-analytics';
import {verticalScale} from '../../utils/scale';
import {dayMonth, dayMonthYear} from '../../utils/date';
import {strings} from '../../core/lang/const';

// image
const {width: screenWidth} = Dimensions.get('window');

const mapStateToProps = ({dealer, info, profile, core}) => {
  return {
    list: info.list?.data,
    posts: info.posts,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    dealersList: {
      ru: dealer.listRussia,
      by: dealer.listBelarussia,
      ua: dealer.listUkraine,
    },
    dealerSelected: dealer.selected,
    currLang: core.language.selected,
  };
};

const mapDispatchToProps = {
  fetchInfoPost,
  callMeForInfo,
};

class InfoPostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageLoaded: 0,
      webViewWidth: screenWidth - styleConst.ui.verticalGap,
      refreshing: false,
    };
  }

  componentDidMount() {
    const {posts, route} = this.props;

    const id = route.params.id;
    const post = posts[id];

    if (!post) {
      this.props.fetchInfoPost(id);
    }
    Analytics.logEvent('screen', 'offer/item', {
      id: id,
    });
  }

  onLayoutWebView = e => {
    const {width: webViewWidth} = e.nativeEvent.layout;

    this.setState({webViewWidth});
  };

  getPost = () => {
    const {posts, route} = this.props;
    const id = route.params.id;

    return posts[id];
  };

  _onPressCallMe = () => {
    const {navigation, route} = this.props;
    const id = route.params.id;
    navigation.navigate('CallMeBackScreen', {actionID: id});
  };

  _onPressOrder = ({dealers}) => {
    const {navigation, route, dealersList, dealerSelected} = this.props;
    const id = route.params.id;
    let customDealersList = [];
    dealersList[dealerSelected.region].forEach(element => {
      if (dealers.includes(element.id)) {
        customDealersList.push({
          id: element.id,
          name: element.name,
        });
      }
    });
    navigation.navigate('OrderScreen', {
      car: {
        dealer: customDealersList,
      },
      actionID: id,
      region: this.props.dealerSelected.region,
      isNewCar: true,
    });
  };

  _onPressParts = ({dealers}) => {
    const {navigation, route, dealersList, dealerSelected} = this.props;
    const id = route.params.id;
    let customDealersList = [];
    dealersList[dealerSelected.region].forEach(element => {
      if (dealers.includes(element.id)) {
        customDealersList.push({
          id: element.id,
          name: element.name,
        });
      }
    });
    navigation.navigate('OrderPartsScreen', {
      car: {
        dealer: customDealersList,
      },
      actionID: id,
      region: this.props.dealerSelected.region,
    });
  };

  _onPressService = ({dealers}) => {
    const {navigation, route, dealersList, dealerSelected} = this.props;
    const id = route.params.id;
    let customDealersList = [];
    dealersList[dealerSelected.region].forEach(element => {
      if (dealers.includes(element.id)) {
        customDealersList.push({
          id: element.id,
          name: element.name,
        });
      }
    });
    navigation.navigate('ServiceScreen', {
      car: {
        dealer: customDealersList,
      },
      actionID: id,
      region: this.props.dealerSelected.region,
    });
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

  _renderOrderButton = ({type, dealers}) => {
    if (!type) {
      return false;
    }
    switch (type.id) {
      case 1: // buy
        return (
          <Button
            uppercase={false}
            title={strings.NewCarItemScreen.sendQuery}
            style={[
              styles.button,
              styleConst.button.footer.buttonLeft,
              {backgroundColor: styleConst.color.white, width: '53%'},
            ]}
            onPress={() => {
              this._onPressOrder({dealers});
            }}>
            <Text
              style={[styles.buttonText, {color: styleConst.color.greyText}]}
              selectable={false}>
              {strings.NewCarItemScreen.sendQuery}
            </Text>
          </Button>
        );
      case 2: // service
        return (
          <Button
            uppercase={false}
            title={strings.NewCarItemScreen.sendQuery}
            style={[
              styles.button,
              styleConst.button.footer.buttonLeft,
              {backgroundColor: styleConst.color.orange, width: '53%'},
            ]}
            onPress={() => {
              this._onPressService({dealers});
            }}>
            <Text style={styles.buttonText} selectable={false}>
              {strings.NewCarItemScreen.sendQuery}
            </Text>
          </Button>
        );
      case 3: // parts
        return (
          <Button
            uppercase={false}
            title={strings.NewCarItemScreen.sendQuery}
            style={[
              styles.button,
              styleConst.button.footer.buttonLeft,
              {backgroundColor: styleConst.color.green, width: '53%'},
            ]}
            onPress={() => {
              this._onPressParts({dealers});
            }}>
            <Text style={styles.buttonText}>
              {strings.NewCarItemScreen.sendQuery}
            </Text>
          </Button>
        );
    }
  };

  _renderImageView = ({getViewProps, getImageProps}) => (
    <View {...getViewProps()}>
      <Imager {...getImageProps()} />
    </View>
  );

  _renderImageViewonLoad = () => {
    this.setState({
      imageLoaded: 1,
    });
  };

  _renderImageViewonError = err => {
    console.error(err);
  };

  render() {
    const {currLang} = this.props;
    const post = this.getPost();
    let text = get(post, 'text');
    const img = get(post, 'img');
    const imageUrl = get(img, '10000x440');
    const date = get(post, 'date');
    const type = get(post, 'type');
    const dealers = get(post, 'dealers');
    let resizeMode = null;
    if (post) {
      resizeMode = get(post, 'imgCropAvailable') === true ? 'cover' : 'contain';
    }

    if (text) {
      text = processHtml(text, this.state.webViewWidth);
    }

    console.info('== InfoPost ==');

    return (
      <StyleProvider style={getTheme()}>
        <View style={styleConst.safearea.default}>
          <StatusBar hidden />
          <Content
            style={{margin: 0, padding: 0}}
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
                <View
                  style={[
                    styles.imageContainer,
                    {opacity: this.state.imageLoaded},
                  ]}
                  ref="imageContainer">
                  {imageUrl ? (
                    <ResponsiveImageView
                      onLoad={this._renderImageViewonLoad}
                      onError={this._renderImageViewonError}
                      source={{uri: imageUrl}}>
                      {this._renderImageView}
                    </ResponsiveImageView>
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
                        bgColor={type?.badge?.background}
                        name={type?.name[currLang]}
                        textColor={type?.badge?.color}
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
          {type ? (
            <TransitionView
              animation={styleConst.animation.zoomIn}
              duration={350}
              index={1}
              delay={3000}
              style={[styleConst.shadow.default, styles.buttonWrapper]}>
              {this._renderOrderButton({type, dealers})}
              <Button
                uppercase={false}
                title={strings.InfoPostScreen.button.callMe}
                style={[
                  styles.button,
                  styleConst.button.footer.buttonRight,
                  {backgroundColor: styleConst.color.lightBlue},
                ]}
                onPress={() => {
                  this._onPressCallMe();
                }}>
                <Text style={styles.buttonText} selectable={false}>
                  {strings.InfoPostScreen.button.callMe}
                </Text>
              </Button>
            </TransitionView>
          ) : null}
        </View>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
    height: 300,
  },
  buttonWrapper: {
    marginBottom: 20,
    position: 'absolute',
    bottom: 10,
    height: 50,
    width: '100%',
    paddingHorizontal: '2%',
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: styleConst.color.lightBlue,
    color: 'white',
    borderTopWidth: 0,
    width: '47%',
    borderRadius: 0,
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 0,
    paddingRight: 0,
  },
  buttonText: {
    color: styleConst.color.white,
    fontFamily: styleConst.font.medium,
    fontSize: 14,
    textTransform: 'uppercase',
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
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoPostScreen);
