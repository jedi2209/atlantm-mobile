import React, {useEffect, useState} from 'react';
import {Platform, Linking} from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

import Analytics from '../../utils/amplitude-analytics';
import {strings} from '../lang/const';
import styleConst from '../style-const';
import {STORE_LINK} from '../const';
// import * as StoreReview from 'react-native-store-review';
// import {GooglePackageName} from '../../core/const';
// import Rate, {AndroidMarket} from 'react-native-rate';
import InAppReview from 'react-native-in-app-review';

const rateInApp = onSuccess => {
  if (!InAppReview.isAvailable()) {
    Linking.openURL(STORE_LINK[Platform.OS]);
    onSuccess && onSuccess();
    return;
  }
  InAppReview.RequestInAppReview()
  .then((hasFlowFinishedSuccessfully) => {
      if (!hasFlowFinishedSuccessfully) {
        Linking.openURL(STORE_LINK[Platform.OS]);
      }
      onSuccess && onSuccess();
  })
  .catch((error) => {
      console.log('InAppReview.RequestInAppReview ERROR', error);
  });
};

const RateThisApp = ({onSuccess, navigation, source = 'mainScreen'}) => {
  const [visible, setVisible] = useState(true);

  const hideDialog = () => setVisible(false);

  useEffect(() => {
    visible && Analytics.logEvent('screen', 'ratePopup', {source});
  }, [visible, source]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Icon icon="message-draw" />
        <Dialog.Title>{strings.RateThisApp.title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{strings.RateThisApp.text}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor={styleConst.color.red} onPress={() => {
            navigation.navigate('FeedbackScreen');
            onSuccess && onSuccess();
          }}>{strings.RateThisApp.no}</Button>
          <Button onPress={hideDialog} textColor={styleConst.color.darkBg}>{strings.Notifications.UpdatePopup.later}</Button>
          <Button mode="contained" onPress={() => rateInApp(onSuccess)}>{strings.RateThisApp.rate}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default RateThisApp;
