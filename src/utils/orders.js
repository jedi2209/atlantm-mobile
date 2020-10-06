import {Platform} from 'react-native';
import {ORDERS} from '../core/const';
import {get} from 'lodash';
import {store} from '../core/store';

export default async function getOrders(type = 'default') {
  const storeState = store.getState();
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
  const divisions = get(storeState, 'dealer.selected.divisionTypes');
  Object.keys(ORDERS[Platform.OS].BUTTONS).map((el) => {
    tmpArr.push(ORDERS[Platform.OS].BUTTONS[el].priority);
  });
  if (type === 'car') {
    res.android.BUTTONS.push(
      {
        priority: 5,
        id: 'TOhistory',
        text: 'История обслуживания',
        icon: 'book-outline',
        iconColor: '#2c8ef4',
      },
      {
        priority: 6,
        id: 'hide',
        text: 'Скрыть в архив',
        icon: 'archive',
        iconColor: '#2c8ef4',
      },
    );
    res.ios.BUTTONS.push(
      {
        priority: 5,
        id: 'TOhistory',
        text: '📘История обслуживания',
      },
      {
        priority: 6,
        id: 'hide',
        text: '📥Скрыть в архив',
      },
    );
    tmpArr.push(5, 6);
    res.android.CANCEL_INDEX = res.android.CANCEL_INDEX + 2;
    res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + 2;
  } else {
    res.android.BUTTONS.push({
      priority: 1,
      id: 'callMeBack',
      text: 'Перезвоните мне',
      icon: 'call',
      iconColor: '#2c8ef4',
    });
    res.ios.BUTTONS.push({
      priority: 1,
      id: 'callMeBack',
      text: '📞 Перезвоните мне',
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
        text: 'Запись на сервис',
        icon: 'construct',
        iconColor: '#2c8ef4',
      });
      res.ios.BUTTONS.push({
        priority: 2,
        id: 'orderService',
        text: '🛠 Запись на сервис',
      });
      tmpArr.push(2);
      res.android.CANCEL_INDEX = res.android.CANCEL_INDEX + 1;
      res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + 1;
    }

    if (divisions.includes('ZZ') && !tmpArr.includes(3)) {
      res.android.BUTTONS.push({
        priority: 3,
        id: 'orderParts',
        text: 'Заказать зап.части',
        icon: 'settings',
        iconColor: '#2c8ef4',
      });
      res.ios.BUTTONS.push({
        priority: 3,
        id: 'orderParts',
        text: '🔩 Заказать зап.части',
      });
      tmpArr.push(3);
      res.android.CANCEL_INDEX = res.android.CANCEL_INDEX + 1;
      res.ios.CANCEL_INDEX = res.ios.CANCEL_INDEX + 1;
    }

    if (divisions.includes('TI') && !tmpArr.includes(4)) {
      res.android.BUTTONS.push({
        priority: 4,
        id: 'carCost',
        text: 'Оценить мой автомобиль',
        icon: 'pricetag',
        iconColor: '#2c8ef4',
      });
      res.ios.BUTTONS.push({
        priority: 4,
        id: 'carCost',
        text: 'Оценить мой автомобиль',
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
