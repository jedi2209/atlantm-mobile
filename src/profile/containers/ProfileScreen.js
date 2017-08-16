import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container,
  Content,
  Text,
  List,
  ListItem,
  StyleProvider,
  Form,
  Item,
  Input,
  Label,
  Body,
} from 'native-base';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import { scale } from '../../utils/scale';
import styleHeader from '../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
  label: {
    fontSize: 18,
    fontFamily: styleConst.font.regular,
    color: '#000',
  },
  inputItem: {
    borderBottomWidth: 0,
  },
  listItemContainer: {
    backgroundColor: '#fff',
  },
  listItem: {
    paddingRight: 0,
    paddingTop: 0,
  },
  listHeaderContainer: {
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

class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Личный кабинет',
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

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            <List style={styles.list}>
            <View style={styles.listHeaderContainer}>
              <ListItem itemHeader>
                <Text>МОЙ АВТОЦЕНТР</Text>
              </ListItem>
            </View>
              <DealerItemList
                navigation={navigation}
                city={dealerSelected.city}
                name={dealerSelected.name}
                brands={dealerSelected.brand}
              />
              <View style={styles.listHeaderContainer}>
                <ListItem itemHeader>
                  <Text>КОНТАКТНАЯ ИНФОРМАЦИЯ</Text>
                </ListItem>
              </View>

              <View style={styles.listItemContainer}>
                <ListItem style={styles.listItem} >
                  <Body>
                    <Item style={styles.inputItem} fixedLabel>
                      <Label style={styles.label}>ФИО</Label>
                      <Input
                        placeholder="Поле для заполнения"
                      />
                    </Item>
                  </Body>
                </ListItem>
              </View>

              <View style={styles.listItemContainer}>
                <ListItem style={styles.listItem}>
                  <Body>
                    <Item style={styles.inputItem} fixedLabel>
                        <Label style={styles.label}>Телефон</Label>
                        <Input
                          placeholder="Поле для заполнения"
                        />
                      </Item>
                  </Body>
                </ListItem>
              </View>

              <View style={styles.listItemContainer}>
                <ListItem last style={styles.listItem}>
                  <Body>
                    <Item style={styles.inputItem} fixedLabel last>
                      <Label style={styles.label}>Email</Label>
                      <Input
                        placeholder="Поле для заполнения"
                      />
                  </Item>
                  </Body>
                </ListItem>
              </View>
            </List>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
