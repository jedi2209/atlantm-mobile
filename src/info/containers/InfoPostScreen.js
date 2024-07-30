import React, {useEffect, useState, useCallback} from 'react';
import {
  Linking,
  Dimensions,
  StyleSheet,
  Image,
  BackHandler,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import TransitionView from '../../core/components/TransitionView';
import {Button, ScrollView, View, Text} from 'native-base';
import ResponsiveImageView from 'react-native-responsive-image-view';

// redux
import {connect} from 'react-redux';
import {fetchInfoPost} from '../actions';

import WebViewAutoHeight from '../../core/components/WebViewAutoHeight';
import Badge from '../../core/components/Badge';

// helpers
import {get} from 'lodash';
import styleConst from '../../core/style-const';
import Analytics from '../../utils/amplitude-analytics';
import {verticalScale} from '../../utils/scale';
import {
  dayMonth,
  dayMonthYear,
  getTimestampFromDate,
  getTimestampInSeconds,
} from '../../utils/date';
import {strings} from '../../core/lang/const';

import {TransparentBack} from '../../navigation/const';
import LogoLoader from '../../core/components/LogoLoader';
import ModalView from '../../core/components/ModalView';
import stylesHeader from '../../core/components/Header/style';

// image
// const {width: screenWidth} = Dimensions.get('window');
// const webViewWidth = screenWidth - styleConst.ui.verticalGap;

const onMessage = ({nativeEvent}) => {
  const data = nativeEvent.data;

  if (typeof data !== undefined && data !== null) {
    Linking.openURL(data);
  }
};

const processDate = date => {
  return `${strings.InfoPostScreen.filter.from} ${dayMonth(date?.from)} ${
    strings.InfoPostScreen.filter.to
  } ${dayMonthYear(date?.to)}`;
};

const _onPressCallMe = ({dealers, navigation, postID}) => {
  // const dealers = get(postData, 'dealers');
  navigation.navigate('CallMeBackScreen', {
    actionID: postID,
    dealerCustom: dealers,
  });
};

const mapStateToProps = ({dealer, info, core}) => {
  return {
    posts: info.posts,
    dealersList: {
      ru: dealer.listRussia,
      by: dealer.listBelarussia,
      ua: dealer.listUkraine,
    },
    region: dealer.region,
    currLang: core.language.selected,
  };
};

const mapDispatchToProps = {
  fetchInfoPost,
};

const InfoPostScreen = ({
  currLang,
  navigation,
  dealersList,
  region,
  posts,
  route,
  fetchInfoPost,
}) => {
  const postID = get(route, 'params.id');
  const dealerCustom = get(route, 'params.dealerCustom');

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [postData, setPost] = useState(posts[postID]);
  const [isFinished, setFinished] = useState(false);
  const [isModalVisible, setModalVisible] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isLoading) {
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isLoading]),
  );

  useEffect(() => {
    console.info('== InfoPost ==');
    let timeOutAfterLoaded = null;

    if (
      typeof posts[postID] === 'undefined' ||
      !get(posts[postID], 'date.from', false)
    ) {
      fetchInfoPost(postID).then(res => {
        if (get(res, 'type') === 'INFO_POST__FAIL') {
          setFinished(true);
        } else {
          setPost(res);
          timeOutAfterLoaded = setTimeout(() => setLoading(false), 500);
        }
      });
    } else {
      setPost(posts[postID]);
      timeOutAfterLoaded = setTimeout(() => setLoading(false), 500);
    }
    Analytics.logEvent('screen', 'offer/item', {
      id: postID,
    });

    return () => {
      clearTimeout(timeOutAfterLoaded);
    };
  }, []);

  useEffect(() => {
    if (
      getTimestampInSeconds() > getTimestampFromDate(get(postData, 'date.to'))
    ) {
      alert('useEffect getTimestampInSeconds > getTimestampFromDate');
      // если акция уже закончилась, то возвращаемся с экрана
      setFinished(true);
    }
  }, [postData, navigation]);

  const _onPressOrder = ({dealers}) => {
    let customDealersList = [];
    dealersList[region].forEach(element => {
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
      actionID: postID,
      region,
      isNewCar: true,
    });
  };

  const _onPressParts = ({dealers}) => {
    let customDealersList = [];
    dealersList[region].forEach(element => {
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
      dealerCustom: dealers,
      dealerHide: true,
      actionID: postID,
      region,
    });
  };

  const _onPressService = ({dealers}) => {
    // const dealers = get(postData, 'dealers');
    let customDealersList = [];
    dealersList[region].forEach(element => {
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
      actionID: postID,
      goBack: true,
      dealerCustom: dealers,
    });
  };

  const renderOrderButton = ({type, dealers}) => {
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
            onPress={() => _onPressOrder({dealers})}>
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
            onPress={() => _onPressService({dealers})}>
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
            onPress={() => _onPressParts({dealers})}>
            <Text style={styles.buttonText}>
              {strings.NewCarItemScreen.sendQuery}
            </Text>
          </Button>
        );
    }
  };

  const onLayoutWebView = e => {
    setTimeout(() => {
      navigation.setOptions(
        TransparentBack(
          navigation,
          route,
          {
            headerTitle: '',
            headerTitleStyle: [
              stylesHeader.transparentHeaderTitle,
              {color: '#222B45'},
            ],
            presentation: 'modal',
            headerStyle: {
              height: 65,
            },
          },
          {
            icon: 'close',
            iconSize: 12,
            ContainerStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              position: 'absolute',
              borderRadius: 15,
              marginTop: 10,
              marginLeft: 10,
              width: 45,
              height: 45,
              zIndex: 100000,
            },
          },
        ),
      );
    }, 150);
    setTimeout(() => setRefreshing(false), 500);
  };

  const _onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchInfoPost(route.params.id).then(() => setRefreshing(false));
  }, []);

  let text = get(postData, 'text');
  const img = get(postData, 'img');
  const imageUrl = get(img, 'main');
  const date = get(postData, 'date');
  const type = get(postData, 'type');
  let dealers = get(postData, 'dealers');
  if (dealerCustom) {
    dealers = [dealerCustom];
  }
  let resizeMode = null;
  if (postData) {
    resizeMode =
      get(postData, 'imgCropAvailable') === true ? 'cover' : 'contain';
  }

  // if (text) {
  //   text = processHtml(text, webViewWidth);
  // }

  if (isFinished) {
    alert('isFinished');
    return (
      <ModalView
        isModalVisible={isModalVisible}
        animationIn="zoomIn"
        animationInTiming={400}
        animationOut="zoomOut"
        onHide={() => {
          alert('onClose');
          setModalVisible(false);
          navigation.goBack();
        }}
        selfClosed={false}>
        <View style={styles.modalView}>
          <Text textAlign={'center'}>
            {strings.InfoPostScreen.button.actionFinished}
          </Text>
        </View>
      </ModalView>
    );
  }

  return (
    <View style={{flex: 1}} backgroundColor={styleConst.color.white}>
      <ScrollView style={{margin: 0, padding: 0, flex: 1}}>
        {!text || isLoading ? (
          <LogoLoader
            style={{
              height: Dimensions.get('window').height - 100,
              position: 'relative',
            }}
          />
        ) : (
          <View style={{flex: 1}}>
            <View style={[styles.imageContainer]}>
              {imageUrl ? (
                <ResponsiveImageView source={{uri: imageUrl}}>
                  {({getViewProps, getImageProps}) => (
                    <View {...getViewProps()}>
                      <Image {...getImageProps()} />
                    </View>
                  )}
                </ResponsiveImageView>
              ) : null}
            </View>
            <View
              onLayout={onLayoutWebView}
              style={{flex: 1}}
              paddingBottom="1/3">
              {date ? (
                <Text style={styles.date}>{processDate(date)}</Text>
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
                key={get(postData, 'hash')}
                source={{html: text}}
                onMessage={onMessage}
              />
            </View>
          </View>
        )}
      </ScrollView>
      {type ? (
        <TransitionView
          animation={styleConst.animation.zoomIn}
          duration={350}
          index={1}
          delay={3000}
          style={[styleConst.shadow.default, styles.buttonWrapper]}>
          {renderOrderButton({type, dealers})}
          <Button
            uppercase={false}
            title={strings.InfoPostScreen.button.callMe}
            style={[
              styles.button,
              styleConst.button.footer.buttonRight,
              {backgroundColor: styleConst.color.lightBlue},
            ]}
            onPress={() => _onPressCallMe({dealers, navigation, postID})}>
            <Text style={styles.buttonText} selectable={false}>
              {strings.InfoPostScreen.button.callMe}
            </Text>
          </Button>
        </TransitionView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
    height: 300,
  },
  imageContainer: {
    minHeight: 50,
  },
  buttonWrapper: {
    marginBottom: 20,
    position: 'absolute',
    bottom: 10,
    height: 50,
    width: '96%',
    marginHorizontal: '2%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: styleConst.color.white,
    borderRadius: 5,
  },
  button: {
    backgroundColor: styleConst.color.lightBlue,
    color: styleConst.color.white,
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
  modalView: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    height: 60,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoPostScreen);
