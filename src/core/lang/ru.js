export default {
  Menu: {
    main: {
      // основное меню
      autocenter: 'Автоцентр',
      actions: 'Акции',
      newcars: 'Новые авто',
      usedcars: 'Подержанные авто',
      reviews: 'Отзывы',
      indicators: 'Индикаторы',
      service: 'Сервис',
      tva: 'Табло выдачи авто',
    },
    bottom: {
      // нижнее меню
      search: 'Поиск',
      dealer: 'Автоцентр',
      lkk: 'Кабинет',
      order: 'Заявка',
      menu: 'Меню',
    },
  },
  ColorBox: {
    // всплывашка с цветом на складе
    code: 'код цвета',
  },
  DatePickerCustom: {
    // выбор даты в формах
    chooseDate: 'Выбери дату',
    choose: 'выбрать',
  },
  DealerItemList: {
    // выбор автоцентра
    chooseDealer: 'Выбери удобный для тебя автоцентр',
  },
  SelectItemByCountry: {
    error: {
      title: 'Ошибка',
      text:
        'Не удалось получить данные по выбранному автоцентру, попробуем снова?',
    },
  },
  LangSwitcher: {
    // переключатель языка
    lang: 'Язык',
    chooseLang: 'выбрать язык',
  },
  Picker: {
    choose: 'выбрать',
  },
  MessageForm: {
    // форма отправки отзыва
    done: 'Готово',
    placeholder: 'Поле для заполнения',
  },
  ModalView: {
    close: 'закрыть',
    cancel: 'отмена',
  },
  PhotoViewer: {
    errorLoad: 'Не удалось загрузить фото',
  },
  RateThisApp: {
    title: 'Нравится приложение?',
    text: 'Расскажи миру о своём опыте и оставь свой отзыв!',
    rate: 'Оценить',
    no: 'Нет, спасибо',
    later: 'Не сейчас',
  },
  CarCostScreen: {
    title: 'Оценка моего авто',
  },
  Notifications: {
    success: {
      title: 'Всё получилось!',
      textOrder:
        'Заявка успешно отправлена. Наши менеджеры вскоре свяжутся с тобой. Спасибо!',
    },
    error: {
      title: 'Хьюстон, у нас проблемы...',
      text: 'Произошла ошибка, попробуем снова?',
    },
  },
  CarList: {
    emptyMessage: 'Нет автомобилей для отображения',
  },
  OrderCreditScreen: {
    title: 'Заявка на кредит',
  },
  OrderMyPriceScreen: {
    title: 'Предложить свою цену',
  },
  OrderScreen: {
    title: 'Заявка на авто',
    titleSimiliar: 'Заявка на похожее авто',
  },
  OrderTestDriveScreen: {
    titleTestDrive: 'Заявка на тест-драйв авто',
    titleView: 'Заявка на просмотр авто',
  },
  TestDriveScreen: {
    title: 'Заявка на тест-драйв',
  },
  CarHistoryScreen: {
    title: 'История ТО и обслуживания',
    master: 'Мастер',
    sale: 'Скидка',
    price: {
      work: 'Стоимость работ',
      materials: 'Стоимость запчастей',
      total: 'Всего',
    },
    empty: {
      text: 'Истории пока нет',
    },
  },
  CarHistoryDetailsScreen: {
    count: 'Количество',
    price: 'Стоимость',
    sale: 'Скидка',
    materials: 'Материалы',
    works: 'Работы',
    tax: 'НДС',
    total: {
      nds: 'Итого с НДС',
    },
  },
  Form: {
    group: {
      dealer: 'Автоцентр',
      dealerCar: 'Автоцентр и автомобиль',
      car: 'Автомобиль',
      contacts: 'Контактные данные',
      foto: 'Фотографии',
      additional: 'Дополнительно',
    },
    field: {
      label: {
        dealer: 'Автоцентр',
        name: 'Имя',
        date: 'Выбери удобную для тебя дату',
        secondName: 'Отчество',
        lastName: 'Фамилия',
        carMileage: 'Пробег [в километрах]',
        engineVolume: 'Объём двигателя [в куб.см]',
        engineType: 'Тип двигателя',
        car: 'Выбери желаемый автомобиль',
        carTestDrive: 'Автомобиль для тест-драйва',
        carNameComplectation: 'Марка, модель и комплектация',
        carNameYear: 'Марка, модель и год выпуска',
        creditSumm: 'Желаемая сумма кредита',
        carYourPrice: 'Твоя стоимость за автомобиль',
        carBrand: 'Марка',
        carModel: 'Модель',
        carYear: 'Год выпуска',
        carVIN: 'VIN номер',
        gearbox: 'Тип КПП',
        email: 'Email',
        phone: 'Телефон',
        foto: 'Прикрепи фото',
        comment: 'Комментарий',
      },
      placeholder: {
        dealer: 'Выбери удобный для тебя автоцентр',
        engineType: 'Укажи тип двигателя...',
        comment:
          'На случай если тебе потребуется передать нам больше информации',
        gearbox: 'Выбери коробку передач...',
        carYear: 'Выбери год выпуска...',
        carTestDrive: 'Выбери автомобиль для тест-драйва',
        date: 'начиная с ',
      },
      value: {
        gearbox: {
          mechanical: 'Механическая',
          automatic: 'Автоматическая',
          dsg: 'Автоматическая -- DSG',
          robot: 'Автоматическая -- Робот',
          variator: 'Автоматическая -- Вариатор',
        },
        engineType: {
          gasoline: 'Бензин',
          gasolineGas: 'Бензин (ГАЗ)',
          diesel: 'Дизель',
          hybrid: 'Гибрид',
          electro: 'Электро',
        },
      },
    },
    status: {
      carTestDriveSearch: 'ищем свободные автомобили для тест-драйва',
    },
  },
};
