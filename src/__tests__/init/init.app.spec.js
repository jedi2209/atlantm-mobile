import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shiped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});

export const initApp = (dealer = 129, fisrtInit = false) => {
  return describe('Init APP', () => {
    it('Choose Dealer Button Exist', async () => {
      await expect(element(by.id('IntroChooseDealerButton'))).toBeVisible();
      await element(by.id('IntroChooseDealerButton')).tap();
    });

    it('All Countries should be loaded', async () => {
      await expect(element(by.text('🇧🇾 Беларусь'))).toExist();
      await expect(element(by.text('🇷🇺 Россия'))).toExist();
      await expect(element(by.text('🇺🇦 Україна'))).toExist();
    });

    if (fisrtInit) {
      it('Tabs must be successfully clicked', async () => {
        await element(by.text('🇷🇺 Россия')).tap();
        await expect(element(by.text('Атлант-М Бажова'))).toBeVisible();
        await element(by.text('🇺🇦 Україна')).tap();
        await expect(element(by.text('Атлант-М Київ'))).toBeVisible();
        await element(by.text('🇧🇾 Беларусь')).tap();
        await expect(
          element(by.text('Атлант-М на Независимости')),
        ).toBeVisible();
      });
    }

    it('Dealer successfull choose', async () => {
      await element(by.id('DealerCard_' + dealer)).tap();
      await expect(
        element(by.id('ContactsScreen.currentActionsHeading')),
      ).toBeVisible();
    });
  });
};

export const launchApp = params => {
  return device.launchApp({
    permissions: {
      notifications: 'YES',
    },
  });
};
