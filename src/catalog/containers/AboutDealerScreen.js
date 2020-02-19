import React, {Component} from 'react';
import {
  View,
  Platform,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {
  Text,
  List,
  Body,
  Right,
  Content,
  ListItem,
  StyleProvider,
} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionFetchDealer} from '../actions';

// components
import DeviceInfo from 'react-native-device-info';
import Communications from 'react-native-communications';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import WebViewAutoHeight from '../../core/components/WebViewAutoHeight';
import Imager from '../../core/components/Imager';
import HeaderSubtitle from '../../core/components/HeaderSubtitle';

// helpers
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import {verticalScale} from '../../utils/scale';
import stylesHeader from '../../core/components/Header/style';
import processHtml from '../../utils/process-html';

const isTablet = DeviceInfo.isTablet();

// image
let IMAGE_HEIGHT_GUARD = 0;

const {width: screenWidth} = Dimensions.get('window');
const IMAGE_WIDTH = isTablet ? null : screenWidth;
const IMAGE_HEIGHT = isTablet ? 220 : 160;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  rightText: {
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  descriptionContainer: {
    flex: 1,
    paddingVertical: styleConst.ui.verticalGap - 5,
    paddingHorizontal: styleConst.ui.horizontalGap + 5,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    justifyContent: 'flex-end',
  },
  brand: {
    minWidth: 26,
    height: 22,
    marginRight: 4,
  },
  brandsLine: {
    backgroundColor: 'rgba(255,255,255, 0.8)',
    height: 30,
    paddingHorizontal: styleConst.ui.horizontalGap,
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    backgroundColor: '#fff',
  },
});

const mapStateToProps = ({catalog}) => {
  return {
    dealer: catalog.dealer,
    isFetchingDealer: catalog.meta.isFetchingDealer,
  };
};

const mapDispatchToProps = {
  actionFetchDealer,
};

class AboutDealerScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Об автоцентре',
    headerStyle: [stylesHeader.common, {borderBottomWidth: 0}],
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />, // для выравнивания заголовка по центру на обоих платформах
  });

  constructor(props) {
    super(props);
    this.state = {
      update: null,
      imageWidth: null,
      imageHeight: IMAGE_HEIGHT,
      webViewWidth: screenWidth - styleConst.ui.verticalGap,
    };
  }

  componentDidMount() {
    const {navigation, actionFetchDealer} = this.props;
    const dealerBaseData = get(navigation, 'state.params.dealerBaseData');

    actionFetchDealer(dealerBaseData);
  }

  onLayoutImage = e => {
    const {
      width: imageDynamicWidth,
      height: imageDynamicHeight,
    } = e.nativeEvent.layout;

    this.setState({
      imageHeight: imageDynamicHeight,
      imageWidth: imageDynamicWidth,
    });
  };

  onLayoutWebView = e => {
    const {width: webViewWidth} = e.nativeEvent.layout;

    this.setState({webViewWidth});
  };

  // shouldComponentUpdate(nextProps) {
  //   const nav = nextProps.nav.newState;
  //   const isActiveScreen = nav.routes[nav.index].routeName === 'AboutDealerScreen';

  //   return this.props.dealer.id !== nextProps.dealer.id && isActiveScreen;
  // }

  renderPhones = phones => {
    if (!phones || !phones.length) return null;

    return (
      <View>
        {phones.map(phone => (
          <ListItem key={phone} icon style={styles.listItem}>
            <Body>
              <Text style={styles.leftText}>Телефон</Text>
            </Body>
            <Right>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('tel:' + phone.replace(/[^+\d]+/g, ''));
                }}>
                <Text style={styles.rightText}>{phone}</Text>
              </TouchableOpacity>
            </Right>
          </ListItem>
        ))}
      </View>
    );
  };

  renderEmails = (emails, name) => {
    if (!emails || !emails.length) return null;

    return emails.map(emailAddress => (
      <ListItem
        key={emailAddress}
        icon
        style={styles.listItem}
        onPress={() => {
          Communications.email(
            [emailAddress],
            null,
            null,
            `Из приложения ${
              Platform.OS === 'android' ? 'Android' : 'iOS'
            } Атлант-М, мой автоцентр ${name}`,
            null,
          );
        }}>
        <Body>
          <Text style={styles.leftText}>E-mail</Text>
        </Body>
        <Right>
          <Text style={styles.rightText}>{emailAddress}</Text>
        </Right>
      </ListItem>
    ));
  };

  renderSites = sites => {
    if (!sites || !sites.length) return null;

    return sites.map((site, idx) => {
      return (
        <ListItem
          key={site}
          last={sites.length - 1 === idx}
          icon
          style={styles.listItem}>
          <Body>
            <Text style={styles.leftText}>Веб-сайт</Text>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => Communications.web(site)}>
              <Text style={styles.rightText}>{site}</Text>
            </TouchableOpacity>
          </Right>
        </ListItem>
      );
    });
  };

  render() {
    const {dealer, isFetchingDealer} = this.props;

    console.log('== About Dealer ==');

    if (!dealer || isFetchingDealer) {
      return (
        <SafeAreaView style={styles.safearea}>
          <ActivityIndicator
            color={styleConst.color.blue}
            style={styles.spinner}
          />
        </SafeAreaView>
      );
    }

    const phones = get(dealer, 'phone', []);
    let description = dealer.description;
    const imageUrl = get(dealer, isTablet ? 'img.10000x440' : 'img.10000x300');

    if (description) {
      description = processHtml(description, this.state.webViewWidth);
    }

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            <HeaderSubtitle content={dealer.name} />
            <View ref="imageContainer">
              <ImageBackground
                onLayout={this.onLayoutImage}
                style={[
                  styles.image,
                  {
                    width: this.state.imageWidth,
                    height: this.state.imageHeight,
                  },
                ]}
                source={{uri: imageUrl}}>
                <View style={styles.brandsLine}>
                  {dealer.brands.map(brand => {
                    return (
                      <Imager
                        resizeMode="contain"
                        key={brand.id}
                        style={styles.brand}
                        source={{uri: brand.logo}}
                      />
                    );
                  })}
                </View>
              </ImageBackground>
            </View>

            <List style={[styles.list, styles.listHolding]}>
              <View style={styles.listItemContainer}>
                {dealer.city ? (
                  <ListItem icon style={styles.listItem}>
                    <Body>
                      <Text>Город</Text>
                    </Body>
                    <Right>
                      <Text style={styles.rightText}>{dealer.city.name}</Text>
                    </Right>
                  </ListItem>
                ) : null}
                {dealer.address ? (
                  <ListItem icon style={styles.listItem}>
                    <Body>
                      <Text>Адрес</Text>
                    </Body>
                    <Right>
                      <Text style={styles.rightText}>{dealer.address}</Text>
                    </Right>
                  </ListItem>
                ) : null}
                {this.renderPhones(phones)}
                {this.renderEmails(dealer.email, dealer.name)}
                {this.renderSites(dealer.site)}
              </View>
            </List>

            {description ? (
              <View
                style={styles.descriptionContainer}
                onLayout={this.onLayoutWebView}>
                <WebViewAutoHeight source={{html: description}} />
              </View>
            ) : null}
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AboutDealerScreen);
