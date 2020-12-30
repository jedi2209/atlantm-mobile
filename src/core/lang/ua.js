export default {
  Menu: {
    main: {
      // основное меню
      autocenter: 'Автоцентр',
      actions: 'Акції',
      newcars: 'Нові авто',
      usedcars: 'Авто з пробігом',
      reviews: 'Відгуки',
      indicators: 'індикатори',
      service: 'Сервіс',
      tva: 'Табло видачі авто',
    },
    bottom: {
      // нижнее меню
      search: 'Пошук',
      dealer: 'Автоцентр',
      lkk: 'Кабінет',
      order: 'Запит',
      menu: 'Меню',
    },
  },
  ColorBox: {
    // всплывашка с цветом на складе
    code: 'код кольору',
  },
  DatePickerCustom: {
    // выбор даты в формах
    chooseDate: 'Вибери дату',
    choose: 'вибрати',
  },
  DealerItemList: {
    // выбор автоцентра
    chooseDealer: 'Вибери зручний для тебе автоцентр',
  },
  SelectItemByCountry: {
    error: {
      title: 'Помилка',
      text: 'Не вдалося отримати дані обраного автоцентру, спробуємо знову?',
    },
  },
  LangSwitcher: {
    // переключатель языка
    lang: 'Язык',
    chooseLang: 'вибрати мову',
  },
  Picker: {
    choose: 'вибрати',
  },
  MessageForm: {
    // форма отправки отзыва
    done: 'Готово',
    placeholder: 'Поле для заповнення',
  },
  ModalView: {
    close: 'закрити',
    cancel: 'скасувати',
  },
  PhotoViewer: {
    errorLoad: 'Не вдалося завантажити фото',
  },
  RateThisApp: {
    title: 'Подобається додаток?',
    text: 'Розкажи світу про свій досвід і залиш відгук!',
    rate: 'Оцінити',
    no: 'Ні, дякую',
    later: 'Не зараз',
  },
  CarCostScreen: {
    title: 'Оцінка мого авто',
  },
  Notifications: {
    success: {
      title: 'Все вийшло!',
      textOrder:
        "Запит успішно відправлено. Наші менеджери незабаром зв'яжуться з тобою. Дякуємо!",
    },
    error: {
      title: 'Хьюстон, у нас проблеми...',
      text: 'Сталася помилка, спробуємо знову?',
    },
  },
  CarList: {
    emptyMessage: 'Немає автомобілів для відображення',
  },
  OrderCreditScreen: {
    title: 'Запит на кредит',
  },
  OrderMyPriceScreen: {
    title: 'Запропонувати свою ціну',
  },
  OrderScreen: {
    title: 'Запит на авто',
    titleSimiliar: 'Запит на схоже авто',
  },
  OrderTestDriveScreen: {
    titleTestDrive: 'Запит на тест-драйв авто',
    titleView: 'Запит на перегляд авто',
  },
  TestDriveScreen: {
    title: 'Запит на тест-драйв',
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
      dealerCar: 'Автоцентр і автомобіль',
      car: 'Автомобіль',
      contacts: 'Контактні дані',
      foto: 'Фотографії',
      additional: 'Додатково',
    },
    field: {
      label: {
        dealer: 'Автоцентр',
        name: "Ім'я",
        date: 'Вибери зручну для тебе дату',
        secondName: 'По батькові',
        lastName: 'Прізвище',
        carMileage: 'Пробіг [в кілометрах]',
        engineVolume: "Об'єм двигуна [в куб.см]",
        engineType: 'Тип двигуна',
        car: 'Вибери бажаний автомобіль',
        carTestDrive: 'Автомобіль для тест-драйву',
        carNameComplectation: 'Марка, модель і комплектація',
        carNameYear: 'Марка, модель і рік випуску',
        creditSumm: 'Бажана сума кредиту',
        carYourPrice: 'Твоя ціна за автомобіль',
        carBrand: 'Марка',
        carModel: 'Модель',
        carYear: 'Рік випуску',
        carVIN: 'VIN номер',
        gearbox: 'Тип КПП',
        email: 'Email',
        phone: 'Телефон',
        foto: 'Завантаж фото',
        comment: 'Коментар',
      },
      placeholder: {
        dealer: 'Вибери зручний для тебе автоцентр',
        engineType: 'Вкажи тип двигуна...',
        comment: 'На випадок якщо тобі потрібно передати нам більше інформації',
        gearbox: 'Вибери коробку передач...',
        carYear: 'Вибери рік випуску...',
        carTestDrive: 'Вибери автомобіль для тест-драйву',
        date: 'починаючи з ',
      },
      value: {
        gearbox: {
          mechanical: 'Механічна',
          automatic: 'Автоматична',
          dsg: 'Автоматична -- DSG',
          robot: 'Автоматична -- Робот',
          variator: 'Автоматична -- Варіатор',
        },
        engineType: {
          gasoline: 'Бензин',
          gasolineGas: 'Бензин (ГАЗ)',
          diesel: 'Дизель',
          hybrid: 'Гібрид',
          electro: 'Електро',
        },
      },
    },
    status: {
      carTestDriveSearch: 'шукаємо вільні автомобілі для тест-драйву',
    },
  },
};
