import React from 'react';
import {Button, View} from 'native-base';
import {Icon} from 'react-native-paper';

import TransitionView from '../TransitionView';

import {strings} from '../../lang/const';
import styleConst from '../../style-const';

export const SubmitButton = ({
  onPress = () => {},
  sending = false,
  sendingStatus = null,
  children,
}) => {
  if (sendingStatus) {
    return (
      <TransitionView animation={'slideInLeft'} duration={300} index={1}>
        <View alignItems={'center'} mt={4} h={40}>
          <Icon
            source={
              sendingStatus ? 'check-circle-outline' : 'close-circle-outline'
            }
            color={
              sendingStatus ? styleConst.color.green : styleConst.color.red
            }
            size={34}
          />
        </View>
      </TransitionView>
    );
  }

  return (
    <TransitionView animation={'slideInUp'} duration={300} index={1}>
      <View h={40}>
        <Button
          onPress={onPress}
          color="blue.500"
          size="lg"
          shadow={2}
          mt={4}
          spinnerPlacement="start"
          isLoading={sending}
          isLoadingText={strings.Form.button.sending}
          variant="solid"
          testID="Form.ButtonSubmit"
          accessibilityValue={{
            text: 'false',
          }}
          _text={{color: styleConst.color.white, fontSize: 16}}>
          {strings.ProfileSettingsScreen.save}
        </Button>
        {children}
      </View>
    </TransitionView>
  );
};
