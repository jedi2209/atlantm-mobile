import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import {Content, StyleProvider} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionFetchBonusInfo} from '../../actions';

// components
import SpinnerView from '../../../core/components/SpinnerView';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import WebViewAutoHeight from '../../../core/components/WebViewAutoHeight';

// helpers
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import processHtml from '../../../utils/process-html';
import Amplitude from '../../../utils/amplitude-analytics';
import stylesHeader from '../../../core/components/Header/style';
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
      headerTitle: 'Бонусная программа',
      headerStyle: stylesHeader.whiteHeader,
      headerTitleStyle: stylesHeader.whiteHeaderTitle,
      headerLeft: (
        <HeaderIconBack
          returnScreen={navigation.state.params.returnScreen}
          theme="blue"
          navigation={navigation}
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

  onLayoutWebView = (e) => {
    const {width: webViewWidth} = e.nativeEvent.layout;

    this.setState({webViewWidth});
  };

  render() {
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
          <StatusBar barStyle="dark-content" />
          <Content>
            {bonusInfo ? (
              <View
                style={styles.webviewContainer}
                onLayout={this.onLayoutWebView}>
                <WebViewAutoHeight source={{html: bonusInfo}} />
              </View>
            ) : (
              <SpinnerView />
            )}
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BonusInfoScreen);
