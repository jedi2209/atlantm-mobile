import {Platform} from 'react-native';
import {ORDERS} from '../core/const';
import {get} from 'lodash';
import {store} from '../core/store';

export default async function getOrders() {
  const storeData = store.getState();
  const divisions = await get(storeData, 'dealer.selected.divisionTypes');
  let tmpArr = [];
  Object.keys(ORDERS[Platform.OS].BUTTONS).map((el) => {
    tmpArr.push(ORDERS[Platform.OS].BUTTONS[el].priority);
  });
  if (divisions) {
    console.log('ORDERS', ORDERS);
    if (divisions.includes('ST') && !tmpArr.includes(2)) {
      ORDERS.android.BUTTONS.push({
        priority: 2,
        id: 'orderService',
        text: 'Запись на сервис',
        icon: 'construct',
        iconColor: '#2c8ef4',
      });
      ORDERS.ios.BUTTONS.push({
        priority: 2,
        id: 'orderService',
        text: '🛠 Запись на сервис',
      });
      tmpArr.push(2);
      ORDERS.android.CANCEL_INDEX = ORDERS.android.CANCEL_INDEX + 1;
      ORDERS.ios.CANCEL_INDEX = ORDERS.ios.CANCEL_INDEX + 1;
    }

    if (divisions.includes('ZZ') && !tmpArr.includes(3)) {
      ORDERS.android.BUTTONS.push({
        priority: 3,
        id: 'orderParts',
        text: 'Заказать зап.части',
        icon: 'settings',
        iconColor: '#2c8ef4',
      });
      ORDERS.ios.BUTTONS.push({
        priority: 3,
        id: 'orderParts',
        text: '🔩 Заказать зап.части',
      });
      tmpArr.push(3);
      ORDERS.android.CANCEL_INDEX = ORDERS.android.CANCEL_INDEX + 1;
      ORDERS.ios.CANCEL_INDEX = ORDERS.ios.CANCEL_INDEX + 1;
    }

    if (divisions.includes('TI') && !tmpArr.includes(4)) {
      ORDERS.android.BUTTONS.push({
        priority: 4,
        id: 'carCost',
        text: 'Оценить мой автомобиль',
        icon: 'pricetag',
        iconColor: '#2c8ef4',
      });
      ORDERS.ios.BUTTONS.push({
        priority: 4,
        id: 'carCost',
        text: 'Оценить мой автомобиль',
      });
      tmpArr.push(4);
      ORDERS.android.CANCEL_INDEX = ORDERS.android.CANCEL_INDEX + 1;
      ORDERS.ios.CANCEL_INDEX = ORDERS.ios.CANCEL_INDEX + 1;
    }

    ORDERS[Platform.OS].BUTTONS.sort((a, b) => {
      return a.priority - b.priority;
    });
  }
  return ORDERS[Platform.OS];
}
