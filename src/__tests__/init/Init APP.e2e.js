import {initApp} from './init.app.spec';

describe('App should correct Start', () => {
	beforeAll(async () => {
		await device.launchApp({
			permissions: {
				notifications: 'YES'
			}
		});
	});

	initApp(112, true);
});