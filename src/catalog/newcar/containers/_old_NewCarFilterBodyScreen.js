import React, {Component} from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import {
  Body,
  Label,
  Content,
  CheckBox,
  ListItem,
  StyleProvider,
} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionSelectNewCarFilterBody} from '../../actions';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import {get} from 'lodash';
import PropTypes from 'prop-types';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({catalog, nav}) => {
  return {
    nav,
    filterBody: catalog.newCar.filterBody,
    filterData: catalog.newCar.filterData,
  };
};

const mapDispatchToProps = {
  actionSelectNewCarFilterBody,
};

class NewCarFilterBodyScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Тип кузова',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  });

  static propTypes = {
    navigation: PropTypes.object,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.filterBody.length !== nextProps.filterBody.length;
  }

  onPressItem = (selectedBody) => {
    requestAnimationFrame(() => {
      const {filterBody} = this.props;
      let newBody = [];

      if (this.isBodySelected(selectedBody)) {
        newBody = filterBody.filter((body) => body !== selectedBody);
      } else {
        newBody = [].concat(filterBody, selectedBody);
      }

      this.props.actionSelectNewCarFilterBody(newBody);
    });
  };

  isBodySelected = (bodyId) => this.props.filterBody.includes(bodyId);

  render() {
    const {filterData, filterBody} = this.props;

    if (!filterData) return null;

    console.log('== NewCarFilterBodyScreen ==');

    const body = get(filterData, 'data.body');
    const bodyKeys = Object.keys(body);

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            {bodyKeys.map((bodyId, idx) => {
              const item = body[bodyId];
              const handler = () => this.onPressItem(bodyId);

              return (
                <View key={'oldBody' + bodyId} style={stylesList.listItemContainer}>
                  <ListItem
                    last={bodyKeys.length - 1 === idx}
                    icon
                    style={stylesList.listItemPressable}
                    onPress={handler}>
                    <CheckBox
                      onPress={handler}
                      checked={this.isBodySelected(bodyId)}
                    />
                    <Body style={stylesList.bodyWithLeftGap}>
                      <Label style={stylesList.label}>{item}</Label>
                    </Body>
                  </ListItem>
                </View>
              );
            })}
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewCarFilterBodyScreen);
