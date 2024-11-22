import React, {useEffect} from 'react';
import {Linking} from 'react-native';
import {connect} from 'react-redux';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

import Analytics from '../../utils/amplitude-analytics';
import {strings} from '../lang/const';
import styleConst from '../style-const';
import {STORE_LINK} from '../const';
// import * as StoreReview from 'react-native-store-review';
import InAppReview from 'react-native-in-app-review';

import {
  actionAppRated,
  actionMenuOpenedCount,
} from '../actions';

const mapStateToProps = ({core, dealer}) => {
  return {
    menuOpenedCount: core.menuOpenedCount,
    isStoreUpdated: core.isStoreUpdated,
    isAppRated: core.isAppRated,
  };
};

const mapDispatchToProps = {
  actionMenuOpenedCount,
  actionAppRated,
};

const openReviewInStore = () => Linking.openURL(STORE_LINK.review);

// const rateInApp = onSuccess => {
//   StoreReview.requestReview();
// };

const rateInApp = onSuccess => {
  if (!InAppReview.isAvailable()) {
    openReviewInStore();
    onSuccess && onSuccess();
    return;
  }
  InAppReview.RequestInAppReview()
  .then((hasFlowFinishedSuccessfully) => {
      if (!hasFlowFinishedSuccessfully) {
        openReviewInStore();
      }
      onSuccess && onSuccess();
      return;
  })
  .catch((error) => {
      console.error('InAppReview.RequestInAppReview ERROR', error);
  });
};

const RateThisApp = props => {
  const {
    actionMenuOpenedCount,
    actionAppRated,
    isAppRated = false,
    menuOpenedCount = 0,
    navigation,
    source = 'mainScreen',
  } = props;
  const visible = !isAppRated && menuOpenedCount >= 10;

  const hideDialog = () => {
    actionAppRated(false);
    actionMenuOpenedCount(0);
  };

  useEffect(() => {
    visible && Analytics.logEvent('screen', 'ratePopup', {source});
  }, [visible, source]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => hideDialog()}>
        <Dialog.Icon icon="message-draw" />
        <Dialog.Title>{strings.RateThisApp.title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{strings.RateThisApp.text}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor={styleConst.color.red} onPress={() => {
            navigation.navigate('FeedbackScreen');
            hideDialog();
          }}>{strings.RateThisApp.no}</Button>
          <Button onPress={() => hideDialog()} textColor={styleConst.color.darkBg}>{strings.Notifications.UpdatePopup.later}</Button>
          <Button onPress={() => rateInApp(hideDialog)} mode="contained">{strings.RateThisApp.rate}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RateThisApp);
