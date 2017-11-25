import React, { Component } from 'react';
import { View, Platform, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Content, Text, List, ListItem, Body, Right, StyleProvider } from 'native-base';

// redux
import { connect } from 'react-redux';

// components
import DeviceInfo from 'react-native-device-info';
import Communications from 'react-native-communications';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import WebViewAutoHeight from '../../../core/components/WebViewAutoHeight';
import Imager from '../../../core/components/Imager';
import HeaderSubtitle from '../../../core/components/HeaderSubtitle';

// helpers
import { get } from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import stylesList from '../../../core/components/Lists/style';
import processHtml from '../../../utils/process-html';

const isTablet = DeviceInfo.isTablet();

// image
let IMAGE_HEIGHT_GUARD = 0;

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_WIDTH = isTablet ? null : screenWidth;
const IMAGE_HEIGHT = isTablet ? 220 : 160;

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
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
});

const mapStateToProps = ({ dealer }) => {
  return {
    dealerSelected: dealer.selected,
  };
};

class AboutScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Об автоцентре',
    headerStyle: [stylesHeader.common, { borderBottomWidth: 0 }],
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />, // для выравнивания заголовка по центру на обоих платформах
  })

  constructor(props) {
    super(props);
    this.state = {
      update: null,
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

  renderPhones = (phones) => {
    if (!phones || !phones.length) return null;

    return phones.map(phone => {
      const onPress = () => Communications.phonecall(phone, true);
      return this.renderItem('Телефон', phone, false, onPress);
    });
  }

  renderEmails = (emails, name) => {
    if (!emails || !emails.length) return null;

    return emails.map(emailAddress => {
      const onPress = () => {
        Communications.email(
          [emailAddress],
          null,
          null,
          `Из приложения ${Platform.OS === 'android' ? 'Android' : 'iOS'} Атлант-М, мой автоцентр ${name}`,
          null,
        );
      };

      return this.renderItem('E-mail', emailAddress, false, onPress);
    });
  }

  renderSites = (sites) => {
    if (!sites || !sites.length) return null;

    return sites.map((site, idx) => {
      const onPress = () => Communications.web(site);
      const isLast = sites.length - 1 === idx;

      return this.renderItem('Веб-сайт', site, isLast, onPress);
    });
  }

  renderItem = (label, value, isLast, onPressHandler) => {
    return (
      <View key={value} style={stylesList.listItemContainer}>
        <ListItem icon style={stylesList.listItem} last={isLast}>
          <Body>
            <Text>{label}</Text>
          </Body>
          <Right>
            {
              onPressHandler ?
                (
                  <TouchableOpacity onPress={onPressHandler}>
                    <Text style={stylesList.listItemValue}>{value}</Text>
                  </TouchableOpacity>
                ) :
                (
                  <Text style={stylesList.listItemValue}>{value}</Text>
                )
            }
          </Right>
        </ListItem>
      </View>
    );
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
            <HeaderSubtitle content={dealerSelected.name} />
            <View ref="imageContainer">
              <Imager
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
                        <Imager
                          resizeMode="contain"
                          key={brand.id}
                          style={styles.brand}
                          source={{ uri: brand.logo }}
                        />
                      );
                    })
                  }
                </View>
              </Imager>
            </View>

            <List style={[styles.list, styles.listHolding]}>
              {dealerSelected.city ? this.renderItem('Город', dealerSelected.city.name) : null}
              {dealerSelected.address ? this.renderItem('Адрес', dealerSelected.address) : null}
              {this.renderPhones(phones)}
              {this.renderEmails(dealerSelected.email, dealerSelected.name)}
              {this.renderSites(dealerSelected.site)}
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
