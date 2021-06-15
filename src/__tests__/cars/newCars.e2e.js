import {initApp, launchApp} from '../init/init.app.spec';
import ru from '../../core/lang/ru';

const targetCarNumber = 2;

const carListItem = 'CarListItem.Wrapper';

const wrappers = {
	carListNew: 'NewCarsListSreen.Wrapper',
	carList: 'CarList.Wrapper',
	carItem: 'NewCarItemScreen.Wrapper',
	carItemBadges: 'NewCarItemScreen.BadgesWrapper',
	carItemPlates: 'NewCarItemScreen.PlatesWrapper',
	carItemTech: 'NewCarItemScreen.TechWrapper',
	carItemComplectation: 'NewCarItemScreen.ComplectationWrapper',
	carItemAccordionTitle: 'NewCarItemScreen.AccordionTitle_',
};

const carItemPlates = {
	complectation: 'NewCarItemScreen.Plates.Complectation',
	engine: 'NewCarItemScreen.Plates.Engine',
	gearbox: 'NewCarItemScreen.Plates.Gearbox',
	wheel: 'NewCarItemScreen.Plates.Wheel',
	color: 'NewCarItemScreen.Plates.Color',
};

const accordionTabs = [
	wrappers.carItemAccordionTitle + ru.NewCarItemScreen.tech.title,
	wrappers.carItemAccordionTitle + ru.NewCarItemScreen.complectation.title
];

const pageSize = 20;

describe('New Cars', () => {
	beforeAll(async () => {
		await launchApp();
	});

	initApp();

	describe('List', () => {
        it('New cars List', async () => {
            await element(by.id('BottomMenu.NewCars')).tap();
			await expect(element(by.id(wrappers.carListNew))).toExist();
		});

        it('New car list should scroll and loaded next (second) page', async () => {
			await element(by.id(wrappers.carList)).scrollTo('bottom');
			await expect(element(by.label(carListItem)).atIndex(pageSize + 5)).toExist();
		});

        it('Item car number '+ targetCarNumber + ' in list should be exist and clickable', async () => {
			await element(by.id(wrappers.carList)).scrollTo('top');
			await element(by.label(carListItem)).atIndex(targetCarNumber).tap();
		});
	});

	describe('Item Screen', () => {
		it('Item car should be exist', async () => {
			await expect(element(by.id(wrappers.carItem))).toExist();
		});

		it('Item car badges should be exist', async () => {
			await expect(element(by.id(wrappers.carItemBadges))).toExist();
		});
	});

	describe('Item Screen Plates', () => {
		it('Item car plates should be exist', async () => {
			await expect(element(by.id(wrappers.carItemPlates))).toExist();
		});

		it('Complectation plate should be exist', async () => {
			await expect(element(by.id(carItemPlates.complectation))).toExist();
		});

		it('Engine plate should be exist', async () => {
			await expect(element(by.id(carItemPlates.engine))).toExist();
		});

		it('Gearbox plate should be exist', async () => {
			await expect(element(by.id(carItemPlates.gearbox))).toExist();
		});

		it('Wheel plate should be exist', async () => {
			await expect(element(by.id(carItemPlates.wheel))).toExist();
		});
	});

	describe('Accordion must be exist and clicked', () => {
		it('Accordion tab "' + ru.NewCarItemScreen.tech.title + '" should be exist', async () => {
			await expect(element(by.id(accordionTabs[0]))).toExist();
		});
		it('Accordion tab "' + ru.NewCarItemScreen.complectation.title + '" should be exist', async () => {
			await expect(element(by.id(accordionTabs[1]))).toExist();
		});

		it('Accordion tab "' + ru.NewCarItemScreen.tech.title + '" should be clicked', async () => {
			await expect(element(by.id(accordionTabs[0]))).toBeVisible();
			await element(by.id(accordionTabs[0])).tap();
		});

		it('Accordion tab "' + ru.NewCarItemScreen.complectation.title + '" should be clicked', async () => {
			await expect(element(by.id(accordionTabs[1]))).toBeVisible();
			await element(by.id(accordionTabs[1])).tap();
		});

		it('Accordion tab "' + ru.NewCarItemScreen.tech.title + '" should be visible', async () => {
			await element(by.id(accordionTabs[1])).tap();
			await expect(element(by.id(accordionTabs[0]))).toBeVisible();
		});
	});
});