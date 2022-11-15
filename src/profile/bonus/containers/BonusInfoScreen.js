import React, {Component} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {View, ScrollView} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionFetchBonusInfo} from '../../actions';

// components
import SpinnerView from '../../../core/components/SpinnerView';
import WebViewAutoHeight from '../../../core/components/WebViewAutoHeight';

// helpers
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import Analytics from '../../../utils/amplitude-analytics';

const {width: screenWidth} = Dimensions.get('window');

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  spinner: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    paddingHorizontal: '2%',
    paddingBottom: styleConst.ui.verticalGap - 5,
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
  constructor(props) {
    super(props);
    this.state = {
      webViewWidth: screenWidth - styleConst.ui.verticalGap,
    };
  }

  componentDidMount() {
    const {navigation, bonusInfo, actionFetchBonusInfo, dealerSelected} =
      this.props;
    const {region, id} = dealerSelected;

    let refererScreen = get(this.props.route, 'params.refererScreen', null);
    if (!refererScreen) {
      refererScreen = get(this.props.route, 'params.returnScreen', null);
    }

    Analytics.logEvent('screen', `${refererScreen}/bonus_info`, {
      region,
      dealer: id,
    });
    actionFetchBonusInfo({region, dealerID: id});
  }

  onLayoutWebView = e => {
    const {width: webViewWidth} = e.nativeEvent.layout;

    this.setState({webViewWidth});
  };

  render() {
    let {bonusInfo, isFetchBonusInfo} = this.props;

    if (isFetchBonusInfo) {
      return <SpinnerView style={styles.spinner} />;
    }

    return (
      <ScrollView style={styles.safearea}>
        {bonusInfo ? (
          <View style={styles.webviewContainer} onLayout={this.onLayoutWebView}>
            <WebViewAutoHeight source={{html: bonusInfo}} />
          </View>
        ) : (
          <SpinnerView />
        )}
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BonusInfoScreen);
