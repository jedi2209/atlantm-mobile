export const RUSSIA = 'ru';
export const BELARUSSIA = 'by';
export const UKRAINE = 'ua';

export const ERROR_NETWORK = 'Отсутствует интернет соединение';

export const ORDERS = {
  android: {
    TITLE: 'Заявки',
    BUTTONS: [
      {
        priority: 1,
        id: 'callMeBack',
        text: 'Перезвоните мне',
        icon: 'call',
        iconColor: '#2c8ef4',
      },
      {
        priority: 4,
        id: 'carCost',
        text: 'Оценить мой автомобиль',
        icon: 'pricetag',
        iconColor: '#2c8ef4',
      },
      {
        priority: 5,
        id: 'cancel',
        text: 'Отмена',
        icon: 'close',
        iconColor: 'red',
      },
    ],
    CANCEL_INDEX: 2,
    // DESTRUCTIVE_INDEX: 4,
  },
  ios: {
    TITLE: 'Заявки',
    BUTTONS: [
      {
        priority: 1,
        id: 'callMeBack',
        text: '📞 Перезвоните мне',
      },
      {
        priority: 4,
        id: 'carCost',
        text: 'Оценить мой автомобиль',
      },
      {
        priority: 5,
        id: 'cancel',
        text: 'Отмена',
      },
    ],
    CANCEL_INDEX: 2,
    // DESTRUCTIVE_INDEX: 4,
  },
};
