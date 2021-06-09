describe('App should correct Start', () => {
	beforeAll(async () => {
		await device.launchApp({
			permissions: {
				notifications: 'YES'
			}
		});
	});

	describe('First Init APP', () => {
		it('Choose Dealer Button Exists', async () => {
			await expect(element(by.id("IntroChooseDealerButton"))).toBeVisible();
			await element(by.id("IntroChooseDealerButton")).tap();
		});

		it('All Countries should be loaded', async () => {
			await expect(element(by.text('🇧🇾 Беларусь'))).toExist();
			await expect(element(by.text('🇷🇺 Россия'))).toExist();
			await expect(element(by.text('🇺🇦 Україна'))).toExist();
		});

		it('Tabs must be successfully clicked', async() => {
			await element(by.text('🇷🇺 Россия')).tap();
			await expect(element(by.text("Атлант-М Бажова"))).toBeVisible();
			await element(by.text('🇺🇦 Україна')).tap();
			await expect(element(by.text("Атлант-М Київ"))).toBeVisible();
			await element(by.text('🇧🇾 Беларусь')).tap();
			await expect(element(by.text("Атлант-М на Независимости"))).toBeVisible();
		});

		it('Dealer successfull choose', async() => {
			await element(by.id("DealerCard_129")).tap();
			await expect(element(by.id('ContactsScreen.currentActionsHeading'))).toBeVisible();
		});
	});
});