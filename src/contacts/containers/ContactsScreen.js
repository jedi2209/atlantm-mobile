import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container,
  Content,
  Text,
  StyleProvider,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
} from 'native-base';
import _ from 'lodash';
import Communications from 'react-native-communications';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import { verticalScale } from '../../utils/scale';
import styleHeader from '../../core/components/Header/style';

const iconSize = 28;
const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
  iconArrow: {
    color: styleConst.color.systemGray,
  },
  listItem: {
    minHeight: 44,
  },
  list: {
    marginTop: verticalScale(28),
  },
  listHolding: {
    marginTop: verticalScale(35),
  },
  listItemContainer: {
    backgroundColor: '#fff',
    borderTopWidth: styleConst.ui.borderWidth,
    borderTopColor: styleConst.color.border,
  },
  icon: {
    width: iconSize,
    height: iconSize,
  },
});

const mapStateToProps = ({ dealer }) => {
  return {
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({

  }, dispatch);
};

class ContactsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Контакты',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: null,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  render() {
    const {
      dealerSelected,
      navigation,
    } = this.props;
    const phones = _.get(dealerSelected, 'phone', []);

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            <DealerItemList
              navigation={navigation}
              city={dealerSelected.city}
              name={dealerSelected.name}
              brands={dealerSelected.brand}
            />

            <List style={styles.list}>
              <View style={styles.listItemContainer}>
                <ListItem
                  icon
                  style={styles.listItem}
                  onPress={() => {
                    navigation.navigate('AboutScreen');
                  }}
                >
                  <Left>
                    <Image
                      style={styles.icon}
                      source={require('../assets/about_dealer.png')}
                    />
                  </Left>
                  <Body>
                    <Text style={styles.text}>Об автоцентре</Text>
                  </Body>
                  <Right>
                    <Icon
                      name="arrow-forward"
                      style={styles.iconArrow}
                    />
                  </Right>
                </ListItem>

                {
                  phones.length !== 0 ?
                    (
                      <ListItem
                        icon
                        style={styles.listItem}
                        onPress={() => {
                          Communications.phonecall(phones[0], true);
                        }}
                      >
                        <Left>
                          <Image
                            style={styles.icon}
                            source={require('../assets/call.png')}
                          />
                        </Left>
                        <Body>
                          <Text>Позвонить нам</Text>
                        </Body>
                      </ListItem>
                    ) : null
                }

                {
                  dealerSelected.email ?
                    (
                      <ListItem
                        icon
                        style={styles.listItem}
                        onPress={() => {
                          Alert.alert('пишем');
                        }}
                      >
                        <Left>
                          <Image
                            style={styles.icon}
                            source={require('../assets/feedback.png')}
                          />
                        </Left>
                        <Body>
                          <Text>Написать нам</Text>
                        </Body>
                      </ListItem>
                    ) : null
                }

                {
                  _.get(dealerSelected, 'coords.lat') && _.get(dealerSelected, 'coords.lon') ?
                    (
                      <ListItem
                        icon
                        style={styles.listItem}
                        onPress={() => {
                          navigation.navigate('AboutScreen');
                        }}
                      >
                        <Left>
                          <Image
                            style={styles.icon}
                            source={require('../assets/map.png')}
                          />
                        </Left>
                        <Body>
                          <Text>Найти нас</Text>
                        </Body>
                        <Right>
                          <Icon
                            name="arrow-forward"
                            style={styles.iconArrow}
                          />
                        </Right>
                      </ListItem>
                    ) : null
                }

                <ListItem
                  icon
                  style={styles.listItem}
                  onPress={() => {
                    Alert.alert('Запрашиваем звонок');
                  }}
                >
                  <Left>
                    <Image
                      style={styles.icon}
                      source={require('../assets/call_me.png')}
                    />
                  </Left>
                  <Body>
                    <Text>Позвонить мне</Text>
                  </Body>
                </ListItem>

                <ListItem
                  last
                  icon
                  style={styles.listItem}
                  onPress={() => {
                    navigation.navigate('ReferenceScreen');
                  }}
                >
                  <Left>
                    <Image
                      style={styles.icon}
                      source={require('../assets/reference.png')}
                    />
                  </Left>
                  <Body>
                    <Text>Справочная</Text>
                  </Body>
                  <Right>
                    <Icon
                      name="arrow-forward"
                      style={styles.iconArrow}
                    />
                  </Right>
                </ListItem>
              </View>
            </List>

            <List style={[styles.list, styles.listHolding]}>
              <View style={styles.listItemContainer}>
                <ListItem
                  last
                  icon
                  style={styles.listItem}
                  onPress={() => {
                    navigation.navigate('AboutHoldingScreen');
                  }}
                >
                  <Left>
                    <Image
                      style={styles.icon}
                      source={require('../assets/about_holding.png')}
                    />
                  </Left>
                  <Body>
                    <Text>О холдинге Атлант-М</Text>
                  </Body>
                  <Right>
                    <Icon
                      name="arrow-forward"
                      style={styles.iconArrow}
                    />
                  </Right>
                </ListItem>
              </View>
            </List>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);
