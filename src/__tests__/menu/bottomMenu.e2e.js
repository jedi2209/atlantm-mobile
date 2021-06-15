import {initApp, launchApp} from '../init/init.app.spec';
import ru from '../../core/lang/ru';

describe('Bottom Menu', () => {
	beforeAll(async () => {
		await launchApp();
	});

	initApp();

	describe('Bottom Menu Test', () => {
        it('Bottom NewCars tab should open', async () => {
            await element(by.id('BottomMenu.NewCars')).tap();
			await expect(element(by.id('NewCarsListSreen.Wrapper'))).toExist();
            await element(by.id('HeaderIconBack.Button')).tap();
		});

        it('Bottom Orders tab should open', async () => {
            await element(by.id('BottomMenu.Orders')).tap();
			await expect(element(by.text(ru.Base.cancel.toLowerCase()))).toExist();
            await element(by.text(ru.Base.cancel.toLowerCase())).tap();
		});

        it('Bottom Profile tab should open', async () => {
            await element(by.id('BottomMenu.Profile')).tap();
			await expect(element(by.id('LoginScreen.Wrapper'))).toExist();
		});

        it('Bottom Menu tab should open', async () => {
            await element(by.id('BottomMenu.Menu')).tap();
			await expect(element(by.id('MenuScreen.Wrapper'))).toExist();
		});

		it('Bottom home tab should open', async () => {
            await element(by.id('BottomMenu.Home')).tap();
			await expect(element(by.id('ContactsScreen.Wrapper'))).toExist();
		});
	});
});