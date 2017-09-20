import React, { Component } from 'react';
import {
  View,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container,
  Content,
  Text,
  List,
  ListItem,
  Body,
  Right,
  StyleProvider,
} from 'native-base';

// redux
import { connect } from 'react-redux';

// components
import DeviceInfo from 'react-native-device-info';
import { CachedImage } from 'react-native-cached-image';
import Communications from 'react-native-communications';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import WebViewAutoHeight from '../../../core/components/WebViewAutoHeight';

// helpers
import { get } from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import { verticalScale } from '../../../utils/scale';
import styleHeader from '../../../core/components/Header/style';
import processHtml from '../../../utils/process-html';

const isTablet = DeviceInfo.isTablet();

// image
let IMAGE_HEIGHT_GUARD = 0;

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_WIDTH = isTablet ? null : screenWidth;
const IMAGE_HEIGHT = isTablet ? 220 : 160;

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
  titleContainer: {
    backgroundColor: styleConst.color.header,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.border,
    marginBottom: 0.3,
    paddingBottom: verticalScale(5),
  },
  title: {
    fontSize: 18,
    color: styleConst.color.greyText4,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
    textAlign: 'center',
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

const mapStateToProps = ({ dealer }) => {
  return {
    dealerSelected: dealer.selected,
  };
};

class AboutScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Об автоцентре',
    headerStyle: [styleHeader.common, { borderBottomWidth: 0 }],
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />, // для выравнивания заголовка по центру на обоих платформах
  })

  constructor(props) {
    super(props);
    this.state = {
      imageWidth: null,
      imageHeight: IMAGE_HEIGHT,
      webViewWidth: screenWidth - styleConst.ui.verticalGap,
    };
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

  // shouldComponentUpdate(nextProps) {
  //   const nav = nextProps.nav.newState;
  //   const isActiveScreen = nav.routes[nav.index].routeName === 'AboutScreen';

  //   return this.props.dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen;
  // }

  renderEmails = (emails, name) => {
    if (!emails) return null;

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
            `Из приложения ${Platform.OS === 'android' ? 'Android' : 'iOS'} Атлант-М, мой автоцентр ${name}`,
            null,
          );
        }}
      >
        <Body>
          <Text style={styles.leftText}>E-mail</Text>
        </Body>
        <Right>
          <Text style={styles.rightText}>{emailAddress}</Text>
        </Right>
      </ListItem>
    ));
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const { dealerSelected } = this.props;
    const phones = get(dealerSelected, 'phone', []);
    let description = dealerSelected.description;
    const imageUrl = get(dealerSelected, isTablet ? 'img.10000x440' : 'img.10000x300');

    if (description) {
      description = processHtml(description, this.state.webViewWidth, this.state.webViewHeight);
    }

    console.log('== About ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
            <View style={[
              styles.titleContainer,
              isAndroid ? {
                marginTop: 15,
                marginBottom: 10,
                borderBottomWidth: 0,
                backgroundColor: 'transparent',
               } : {},
              ]}>
              <Text style={styles.title}>{dealerSelected.name}</Text>
            </View>
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
              >
                <View style={styles.brandsLine}>
                  {
                    dealerSelected.brands.map(brand => {
                      return (
                        <CachedImage
                          resizeMode="contain"
                          key={brand.id}
                          style={styles.brand}
                          source={{ uri: brand.logo }}
                        />
                      );
                    })
                  }
                </View>
              </CachedImage>
            </View>

            <List style={[styles.list, styles.listHolding]}>
              <View style={styles.listItemContainer}>
              {
                  dealerSelected.city ?
                    (
                      <ListItem
                        icon
                        style={styles.listItem}
                      >
                        <Body>
                          <Text>Город</Text>
                        </Body>
                        <Right>
                          <Text style={styles.rightText}>{dealerSelected.city.name}</Text>
                        </Right>
                      </ListItem>
                    ) : null
                }
                {
                  dealerSelected.address ?
                    (
                      <ListItem
                        icon
                        style={styles.listItem}
                      >
                        <Body>
                          <Text>Адрес</Text>
                        </Body>
                        <Right>
                          <Text style={styles.rightText}>{dealerSelected.address}</Text>
                        </Right>
                      </ListItem>
                    ) : null
                }
                {
                  phones.length !== 0 ?
                    (
                      <View>
                        {
                          phones.map(phone => {
                            return (
                              <ListItem
                                key={phone}
                                icon
                                style={styles.listItem}
                              >
                                <Body>
                                  <Text style={styles.leftText}>Телефон</Text>
                                </Body>
                                <Right>
                                  <TouchableOpacity
                                    onPress={() => Communications.phonecall(phone, true)}
                                  >
                                    <Text style={styles.rightText}>{phone}</Text>
                                  </TouchableOpacity>
                                </Right>
                              </ListItem>
                            );
                          })
                        }
                      </View>
                    ) : null
                }
                {this.renderEmails(dealerSelected.email, dealerSelected.name)}
                {
                  dealerSelected.site ?
                    (
                      <ListItem
                        last
                        icon
                        style={styles.listItem}
                      >
                        <Body>
                          <Text style={styles.leftText}>Веб-сайт</Text>
                        </Body>
                        <Right>
                        <TouchableOpacity
                          onPress={() => Communications.web(dealerSelected.site)}
                        >
                          <Text style={styles.rightText}>{dealerSelected.site}</Text>
                        </TouchableOpacity>
                        </Right>
                      </ListItem>
                    ) : null
                }
              </View>
            </List>

            {
              description ?
                (
                  <View
                    style={styles.descriptionContainer}
                    onLayout={this.onLayoutWebView}
                  >
                    <WebViewAutoHeight source={{ html: description }} />
                  </View>
                ) : null
            }
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps)(AboutScreen);
