import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
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

const mapStateToProps = ({profile, dealer}) => {
  return {
    bonusInfo: profile.bonus.info,
    isFetchBonusInfo: profile.bonus.isFetchBonusInfo,
    region: dealer.region,
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
    region,
    submitButton = {
      text: strings.ModalView.close,
    },
  } = props;

  useEffect(() => {
    let refererScreen = get(route, 'params.refererScreen', null);
    if (!refererScreen) {
      refererScreen = get(route, 'params.returnScreen', null);
    }

    Analytics.logEvent('screen', `${refererScreen}/bonus_info`, {
      region,
    });
    actionFetchBonusInfo({region});
  }, []);

  if (isFetchBonusInfo) {
    return (
      <>
        <View style={[styles.safearea, {backgroundColor: styleConst.color.white}]}>
          <LogoLoader />
        </View>
        <Button style={styles.submitButton} onPress={() => navigation.goBack()}>
          {submitButton.text}
        </Button>
      </>
    );
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
              dataDetectorTypes={['link', 'address']}
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

export default connect(mapStateToProps, mapDispatchToProps)(BonusInfoScreen);
