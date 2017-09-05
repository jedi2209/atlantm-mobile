import React, { PureComponent } from 'react';
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
import { CachedImage } from 'react-native-cached-image';
import Communications from 'react-native-communications';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import WebViewAutoHeight from '../../../core/components/WebViewAutoHeight';

// helpers
import _ from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import { scale, verticalScale } from '../../../utils/scale';
import styleHeader from '../../../core/components/Header/style';
import processHtml from '../../../utils/process-html';

const { width, height } = Dimensions.get('window');
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
  description: {
    fontSize: 15,
    color: styleConst.color.greyText4,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  image: {
    height: 150,
    width,
    justifyContent: 'flex-end',
  },
  brand: {
    minWidth: 24,
    height: 20,
    marginRight: 4,
  },
  brandsLine: {
    backgroundColor: 'rgba(255,255,255, 0.7)',
    height: 22,
    paddingHorizontal: styleConst.ui.horizontalGap,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  list: {
    backgroundColor: '#fff',
  },
});

const mapStateToProps = ({ dealer }) => {
  return {
    selectedDealer: dealer.selected,
  };
};

class AboutScreen extends PureComponent {
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
      imageWidth: width,
      imageHeight: scale(155),
      webViewWidth: width - styleConst.ui.verticalGap,
    };
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

  shouldComponentUpdate(nextProps) {
    return this.props.selectedDealer.id !== nextProps.selectedDealer.id;
  }

  render() {
    const { selectedDealer } = this.props;
    const phones = _.get(selectedDealer, 'phone', []);
    let description = selectedDealer.description;

    if (description) {
      description = processHtml(description, this.state.webViewWidth, this.state.webViewHeight);
    }

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            <View style={[
              styles.titleContainer,
              Platform.OS === 'android' ? {
                marginTop: 15,
                marginBottom: 10,
                borderBottomWidth: 0,
                backgroundColor: 'transparent',
               } : {},
              ]}>
              <Text style={styles.title}>{selectedDealer.name}</Text>
            </View>
            <CachedImage
              onLayout={this.onLayoutImage}
              style={[
                styles.image,
                {
                  width: this.state.imageWidth,
                  height: this.state.imageHeight,
                },
              ]}
              source={{ uri: selectedDealer.img }}
            >
              <View style={styles.brandsLine}>
                {
                  selectedDealer.brands.map(brand => {
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

            <List style={[styles.list, styles.listHolding]}>
              <View style={styles.listItemContainer}>
              {
                  selectedDealer.city ?
                    (
                      <ListItem
                        icon
                        style={styles.listItem}
                      >
                        <Body>
                          <Text>Город</Text>
                        </Body>
                        <Right>
                          <Text style={styles.rightText}>{selectedDealer.city.name}</Text>
                        </Right>
                      </ListItem>
                    ) : null
                }
                {
                  selectedDealer.address ?
                    (
                      <ListItem
                        icon
                        style={styles.listItem}
                      >
                        <Body>
                          <Text>Адрес</Text>
                        </Body>
                        <Right>
                          <Text style={styles.rightText}>{selectedDealer.address}</Text>
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
                {
                  selectedDealer.email ?
                    (
                      <ListItem
                        icon
                        style={styles.listItem}
                      >
                        <Body>
                          <Text style={styles.leftText}>Email</Text>
                        </Body>
                        <Right>
                          <Text style={styles.rightText}>{selectedDealer.email}</Text>
                        </Right>
                      </ListItem>
                    ) : null
                }
                {
                  selectedDealer.site ?
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
                          onPress={() => Communications.web(selectedDealer.site)}
                        >
                          <Text style={styles.rightText}>{selectedDealer.site}</Text>
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
