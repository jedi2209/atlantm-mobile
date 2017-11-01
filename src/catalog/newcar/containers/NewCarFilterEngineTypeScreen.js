import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Body,
  Label,
  Content,
  CheckBox,
  ListItem,
  Container,
  StyleProvider,
} from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionSelectNewCarFilterEngineType } from '../../actions';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// styles
import styleListProfile from '../../../core/components/Lists/style';

// helpers
import { get } from 'lodash';
import PropTypes from 'prop-types';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
});

const mapStateToProps = ({ catalog, nav }) => {
  return {
    nav,
    filterEngineType: catalog.newCar.filterEngineType,
    filterData: catalog.newCar.filterData,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionSelectNewCarFilterEngineType,
  }, dispatch);
};

class NewCarFilterGearboxScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Тип двигателя',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    navigation: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.filterEngineType.length !== nextProps.filterEngineType.length;
  }

  onPressItem = (selectedEngineType) => {
    const { filterEngineType } = this.props;
    let newEngineType = [];

    if (this.isEngineTypeSelected(selectedEngineType)) {
      newEngineType = filterEngineType.filter(engineType => engineType !== selectedEngineType);
    } else {
      newEngineType = [].concat(filterEngineType, selectedEngineType);
    }

    this.props.actionSelectNewCarFilterEngineType(newEngineType);
  }

  isEngineTypeSelected = engineTypeId => this.props.filterEngineType.includes(engineTypeId)

  render() {
    const {
      filterData,
      filterEngineType,
    } = this.props;

    if (!filterData) return null;

    console.log('== NewCarFilterGearboxScreen ==');

    const engineType = get(filterData, 'data.enginetype');

    const engineTypeKeys = Object.keys(engineType);

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
            {
              engineTypeKeys.map((engineTypeId, idx) => {
                const item = engineType[engineTypeId];

                return (
                  <View key={engineTypeId} style={styleListProfile.listItemContainer}>
                    <ListItem
                      last={(engineTypeKeys.length - 1) === idx}
                      icon
                      style={styleListProfile.listItemPressable}
                      onPress={() => this.onPressItem(engineTypeId)}
                    >
                      <CheckBox checked={this.isEngineTypeSelected(engineTypeId)} />
                      <Body style={styleListProfile.bodyWithLeftGap} >
                        <Label style={styleListProfile.label}>{item}</Label>
                      </Body>
                    </ListItem>
                  </View>
                );
              })
            }
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCarFilterGearboxScreen);
