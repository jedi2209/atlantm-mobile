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
		describe('Init APP', () => {
			it('Choose Dealer Button Exists', async () => {
				await expect(element(by.id("IntroChooseDealerButton"))).toBeVisible();
				await element(by.id("IntroChooseDealerButton")).tap();
			});
	
			it('All Countries should be loaded', async () => {
				await expect(element(by.text('🇧🇾 Беларусь'))).toExist();
				await expect(element(by.text('🇷🇺 Россия'))).toExist();
				await expect(element(by.text('🇺🇦 Україна'))).toExist();
			});
	
			it('Dealer successfull choose', async() => {
				await element(by.id("DealerCard_129")).tap();
				await expect(element(by.id('ContactsScreen.currentActionsHeading'))).toBeVisible();
			});
		});

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