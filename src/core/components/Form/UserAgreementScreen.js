import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {Button} from 'native-base';
import {connect} from 'react-redux';

import API from '../../../utils/api';
import WebViewAutoHeight from '../WebViewAutoHeight';
import * as NavigationService from '../../../navigation/NavigationService';

import moment from 'moment';
import styleConst from '../../style-const';
import {strings} from '../../lang/const';
import LogoLoader from '../LogoLoader';

const mapStateToProps = ({dealer, profile}) => {
  return {
    region: dealer.selected.region,
  };
};

const UserAgreementScreen = ({region, SubmitButton}) => {
  const [HTML, setHTML] = useState(null);

  useEffect(() => {
    console.info('== UserAgreementScreen ==');
    API.fetchUserAgreement(region).then(res => {
      setHTML(res);
    });
  }, [region]);

  if (HTML) {
    return (
      <>
        <ScrollView style={styles.mainView}>
          <WebViewAutoHeight
            style={styles.webView}
            key={moment().unix()}
            source={{html: HTML}}
          />
        </ScrollView>
        <Button
          style={styles.submitButton}
          onPress={() => NavigationService.goBack()}>
          {SubmitButton.text}
        </Button>
      </>
    );
  } else {
    return <LogoLoader />;
  }
};

UserAgreementScreen.defaultProps = {
  SubmitButton: {
    text: strings.ModalView.close,
  },
};

const styles = StyleSheet.create({
  submitButton: {
    marginBottom: 35,
    marginHorizontal: 10,
  },
  mainView: {
    paddingHorizontal: 10,
    flex: 1,
    paddingBottom: 25,
    backgroundColor: styleConst.color.bg,
  },
  webView: {
    backgroundColor: styleConst.color.bg,
  },
});

export default connect(mapStateToProps)(UserAgreementScreen);
