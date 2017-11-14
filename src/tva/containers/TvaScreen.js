import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Alert, StyleSheet } from 'react-native';
import {
  Body,
  Label,
  Item,
  Input,
  Content,
  ListItem,
  Container,
  StyleProvider,
} from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionFetchTva, carNumberFill } from '../actions';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import ListItemHeader from '../../profile/components/ListItemHeader';
import DealerItemList from '../../core/components/DealerItemList';
import FooterButton from '../../core/components/FooterButton';

// styles
import styleListProfile from '../../core/components/Lists/style';

// helpers
import { get } from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';
import { TVA__SUCCESS, TVA__FAIL } from '../actionTypes';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
    paddingBottom: 100,
  },
});

const mapStateToProps = ({ dealer, nav, tva }) => {
  return {
    nav,
    carNumber: tva.carNumber,
    isTvaRequest: tva.meta.isRequest,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    carNumberFill,
    actionFetchTva,
  }, dispatch);
};

class TvaScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Табло выдачи авто',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <View />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    isTvaRequest: PropTypes.bool,
    actionFetchTva: PropTypes.func,
    carNumberFill: PropTypes.func,
    carNumber: PropTypes.string,
  }

  shouldComponentUpdate(nextProps) {
    const { dealerSelected, isTvaRequest, carNumber } = this.props;
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'TvaScreen';
      }
    }

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      (isTvaRequest !== nextProps.isTvaRequest && isActiveScreen) ||
      (carNumber !== nextProps.carNumber && isActiveScreen);
  }

  onPressButton = () => {
    const { dealerSelected, actionFetchTva, carNumber, navigation } = this.props;

    actionFetchTva({
      number: carNumber,
      dealer: dealerSelected.id,
      region: dealerSelected.region,
    }).then(action => {
      if (action.type === TVA__SUCCESS) {
        console.log('action.payload', action.payload);
        // navigation.navigate('TvaSearchResultsScreen');
      }

      if (action.type === TVA__FAIL) {
        setTimeout(() => Alert.alert('', `${action.payload.message}. Возможно вы указали неправильный номер или автоцентр`), 100);
      }
    });
  }

  onChangeCarNumber = (value) => this.props.carNumberFill(value);

  renderListItem = () => {
    const { carNumber } = this.props;

    return (
      <View style={styleListProfile.listItemContainer}>
        <ListItem style={styleListProfile.listItem} >
          <Body>
            <Item style={styleListProfile.inputItem} fixedLabel>
              <Label style={styleListProfile.label}>Гос. номер</Label>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Поле для заполнения"
                onChangeText={this.onChangeCarNumber}
                value={carNumber}
                returnKeyType="done"
                returnKeyLabel="Готово"
                underlineColorAndroid="transparent"
              />
            </Item>
          </Body>
        </ListItem>
      </View>
    );
  }

  render() {
    const { navigation, dealerSelected, isTvaRequest } = this.props;

    console.log('== TvaScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>

            <Spinner visible={isTvaRequest} color={styleConst.color.blue} />

            <DealerItemList
              navigation={navigation}
              city={dealerSelected.city}
              name={dealerSelected.name}
              brands={dealerSelected.brands}
              returnScreen="Tva2Screen"
            />

            <ListItemHeader text="АВТОМОБИЛЬ" />

            {this.renderListItem()}
          </Content>
          <FooterButton
            text="ПРОВЕРИТЬ"
            arrow={true}
            onPressButton={this.onPressButton}
          />
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TvaScreen);
