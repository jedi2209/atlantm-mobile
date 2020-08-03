export const RUSSIA = 'ru';
export const BELARUSSIA = 'by';
export const UKRAINE = 'ua';

export const ERROR_NETWORK = 'Отсутствует интернет соединение';

export const ORDERS = {
  android: {
    TITLE: 'Заявки',
    BUTTONS: [
      {
        id: 'callMeBack',
        text: 'Перезвоните мне',
        icon: 'call',
        iconColor: '#2c8ef4',
      },
      {
        id: 'orderService',
        text: 'Запись на сервис',
        icon: 'construct',
        iconColor: '#2c8ef4',
      },
      {
        id: 'orderParts',
        text: 'Заказать зап.части',
        icon: 'settings',
        iconColor: '#2c8ef4',
      },
      {
        id: 'carCost',
        text: 'Оценить мой автомобиль',
        icon: 'pricetag',
        iconColor: '#2c8ef4',
      },
      {
        id: 'cancel',
        text: 'Отмена',
        icon: 'close',
        iconColor: 'red',
      },
    ],
    CANCEL_INDEX: 4,
    // DESTRUCTIVE_INDEX: 4,
  },
  ios: {
    TITLE: 'Заявки',
    BUTTONS: [
      {
        id: 'callMeBack',
        text: '📞 Перезвоните мне',
      },
      {
        id: 'orderService',
        text: '🛠 Запись на сервис',
      },
      {
        id: 'orderParts',
        text: '🔩 Заказать зап.части',
      },
      {
        id: 'carCost',
        text: 'Оценить мой автомобиль',
      },
      {
        id: 'cancel',
        text: 'Отмена',
      },
    ],
    CANCEL_INDEX: 4,
    // DESTRUCTIVE_INDEX: 4,
  },
};
