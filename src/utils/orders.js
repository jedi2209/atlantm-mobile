import {Platform} from 'react-native';
import {get} from 'lodash';
import {store} from '../core/store';
import {strings} from '../core/lang/const';

async function getOrders(type = 'default') {
  let storeState = store.getState();
  let tmpArr = [];
  let res = {
    android: {
      BUTTONS: [],
      CANCEL_INDEX: 0,
    },
    ios: {
      BUTTONS: [],
      CANCEL_INDEX: 0,
    },
  };
  let ORDERS = {
    android: {
      TITLE: 'Заявки',
      BUTTONS: [
        {
          priority: 15,
          id: 'cancel',
          text: strings.Base.cancel.toLowerCase(),
          icon: 'ios-close',
          iconColor: '#f70707',
        },
      ],
      CANCEL_INDEX: 0,
    },
    ios: {
      TITLE: 'Заявки',
      BUTTONS: [
        {
          priority: 15,
          id: 'cancel',
          text: strings.Base.cancel.toLowerCase(),
          icon: 'ios-close',
          iconColor: '#f70707',
        },
      ],
      CANCEL_INDEX: 0,
    },
  };
  const divisions = get(storeState, 'dealer.selected.divisionTypes');
  Object.keys(ORDERS[Platform.OS].BUTTONS).map(el => {
    tmpArr.push(ORDERS[Platform.OS].BUTTONS[el].priority);
  });
  if (type === 'car') {
    res.android.BUTTONS.push(
      {
        priority: 6,
        id: 'TOhistory',
        text: strings.UserCars.menu.history,
        icon: 'layers-outline',
        iconColor: '#2c8ef4',
      },
      {
        priority: 7,
        id: 'hide',
        text: strings.UserCars.menu.addToArchive,
        icon: 'archive',
        iconColor: '#f4542c',
      },
    );
    res.ios.BUTTONS.push(
      {
        priority: 6,
        id: 'TOhistory',
        text: strings.UserCars.menu.history,
        icon: 'layers-outline',
        iconColor: '#2c8ef4',
      },
      {
        priority: 7,
        id: 'hide',
        text: strings.UserCars.menu.addToArchive,
        icon: 'archive',
        iconColor: '#f4542c',
      },
    );
    tmpArr.push(6, 7);
    if (storeState.dealer.selected.region === 'by') {
      res.android.BUTTONS.push({
        priority: 3,
        id: 'TOCalculator',
        text: strings.UserCars.menu.tocalc,
        icon: 'calculator-outline',
        iconColor: '#2c8ef4',
      });
      res.ios.BUTTONS.push({
        priority: 3,
        id: 'TOCalculator',
        text: strings.UserCars.menu.tocalc,
        icon: 'calculator-outline',
        iconColor: '#2c8ef4',
      });
      tmpArr.push(3);
    }
    res.android.CANCEL_INDEX =
      res.android.CANCEL_INDEX + res.ios.BUTTONS.length;
    res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + res.ios.BUTTONS.length;
  } else {
    res.android.BUTTONS.push({
      priority: 1,
      id: 'callMeBack',
      text: strings.CallMeBackScreen.title,
      icon: 'call',
      iconColor: '#2c8ef4',
      navigate: 'CallMeBackScreen',
    });
    res.ios.BUTTONS.push({
      priority: 1,
      id: 'callMeBack',
      text: strings.CallMeBackScreen.title,
      icon: 'call',
      iconColor: '#2c8ef4',
      navigate: 'CallMeBackScreen',
    });
    tmpArr.push(1);
    res.android.CANCEL_INDEX = res.android.CANCEL_INDEX + 1;
    res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + 1;
  }
  if (divisions) {
    if (divisions.includes('ST') && !tmpArr.includes(2)) {
      res.android.BUTTONS.push({
        priority: 2,
        id: 'orderService',
        text: strings.UserCars.menu.service,
        icon: 'construct',
        iconColor: '#2c8ef4',
        navigate: 'ServiceScreen',
      });
      res.ios.BUTTONS.push({
        priority: 2,
        id: 'orderService',
        text: strings.UserCars.menu.service,
        icon: 'construct',
        iconColor: '#2c8ef4',
        navigate: 'ServiceScreen',
      });
      tmpArr.push(2);
      res.android.CANCEL_INDEX = res.android.CANCEL_INDEX + 1;
      res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + 1;
    }

    if (divisions.includes('ZZ') && !tmpArr.includes(4)) {
      res.android.BUTTONS.push({
        priority: 4,
        id: 'orderParts',
        text: strings.OrderPartsScreen.title2,
        icon: 'cart-outline',
        iconColor: '#2c8ef4',
        navigate: 'OrderPartsScreen',
      });
      res.ios.BUTTONS.push({
        priority: 4,
        id: 'orderParts',
        text: strings.OrderPartsScreen.title2,
        icon: 'cart-outline',
        iconColor: '#2c8ef4',
        navigate: 'OrderPartsScreen',
      });
      tmpArr.push(4);
      res.android.CANCEL_INDEX = res.android.CANCEL_INDEX + 1;
      res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + 1;
    }

    if (divisions.includes('TI') && !tmpArr.includes(5)) {
      res.android.BUTTONS.push({
        priority: 5,
        id: 'carCost',
        text: strings.CarCostScreen.action,
        icon: 'cash-outline',
        iconColor: '#2c8ef4',
        navigate: 'CarCostScreen',
      });
      res.ios.BUTTONS.push({
        priority: 5,
        id: 'carCost',
        text: strings.CarCostScreen.action,
        icon: 'cash-outline',
        iconColor: '#2c8ef4',
        navigate: 'CarCostScreen',
      });
      tmpArr.push(5);
      res.android.CANCEL_INDEX = res.android.CANCEL_INDEX + 1;
      res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + 1;
    }
    Array.prototype.push.apply(
      res[Platform.OS].BUTTONS,
      ORDERS[Platform.OS].BUTTONS,
    );
    res[Platform.OS].BUTTONS.sort((a, b) => {
      return a.priority - b.priority;
    });
  }
  return res[Platform.OS];
}

async function getArchieveCarMenu() {
  const CarMenu = {
    hidden: {
      android: {
        BUTTONS: [
          {
            id: 'TOhistory',
            text: strings.UserCars.menu.history,
            icon: 'book-outline',
            iconColor: '#2c8ef4',
          },
          {
            id: 'hide',
            text: strings.UserCars.menu.makeCurrent,
            icon: 'swap-horizontal',
            iconColor: '#2c8ef4',
          },
          {
            id: 'cancel',
            text: strings.Base.cancel.toLowerCase(),
            icon: 'close',
            iconColor: 'red',
          },
        ],
        DESTRUCTIVE_INDEX: 1,
        CANCEL_INDEX: 2,
      },
      ios: {
        BUTTONS: [
          {
            id: 'TOhistory',
            text: strings.UserCars.menu.history,
            icon: 'book-outline',
            iconColor: '#2c8ef4',
          },
          {
            id: 'hide',
            text: strings.UserCars.menu.makeCurrent,
            icon: 'swap-horizontal',
            iconColor: '#2c8ef4',
          },
          {
            id: 'cancel',
            text: strings.Base.cancel.toLowerCase(),
            icon: 'close',
            iconColor: 'red',
          },
        ],
        DESTRUCTIVE_INDEX: 1,
        CANCEL_INDEX: 2,
      },
    },
  };
  return CarMenu;
}

export default {
  getOrders,
  getArchieveCarMenu,
};
