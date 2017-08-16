import React, { Component } from 'react';
import {
  StyleSheet,
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
  Icon,
} from 'native-base';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';

// actions
import { fetchInfo } from '../actions';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
  icon: {
    // fontSize: 30,
  },
});

const mapStateToProps = ({ dealer, info }) => {
  return {
    dealerSelected: dealer.selected,
    list: info.list,
    visited: info.visited,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchInfo,
  }, dispatch);
};

class InfoListScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Акции',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: null,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object.isRequired,
    list: PropTypes.array.isRequired,
    visited: PropTypes.array.isRequired,
  }

  componentWillMound() {
    const { dealerSelected, list, fetchInfo } = this.props;

    if (!list) {
      fetchInfo({
        region: dealerSelected.country,
        dealer: dealerSelected.id,
      });
    }
  }

  render() {
    const {
      navigation,
      dealerSelected,
      list,
      visited,
    } = this.props;

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

            <List
              key={visited.length}
              style={styles.list}
              dataArray={list}
              renderRow={info => {
                const isVisited = visited.contains(info.id);

                return (
                  <ListItem
                    onPress={() => {
                      navigation.navigate('InfoPostScreen', { infoId: info.id });
                    }}
                    style={styles.listItem}
                  >
                    <Body
                      style={styles.listItemBody}
                    >
                      {info.title ? <Text style={[
                        styles.title,
                        { color: isVisited ? styleConst.color.greyText : '#000' },
                      ]}>{info.title}</Text> : null}
                      {info.date ? <Text style={styles.date}>{info.date}</Text> : null}
                    </Body>
                    <Right>
                      <Icon
                        name="arrow-forward"
                        style={[
                          styles.icon,
                          { color:
                            isVisited ?
                              styleConst.color.systemGrey :
                              styleConst.color.systemBlue,
                          },
                        ]}
                    />
                    </Right>
                  </ListItem>
                );
              }}
            >
            </List>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoListScreen);
