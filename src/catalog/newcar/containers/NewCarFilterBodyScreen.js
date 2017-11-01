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
import { actionSelectNewCarFilterBody } from '../../actions';

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
    filterBody: catalog.newCar.filterBody,
    filterData: catalog.newCar.filterData,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionSelectNewCarFilterBody,
  }, dispatch);
};

class NewCarFilterBodyScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Тип кузова',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    navigation: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.filterBody.length !== nextProps.filterBody.length;
  }

  onPressItem = (selectedBody) => {
    const { filterBody } = this.props;
    let newBody = [];

    if (this.isBodySelected(selectedBody)) {
      newBody = filterBody.filter(body => body !== selectedBody);
    } else {
      newBody = [].concat(filterBody, selectedBody);
    }

    this.props.actionSelectNewCarFilterBody(newBody);
  }

  isBodySelected = bodyId => this.props.filterBody.includes(bodyId)

  render() {
    const {
      filterData,
      filterBody,
    } = this.props;

    if (!filterData) return null;

    console.log('== NewCarFilterBodyScreen ==');

    const body = get(filterData, 'data.body');

    const bodyKeys = Object.keys(body);

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
            {
              bodyKeys.map((bodyId, idx) => {
                const item = body[bodyId];

                return (
                  <View key={bodyId} style={styleListProfile.listItemContainer}>
                    <ListItem
                      last={(bodyKeys.length - 1) === idx}
                      icon
                      style={styleListProfile.listItemPressable}
                      onPress={() => this.onPressItem(bodyId)}
                    >
                      <CheckBox checked={this.isBodySelected(bodyId)} />
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

export default connect(mapStateToProps, mapDispatchToProps)(NewCarFilterBodyScreen);
