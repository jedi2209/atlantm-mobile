import {initApp} from '../init/init.app.spec';
import ru from '../../core/lang/ru';

describe('Map should correct loading', () => {
	beforeAll(async () => {
		await device.launchApp({
			permissions: {
				notifications: 'YES'
			}
		});
	});

	describe('Map Test', () => {
		initApp();

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