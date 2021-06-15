import {initApp} from './init.app.spec';

describe('APP init', () => {
	beforeAll(async () => {
		await device.launchApp({
			permissions: {
				notifications: 'YES'
			}
		});
	});

	initApp(112, true);
});