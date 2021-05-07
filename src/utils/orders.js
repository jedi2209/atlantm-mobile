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
          icon: 'close',
          iconColor: 'red',
        },
      ],
      CANCEL_INDEX: 0,
      // DESTRUCTIVE_INDEX: 4,
    },
    ios: {
      TITLE: 'Заявки',
      BUTTONS: [
        {
          priority: 15,
          id: 'cancel',
          text: strings.Base.cancel.toLowerCase(),
        },
      ],
      CANCEL_INDEX: 0,
      // DESTRUCTIVE_INDEX: 4,
    },
  };
  const divisions = get(storeState, 'dealer.selected.divisionTypes');
  Object.keys(ORDERS[Platform.OS].BUTTONS).map((el) => {
    tmpArr.push(ORDERS[Platform.OS].BUTTONS[el].priority);
  });
  if (type === 'car') {
    res.android.BUTTONS.push(
      {
        priority: 5,
        id: 'TOhistory',
        text: strings.UserCars.menu.history,
        icon: 'book-outline',
        iconColor: '#2c8ef4',
      },
      {
        priority: 6,
        id: 'hide',
        text: strings.UserCars.menu.addToArchive,
        icon: 'archive',
        iconColor: '#2c8ef4',
      },
    );
    res.ios.BUTTONS.push(
      {
        priority: 5,
        id: 'TOhistory',
        text: '📘' + strings.UserCars.menu.history,
      },
      {
        priority: 6,
        id: 'hide',
        text: '📥' + strings.UserCars.menu.addToArchive,
      },
    );
    tmpArr.push(5, 6);
    res.android.CANCEL_INDEX = res.android.CANCEL_INDEX + 2;
    res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + 2;
  } else {
    res.android.BUTTONS.push({
      priority: 1,
      id: 'callMeBack',
      text: strings.CallMeBackScreen.title,
      icon: 'call',
      iconColor: '#2c8ef4',
    });
    res.ios.BUTTONS.push({
      priority: 1,
      id: 'callMeBack',
      text: '📞 ' + strings.CallMeBackScreen.title,
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
      });
      res.ios.BUTTONS.push({
        priority: 2,
        id: 'orderService',
        text: '🛠 ' + strings.UserCars.menu.service,
      });
      tmpArr.push(2);
      res.android.CANCEL_INDEX = res.android.CANCEL_INDEX + 1;
      res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + 1;
    }

    if (divisions.includes('ZZ') && !tmpArr.includes(3)) {
      res.android.BUTTONS.push({
        priority: 3,
        id: 'orderParts',
        text: strings.OrderPartsScreen.title2,
        icon: 'settings',
        iconColor: '#2c8ef4',
      });
      res.ios.BUTTONS.push({
        priority: 3,
        id: 'orderParts',
        text: '🔩 ' + strings.OrderPartsScreen.title2,
      });
      tmpArr.push(3);
      res.android.CANCEL_INDEX = res.android.CANCEL_INDEX + 1;
      res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + 1;
    }

    if (divisions.includes('TI') && !tmpArr.includes(4)) {
      res.android.BUTTONS.push({
        priority: 4,
        id: 'carCost',
        text: strings.CarCostScreen.action,
        icon: 'pricetag',
        iconColor: '#2c8ef4',
      });
      res.ios.BUTTONS.push({
        priority: 4,
        id: 'carCost',
        text: strings.CarCostScreen.action,
      });
      tmpArr.push(4);
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

async function getCarMenu() {
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
            text: '📘 ' + strings.UserCars.menu.history,
          },
          {
            id: 'hide',
            text: '📤 ' + strings.UserCars.menu.makeCurrent,
          },
          {id: 'cancel', text: strings.Base.cancel.toLowerCase()},
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
  getCarMenu,
};
