import {initApp, launchApp} from '../init/init.app.spec';
import ru from '../../core/lang/ru';

describe('Map Screen', () => {
	beforeAll(async () => {
		await launchApp();
	});

	initApp();

	describe('Map Test', () => {
		it('Map should open', async () => {
            await element(by.id('ContactsScreen.PressMap')).tap();
			await expect(element(by.id('MapScreen.MapView'))).toBeVisible();
		});

		it('Submenu with route navigation correct open', async () => {
            await expect(element(by.id('MapScreen.makeRouteButton'))).toExist();
            await element(by.id('MapScreen.makeRouteButton')).tap();
			await expect(element(by.text(ru.MapScreen.chooseApp))).toExist();
		});
	});
});