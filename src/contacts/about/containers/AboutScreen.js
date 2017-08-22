import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
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
import _ from 'lodash';
import { CachedImage } from 'react-native-cached-image';
// import HTMLView from 'react-native-htmlview';

import Communications from 'react-native-communications';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import { verticalScale } from '../../../utils/scale';
import styleHeader from '../../../core/components/Header/style';

const { width } = Dimensions.get('window');
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
    // justifyContent: 'center',
    flexDirection: 'row',
  },
  list: {
    backgroundColor: '#fff',
  },
});

const textStyles = StyleSheet.create({
  p: {
    fontFamily: styleConst.font.regular,
    fontSize: 15,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  li: {
    fontFamily: styleConst.font.regular,
    fontSize: 15,
    letterSpacing: styleConst.ui.letterSpacing,
  },
});

const mapStateToProps = ({ dealer }) => {
  return {
    selectedDealer: dealer.selected,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({

  }, dispatch);
};

class AboutScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Об автоцентре',
    headerStyle: [styleHeader.common, { borderBottomWidth: 0 }],
    headerTitleStyle: styleHeader.title,
    headerTruncatedBackTitle: 'Return',
    headerLeft: <HeaderIconBack navigation={navigation} />,
  })

  processText(text) {
    if (!text) return null;
    return text.replace(/\r\n/g, '');
  }

  render() {
    const { selectedDealer } = this.props;
    const phones = _.get(selectedDealer, 'phone', []);

    // selectedDealer.description = 'Компания «Атлант-М Балтика» является петербургским отделением международного холдинга \"Атлант-М\" - одной из крупнейших компаний в СНГ, специализирующейся на продаже, гарантийном и сервисном обслуживании автомобилей различных марок, а также на продаже запасных частей.';

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{selectedDealer.name}</Text>
            </View>
            <CachedImage
              style={styles.image}
              resizeMode="cover"
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
                          <Text style={styles.rightText}>{selectedDealer.city}</Text>
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
              selectedDealer.description ?
                (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                      {this.processText(selectedDealer.description)}
                    </Text>
                  </View>
                ) : null
            }
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutScreen);
