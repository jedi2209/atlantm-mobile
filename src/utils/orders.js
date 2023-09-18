import {Platform} from 'react-native';
import {get} from 'lodash';
import {store} from '../core/store';
import {strings} from '../core/lang/const';

async function getOrders(type = 'default', dealerData = null) {
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
          icon: {
            name: 'close',
            color: '#f70707',
          },
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
          icon: {
            name: 'close',
            color: '#f70707',
          },
        },
      ],
      CANCEL_INDEX: 0,
    },
  };
  let divisions = ['ST', 'ZZ', 'TI'];
  let navigateOptions = {dealerHide: false};
  if (dealerData && typeof dealerData === 'object') {
    divisions = dealerData.divisionTypes;
    navigateOptions = {dealerCustom: dealerData, dealerHide: false};
  }
  if (dealerData && typeof dealerData === 'string') {
    divisions = get(storeState, 'dealer.selected.divisionTypes');
  }
  Object.keys(ORDERS[Platform.OS].BUTTONS).map(el => {
    tmpArr.push(ORDERS[Platform.OS].BUTTONS[el].priority);
  });
  if (type === 'car') {
    res.android.BUTTONS.push(
      {
        priority: 3,
        id: 'TOhistory',
        text: strings.UserCars.menu.history,
        icon: {
          name: 'layers-outline',
          color: '#2c8ef4',
        },
      },
      {
        priority: 7,
        id: 'hide',
        text: strings.UserCars.menu.addToArchive,
        icon: {
          name: 'archive',
          color: '#f4542c',
        },
      },
    );
    res.ios.BUTTONS.push(
      {
        priority: 3,
        id: 'TOhistory',
        text: strings.UserCars.menu.history,
        icon: {
          name: 'layers-outline',
          color: '#2c8ef4',
        },
      },
      {
        priority: 7,
        id: 'hide',
        text: strings.UserCars.menu.addToArchive,
        icon: {
          name: 'archive',
          color: '#f4542c',
        },
      },
    );
    tmpArr.push(3, 7);
    // if (storeState.dealer.selected.region === 'by') {
    //   res.android.BUTTONS.push({
    //     priority: 6,
    //     id: 'TOCalculator',
    //     text: strings.UserCars.menu.tocalc,
    //     icon: {
    //       name: 'calculator-outline',
    //       color: '#2c8ef4',
    //     },
    //   });
    //   res.ios.BUTTONS.push({
    //     priority: 6,
    //     id: 'TOCalculator',
    //     text: strings.UserCars.menu.tocalc,
    //     icon: {
    //       name: 'calculator-outline',
    //       color: '#2c8ef4',
    //     },
    //   });
    //   tmpArr.push(6);
    // }
    res.android.CANCEL_INDEX =
      res.android.CANCEL_INDEX + res.ios.BUTTONS.length;
    res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + res.ios.BUTTONS.length;
  } else {
    res.android.BUTTONS.push({
      priority: 1,
      id: 'callMeBack',
      text: strings.CallMeBackScreen.title,
      icon: {
        name: 'call',
        color: '#2c8ef4',
      },
      navigate: 'CallMeBackScreen',
      navigateOptions,
    });
    res.ios.BUTTONS.push({
      priority: 1,
      id: 'callMeBack',
      text: strings.CallMeBackScreen.title,
      icon: {
        name: 'call',
        color: '#2c8ef4',
      },
      navigate: 'CallMeBackScreen',
      navigateOptions,
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
        icon: {
          name: 'construct',
          color: '#2c8ef4',
        },
        navigate: 'ServiceScreen',
        navigateOptions,
      });
      res.ios.BUTTONS.push({
        priority: 2,
        id: 'orderService',
        text: strings.UserCars.menu.service,
        icon: {
          name: 'construct',
          color: '#2c8ef4',
        },
        navigate: 'ServiceScreen',
        navigateOptions,
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
        icon: {
          name: 'cart-outline',
          color: '#2c8ef4',
        },
        navigate: 'OrderPartsScreen',
      });
      res.ios.BUTTONS.push({
        priority: 4,
        id: 'orderParts',
        text: strings.OrderPartsScreen.title2,
        icon: {
          name: 'cart-outline',
          color: '#2c8ef4',
        },
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
        icon: {
          name: 'cash-outline',
          color: '#2c8ef4',
        },
        navigate: 'CarCostScreen',
      });
      res.ios.BUTTONS.push({
        priority: 5,
        id: 'carCost',
        text: strings.CarCostScreen.action,
        icon: {
          name: 'cash-outline',
          color: '#2c8ef4',
        },
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
            icon: {
              name: 'book-outline',
              color: '#2c8ef4',
            },
          },
          {
            id: 'hide',
            text: strings.UserCars.menu.makeCurrent,
            icon: {
              name: 'swap-horizontal',
              color: '#2c8ef4',
            },
          },
          {
            id: 'cancel',
            text: strings.Base.cancel.toLowerCase(),
            icon: {
              name: 'close',
              color: 'red',
            },
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
            icon: {
              name: 'book-outline',
              color: '#2c8ef4',
            },
          },
          {
            id: 'hide',
            text: strings.UserCars.menu.makeCurrent,
            icon: {
              name: 'swap-horizontal',
              color: '#2c8ef4',
            },
          },
          {
            id: 'cancel',
            text: strings.Base.cancel.toLowerCase(),
            icon: {
              name: 'close',
              color: 'red',
            },
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
