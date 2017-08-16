import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Container,
  Content,
} from 'native-base';
import CachedImage from 'react-native-cached-image';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchInfoPost } from '../actions';

import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';
import { verticalScale } from '../../utils/scale';
import HTMLView from 'react-native-htmlview';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  textContainer: {
    marginVertical: styleConst.ui.verticalGap,
    marginHorizontal: styleConst.ui.horizontalGap,
  },
  image: {
    width,
    height: 200,
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

const mapStateToProps = ({ info }) => {
  return {
    list: info.list,
    posts: info.posts,
    isFetchInfoPost: info.meta.isFetchInfoPost,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchInfoPost,
  }, dispatch);
};

class InfoPostScreen extends Component {
  static navigationOptions = () => ({
    headerTitle: 'Об акции',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
  })

  componentWillMount() {
    const {
      navigation,
      posts,
      fetchInfoPost,
    } = this.props;

    const id = navigation.state.params.id;
    const post = posts[id];

    if (!post) {
      fetchInfoPost(id);
    }
  }

  processText(text) {
    return text.replace(/\r\n/g, '');
  }

  render() {
    const {
      list,
      posts,
      navigation,
    } = this.props;

    const id = navigation.state.params.id;
    const post = posts[id];

    const currentPostInList = _.find(list, { id });

    return (
      <Container>
        <Content style={styles.content} >
          {
            !post ?
              <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} /> :
              (
                <View>
                  <CachedImage
                    style={styles.image}
                    resizeMode="stretch"
                    source={{ uri: _.get(currentPostInList, 'img') }}
                  />
                  <View style={styles.textContainer}>
                    <HTMLView
                      value={this.processText(post.text)}
                      stylesheet={styles}
                    />
                  </View>
                </View>
              )
          }
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPostScreen);
