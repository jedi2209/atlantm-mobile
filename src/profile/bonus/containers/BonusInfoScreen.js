import React, {useState, useEffect} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {View, ScrollView, Button} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionFetchBonusInfo} from '../../actions';

// components
import LogoLoader from '../../../core/components/LogoLoader';
import WebViewAutoHeight from '../../../core/components/WebViewAutoHeight';

// helpers
import {get} from 'lodash';
import moment from 'moment';
import styleConst from '../../../core/style-const';
import Analytics from '../../../utils/amplitude-analytics';
import {strings} from '../../../core/lang/const';

const {width: screenWidth} = Dimensions.get('window');

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  webviewContainer: {
    flex: 1,
    paddingHorizontal: '1%',
    paddingBottom: styleConst.ui.verticalGap - 5,
    backgroundColor: styleConst.color.bg,
  },
  submitButton: {
    marginBottom: 35,
    marginHorizontal: 10,
  },
  webView: {
    backgroundColor: styleConst.color.bg,
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

const BonusInfoScreen = props => {
  const {
    navigation,
    route,
    bonusInfo,
    isFetchBonusInfo,
    actionFetchBonusInfo,
    dealerSelected,
    submitButton,
  } = props;

  useEffect(() => {
    const {region, id} = dealerSelected;

    let refererScreen = get(route, 'params.refererScreen', null);
    if (!refererScreen) {
      refererScreen = get(route, 'params.returnScreen', null);
    }

    Analytics.logEvent('screen', `${refererScreen}/bonus_info`, {
      region,
      dealer: id,
    });
    actionFetchBonusInfo({region, dealerID: id});
  }, []);

  if (isFetchBonusInfo) {
    return <LogoLoader />;
  }

  return (
    <>
      <ScrollView style={styles.safearea}>
        {bonusInfo ? (
          <View style={styles.webviewContainer}>
            <WebViewAutoHeight
              key={moment().unix()}
              style={[styles.webView, route.params?.webViewStyle]}
              source={{html: bonusInfo}}
            />
          </View>
        ) : (
          <LogoLoader />
        )}
      </ScrollView>
      <Button style={styles.submitButton} onPress={() => navigation.goBack()}>
        {submitButton.text}
      </Button>
    </>
  );
};

BonusInfoScreen.defaultProps = {
  submitButton: {
    text: strings.ModalView.close,
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(BonusInfoScreen);
