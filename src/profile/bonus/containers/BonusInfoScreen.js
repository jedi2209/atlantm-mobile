import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View, Dimensions} from 'react-native';
import {Content, StyleProvider} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionFetchBonusInfo} from '@profile/actions';

// components
import SpinnerView from '@core/components/SpinnerView';
import HeaderIconBack from '@core/components/HeaderIconBack/HeaderIconBack';
import WebViewAutoHeight from '@core/components/WebViewAutoHeight';

// helpers
import {get} from 'lodash';
import styleConst from '@core/style-const';
import processHtml from '@utils/process-html';
import Amplitude from '@utils/amplitude-analytics';
import stylesHeader from '@core/components/Header/style';
import getTheme from '../../../../native-base-theme/components';

const {width: screenWidth} = Dimensions.get('window');

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  webviewContainer: {
    flex: 1,
    paddingBottom: styleConst.ui.verticalGap - 5,
    paddingHorizontal: styleConst.ui.horizontalGap + 5,
  },
});

const mapStateToProps = ({profile, dealer, nav}) => {
  return {
    nav,
    bonusInfo: profile.bonus.info,
    isFetchBonusInfo: profile.bonus.isFetchBonusInfo,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  actionFetchBonusInfo,
};

class BonusInfoScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'бонусная программа',
      headerStyle: stylesHeader.blueHeader,
      headerTitleStyle: stylesHeader.blueHeaderTitle,
      headerLeft: (
        <HeaderIconBack
          theme="white"
          navigation={navigation}
          returnScreen="MenuScreen"
        />
      ),
      headerRight: <View />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      webViewWidth: screenWidth - styleConst.ui.verticalGap,
    };
  }

  componentDidMount() {
    const {
      navigation,
      bonusInfo,
      actionFetchBonusInfo,
      dealerSelected,
    } = this.props;
    const {region} = dealerSelected;

    const refererScreen = get(navigation, 'state.params.refererScreen');

    Amplitude.logEvent('screen', `${refererScreen}/bonus_info`, {region});

    if (!bonusInfo) {
      actionFetchBonusInfo({
        region,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen =
          get(rootLevel, `routes[${rootLevel.index}].routeName`) ===
          'BonusInfoScreen';
      }
    }

    return isActiveScreen;
  }

  onLayoutWebView = e => {
    const {width: webViewWidth} = e.nativeEvent.layout;

    this.setState({webViewWidth});
  };

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    console.log('== BonusInfoScreen ==');

    let {bonusInfo, isFetchBonusInfo} = this.props;

    if (isFetchBonusInfo) {
      return <SpinnerView />;
    }

    if (bonusInfo) {
      bonusInfo = processHtml(bonusInfo, this.state.webViewWidth);
    }

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            {bonusInfo ? (
              <View
                style={styles.webviewContainer}
                onLayout={this.onLayoutWebView}>
                <WebViewAutoHeight source={{html: bonusInfo}} />
              </View>
            ) : null}
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BonusInfoScreen);
