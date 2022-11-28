import {initApp, launchApp} from '../init/init.app.spec';
import {editInput, editSelect} from '../init/editElement.spec';
import dataConst from '../init/const.spec';
import ru from '../../core/lang/ru';

const targetCarNumber = 2;

const carListItem = 'CarListItem.Wrapper';

const wrappers = {
  carListNew: 'NewCarsListSreen.Wrapper',
  carItem: 'NewCarItemScreen.Wrapper',
  orderScreen: 'OrderScreen.Wrapper',
  orderScreenForm: 'OrderScreen.Form',
};

const buttons = {
  order: 'NewCarItemScreen.Button.Order',
};

describe('Car order', () => {
  beforeAll(async () => {
    await launchApp();
  });

  initApp();

  describe('Car Order screen', () => {
    it('Car Order Screen must be loaded', async () => {
      await element(by.id('BottomMenu.NewCars')).tap();
      await expect(element(by.id(wrappers.carListNew))).toExist();
      await element(by.label(carListItem)).atIndex(targetCarNumber).tap();

      await expect(element(by.id(wrappers.carItem))).toExist();

      await expect(element(by.id(buttons.order))).toExist();
      await element(by.id(buttons.order)).tap();
    });
  });

  describe('Car Order Alert', () => {
    it('Car Order Alert must be loaded', async () => {
      await expect(
        element(
          by.text(ru.NewCarItemScreen.Notifications.buyType.title),
        ).atIndex(0),
      ).toExist();
      await element(by.label(ru.Base.cancel.toLowerCase())).atIndex(0).tap();
    });

    it('Car Order => click to WEB', async () => {
      await element(by.id(buttons.order)).tap();
      await expect(
        element(by.label(ru.NewCarItemScreen.makeOrder)).atIndex(0),
      ).toExist();
      await element(by.label(ru.NewCarItemScreen.makeOrder)).atIndex(0).tap();
    });

    it('Car Order => in-APP order', async () => {
      await device.launchApp({newInstance: false});
      await element(by.id(buttons.order)).tap();
      await expect(
        element(by.label(ru.NewCarItemScreen.sendQuery)).atIndex(0),
      ).toExist();
      await element(by.label(ru.NewCarItemScreen.sendQuery)).atIndex(0).tap();
    });
  });

  describe('Car Order Form', () => {
    it('Car Order Form must be loaded', async () => {
      await expect(element(by.id(wrappers.orderScreenForm))).toExist();
    });

    editSelect('Form.SelectInput.DEALER', 'Атлант-М Уручье');

    editInput('Form.TextInput.NAME', dataConst.user.name);
    editInput('Form.TextInput.SECOND_NAME', dataConst.user.secondName);
    editInput('Form.TextInput.LAST_NAME', dataConst.user.lastName);
    editInput('Form.Phone.PHONE', dataConst.user.phone.by.wrong, false);
    editInput('Form.Email.EMAIL', dataConst.user.email.wrong, true);
    editInput('Form.TextArea.COMMENT', dataConst.user.comment, false);

    it('Car Order Form Button must be hidden', async () => {
      await expect(element(by.id(dataConst.form.buttonSubmit))).toHaveValue(
        'false',
      );
    });

    editInput('Form.Phone.PHONE', dataConst.user.phone.by.correct, false);
    editInput('Form.Email.EMAIL', dataConst.user.email.correct, false, true);

    it('Car Order Form Button must be showed', async () => {
      await expect(element(by.id(dataConst.form.buttonSubmit))).toBeVisible();
      await waitFor(element(by.id(dataConst.form.buttonSubmit)))
        .toHaveValue('true')
        .withTimeout(1500);
    });
  });
});
