export default {
  Menu: {
    main: {
      // основное меню
      autocenter: 'Автоцентр',
      actions: 'Акції',
      newcars: 'Нові авто',
      usedcars: 'Авто з пробігом',
      reviews: 'Відгуки',
      indicators: 'Індикатори',
      service: 'Сервіс',
      tva: 'Табло видачі авто',
      bonus: 'Бонусна програма Атлант-М',
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
    chooseDateButton: 'Вибрати дату',
    choose: 'вибрати',
    month: {
      1: 'Січень',
      2: 'Лютий',
      3: 'Березень',
      4: 'Квітень',
      5: 'Травень',
      6: 'Червень',
      7: 'Липень',
      8: 'Серпень',
      9: 'Вересень',
      10: 'Жовтень',
      11: 'Листопад',
      12: 'Грудень',
    },
  },
  Navigation: {
    back: 'Назад',
  },
  ChooseDateTimeComponent: {
    chooseTime: 'Вибери зручний для тебе час',
    loading: {
      timeService: 'шукаємо вільний час на СТО',
      timeTestDrive: 'шукаємо вільний час для тест-драйву',
    },
    Notifications: {
      error: {
        period: 'Немає доступних періодів, спробуй вибрати інший день',
      },
    },
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
    continue: 'Продовжити',
  },
  ModalView: {
    close: 'закрити',
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
    action: 'Оцінити мій автомобіль',
    chooseFoto: 'Вибрати фото',
  },
  Notifications: {
    success: {
      title: 'Все вийшло!',
      titleSad: 'Ми сумуємо =(',
      text: "Наші менеджери незабаром зв'яжуться з тобою. Дякуємо!",
      textOnline: 'Дякуємо! Твій запит оформлено, чекаємо!',
      textOrder:
        "Запит успішно відправлено. Наші менеджери незабаром зв'яжуться з тобою. Дякуємо!",
      textPush:
        'Ти успішно підписався на отримання PUSH-повідомлень!\r\n\r\nВони не будуть часто приходити, тільки лише при появі нових цікавих акцій.',
      textPushSad: 'Нам буде тебе не вистачати...\r\nПовертайся швидше!',
      textProfileUpdate: 'Твої дані успішно оновлено',
    },
    error: {
      title: 'Хьюстон, у нас проблеми...',
      text: 'Сталася помилка, спробуємо знову?',
    },
  },
  CarList: {
    emptyMessage: 'Немає автомобілів для відображення',
    badges: {
      specialPrice: 'спец.ціна',
    },
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
    title: 'Історія ТО і обслуговування',
    master: 'Майстер',
    sale: 'Знижка',
    price: {
      work: 'Вартість робіт',
      materials: 'Вартість запчастин',
      total: 'Всього',
    },
    empty: {
      text: 'Історії ще немає',
    },
  },
  CarHistoryDetailsScreen: {
    count: 'Кількість',
    price: 'Вартість',
    sale: 'Знижка',
    materials: 'Матеріали',
    works: 'Роботи',
    tax: 'ПДВ',
    total: {
      nds: 'Разом з ПДВ',
    },
  },
  NewCarItemScreen: {
    Notifications: {
      buyType: {
        title: 'Варіант придбання авто',
        text:
          'Хочеш забронювати авто чи просто відправити запит?\r\n\r\n' +
          'Бронювання дозволить тобі гарантовано отримати автомобіль, внісши невелику передоплату.\r\n\r\n' +
          'Звісно, ця сума зараховується у вартість авто.',
      },
    },
    sendQuery: 'Відправити запит',
    makeOrder: 'Забронювати',
    show: 'переглянути',
    plates: {
      complectation: 'Комплектація',
      mileage: 'Пробіг',
      engine: 'Двигун',
      gearbox: {
        name: 'КПП',
      },
      wheel: 'Привід',
      color: 'Колір',
    },
    carLocation: 'Автомобіль знаходиться за адресою',
    tech: {
      title: 'Характеристики',
      base: 'Основні',
      year: 'Рік випуску',
      engine: {
        title: 'Двигун',
        type: 'Тип',
        fuel: 'Паливо',
        volume: "Робочий об'єм",
        power: {
          hp: 'Потужність',
        },
      },
      gearbox: {
        title: 'Трансмісія',
        type: 'Тип',
        count: 'Кількість передач',
        wheel: 'Привід',
      },
      body: {
        title: 'Кузов',
        type: 'Тип кузова',
        width: 'Довжина',
        height: 'Ширина',
        high: 'Висота',
        clirens: 'Кліренс',
        trunk: "Об'єм багажника",
        fuel: "Об'єм паливного бака",
      },
      interior: {
        title: 'Салон',
      },
    },
    techData: {
      title: 'Експлуатаційні характеристики',
      maxSpeed: 'Максимальна швидкість',
      dispersal: 'Розгін з 0 до 100 км/год',
      fuel: {
        city: 'Витрата палива (місто)',
        track: 'Витрата палива (траса)',
        both: 'Витрата палива (змішана)',
      },
    },
    shortUnits: {
      litres: 'л.',
      milimetrs: 'мм.',
      hp: 'к.с.',
      year: 'р.в.',
    },
    complectation: {
      title: 'Комплектація',
      main: 'Серійна комплектація',
      additional: 'Додаткові опції',
    },
    testDrive: 'тест-драйв',
    wannaCar: 'хочу це авто!',
  },
  NewCarListScreen: {
    title: 'Нові автомобілі',
  },
  NewCarFilterScreen: {
    price: 'Ціна',
  },
  UserCarListScreen: {
    title: 'Автомобілі з пробігом',
  },
  UserCarItemScreen: {
    showFull: 'Показати повний опис...',
    showLess: 'Згорнути',
    creditCalculate: 'розрахувати кредит',
    myPrice: 'запропонувати\r\nсвою ціну',
  },
  UsedCarFilterScreen: {
    city: 'Місто',
    apply: 'Застосувати',
  },
  ContactsScreen: {
    closedDealer: {
      title: 'Автоцентр закритий',
      text:
        '\r\nЗалиш запит на дзвінок і наші менеджери зателефонують як тільки автоцентр відкриється.\r\n\r\nЗалишимо запит на дзвінок?',
      yes: 'Так',
      no: 'Ні',
    },
    call: 'Зателефонувати',
    callOrder: 'Замовити дзвінок',
    order: 'Запит',
    sendOrder: 'Відправити запит',
    site: 'Сайт',
    sites: 'Сайти',
    dealerSites: 'Сайти автоцентру',
    currentActions: 'Діючі акції автоцентру',
  },
  MapScreen: {
    apps: {
      yaNavi: 'Яндекс Навігатор',
      yaMaps: 'Яндекс Карта',
      yaTaxi: 'Яндекс Таксі',
      uber: 'Uber',
      googleMaps: 'Google Карта',
      appleMaps: 'Apple Карта',
    },
    empty: {
      text: 'Немає даних для відображення карти',
    },
    chooseApp: 'Вибери додаток для навігації',
    makeRoute: 'Побудувати маршрут',
    error: {
      title: 'Помилка',
      text: 'Не вдалося використати програми для навігації, спробуємо знову?',
    },
  },
  ChooseDealerScreen: {
    title: 'Вибери автоцентр',
  },
  EkoScreen: {
    title: 'Відгуки та пропозиції',
    dealerReviews: 'Відгуки про автоцентр',
  },
  ReviewAddMessageStepScreen: {
    title: 'Новий відгук',
  },
  ReviewAddMessageForm: {
    label: {
      plus:
        'Що тобі сподобалося в роботі автоцентру? Кому б ти хотів висловити подяку?',
      minus: 'Чим ти залишився незадоволений в роботі автоцентру?',
    },
  },
  ReviewAddRatingStepScreen: {
    title: 'Новий відгук',
    mainReview: 'Загальне враження',
    mainReview2: 'Наскільки в цілому ти задоволений?',
    addReview: 'Постав оцінку нашій роботі...',
    approve: 'Я дозволяю публікувати мій відгук',
    Notifications: {
      success: {
        text: 'Твій відгук успішно відправлений!',
      },
    },
  },
  ReviewsScreen: {
    title: 'Відгуки',
  },
  ReviewScreen: {
    title: 'Відгук',
    rating: 'Рейтинг',
  },
  ReviewDealerAnswer: {
    dealerAnswer: 'Відповідь автоцентру',
  },
  ReviewsFilterDateScreen: {
    title: 'Відгуки за період',
    periods: {
      all: 'всі',
      week: 'тиждень',
      month: 'місяць',
      year: 'рік',
    },
  },
  ReviewsFilterRatingScreen: {
    title: 'Відгуки з рейтингом',
    Notifications: {
      rating: '"Рейтинг від" не може бути більше "рейтингу до"',
      rating2: '"Рейтинг до" не може бути менше "рейтингу від"',
    },
    rating: {
      from: 'рейтинг від',
      to: 'рейтинг до',
    },
  },
  IndicatorsScreen: {
    title: 'Індикатори',
    empty: {
      text: 'Немає індикаторів для відображення',
    },
  },
  InfoListScreen: {
    title: 'Акції',
    empty: {
      text: 'В даний момент немає акцій',
    },
    refresh: 'Оновити список акцій',
  },
  InfoPostScreen: {
    button: {
      callMe: 'зателефонуйте мені',
    },
    filter: {
      from: 'з',
      to: 'до',
    },
  },
  IntroScreen: {
    button: 'Вибери свій автоцентр',
  },
  DiscountsScreen: {
    title: 'Знижки',
    empty: {
      text: 'Знижок поки немає',
    },
  },
  ReestablishScreen: {
    title: 'Вхід за логіном і паролем',
    fieldsRequired: "Поля логін і пароль є обов'язковими для заповнення",
    loginRequired: 'Нам потрібно знати твій логін, щоб відновити доступ',
    notFound: {
      text:
        'Ми дуже засмучені тим, що ти не виявив свої автомобілі і бонусний рахунок в особистому кабінеті.',
      text2: 'Будь ласка, дай нам ще один шанс!',
      caption: 'Введи свої дані для доступу до старого особистого кабінету.',
      caption2:
        'Це останній раз коли тобі доведеться згадати ці магічні комбінації цифр і букв для входу в особистий кабінет.',
    },
    forgotPass: "Не пам'ятаю пароль",
    findMyData: 'Знайдіть мої дані',
  },
  ProfileSettingsScreen: {
    title: 'Редагування профіля',
    Notifications: {
      error: {
        emailPhone: {
          title: 'Заповни телефон або Email',
          text:
            "Будь ласка, вкажи хоча б один контакт для можливості зв'язку з тобою",
        },
      },
    },
    save: 'Зберегти',
  },
  ProfileScreenInfo: {
    empty: {
      cars: 'У тебе поки ще немає автомобілів, про які ми знаємо...',
      whereMyCars: 'Не бачиш свої авто?',
    },
    bonus: {
      title: 'Бонусний рахунок',
      text: 'Історія накопичення і витрат твоїх бонусів',
      show: 'Переглянути',
      moreInfo: 'Детальніше про бонусну програму',
      current: {
        text: 'У тебе поки ще',
        text2: 'балів', // 0
        text3: 'Дізнайся більше про бонусну програму і накопичуй бали швидше!',
        giveMeMore: 'Хочу більше балів',
        bonuses: 'бонусів', // 0
        bonus: 'бонус', // 1
      },
      total: 'Всього',
      empty: {
        text: 'Бонусів ще немає',
      },
    },
    editData: 'Редагувати дані',
    exit: 'Вийти',
  },
  ProfileScreen: {
    Notifications: {
      error: {
        phone: 'Телефон повинен бути доданим',
        phoneProvider:
          'Невідомий мобільний оператор або неправильний формат номера',
        wrongCode: 'Невірний код',
      },
    },
    approve: 'Підтвердити',
    getCode: 'Отримати код',
  },
  CallMeBackScreen: {
    title: 'Зателефонуйте мені',
    button: 'Чекаю дзвінка',
  },
  UserCars: {
    title: 'Мої автомобілі',
    current: 'поточні',
    archive: 'архів',
    archiveCheck: 'Перевіримо архів?',
    empty: {
      text: 'У тебе немає поточних автомобілів.',
    },
    menu: {
      service: 'Записатися на сервіс',
      history: 'Історія обслуговування',
      makeCurrent: 'Зробити поточним',
      addToArchive: 'Відправити в архів',
    },
    Notifications: {
      success: {
        statusUpdate: 'Статус автомобіля змінений',
      },
    },
  },
  BonusInfoScreen: {
    title: 'Бонусна програма',
  },
  ServiceScreen: {
    title: 'Запис на сервіс',
    Notifications: {
      error: {
        chooseDate: 'Необхідно вибрати дату для продовження',
      },
    },
    button: 'Записатися!',
  },
  ServiceScreenStep1: {
    Notifications: {
      error: {
        chooseService: 'Необхідно вибрати бажану послугу для продовження',
      },
      loading: {
        dealerConnect: 'підключення до СТО для вибору послуг',
        calculatePrice: 'вираховуємо попередню вартість',
      },
    },
    price: 'Попередня вартість',
  },
  OrderPartsScreen: {
    title: 'Замовлення запчастин',
    title2: 'Замовити запчастини',
  },
  TvaScreen: {
    title: 'Табло видачі авто',
  },
  TvaResultsScreen: {
    title: 'Інформація про авто',
    serviceMan: 'Майстер-приймальник',
    time: 'Час видачі',
    status: 'Статус',
    messageToServiceMan: 'Повідомлення майстру',
    Notifications: {
      success: {
        messageSent: 'Повідомлення успішно відправлено',
      },
    },
  },
  Form: {
    group: {
      main: 'Основне',
      dealer: 'Автоцентр',
      dealerCar: 'Автоцентр і автомобіль',
      car: 'Автомобіль',
      contacts: 'Контактні дані',
      foto: 'Фотографії',
      additional: 'Додатково',
      social: 'Твої соц. мережі для швидкого входу',
      date: 'Дата',
      part: 'Запасна частина',
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
        car2: 'Вибери автомобіль',
        service: 'Вибери послугу',
        carTestDrive: 'Автомобіль для тест-драйву',
        carNameComplectation: 'Марка, модель і комплектація',
        carNameYear: 'Марка, модель і рік випуску',
        carNumber: 'Держ. номер автомобіля',
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
        login: 'Логін',
        pass: 'Пароль',
        birthday: 'Коли у тебе день народження?',
        social: 'Додай соц. мережі',
        part: 'Що будемо замовляти?',
      },
      placeholder: {
        dealer: 'Вибери зручний для тебе автоцентр',
        engineType: 'Вкажи тип двигуна...',
        comment: 'На випадок якщо тобі потрібно передати нам більше інформації',
        gearbox: 'Вибери коробку передач...',
        carYear: 'Вибери рік випуску...',
        carTestDrive: 'Вибери автомобіль для тест-драйву',
        date: 'починаючи з ',
        birthday: "Ми обов'язково привітаємо!",
        service: 'Що будемо робити з авто?',
        part: 'Номер, назва і перелік необхідних запчастин',
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
      fieldsRequired1: 'Поля',
      fieldsRequired2: "є обов'язковими для заповнення",
      fieldRequired1: 'Поле',
      fieldRequired2: "є обов'язковим для заповнення",
    },
    button: {
      send: 'Відправити',
    },
  },
  Base: {
    or: 'чи',
    all: 'Всі',
    cancel: 'Скасувати',
    choose: 'Вибрати',
  },
  CarParams: {
    engine: {
      1: 'Бензин',
      2: 'Дизель',
      3: 'Гібрид',
      4: 'Електро',
      9: 'Бензиновый, Газ',
      12: 'Газ',
    },
    gearbox: {
      1: 'Механічна',
      4: 'Автоматична',
      11: 'DSG',
      12: 'Робот',
      13: 'Варіатор',
    },
    body: {
      1: 'Хетчбек',
      2: 'Седан',
      3: 'Універсал',
      4: 'Купе',
      5: 'Кабріолет',
      6: 'Мінівен',
      7: 'Фургон',
      8: 'Пікап',
      9: 'Позашляховик',
      10: 'Кросовер',
      11: 'Мікроавтобус',
      12: 'Ліфтбек',
      13: 'Шасі',
      14: 'Автобус',
    },
    wheels: {
      1: 'Повний',
      3: 'Задній',
      4: 'Передній',
    },
  },
  Colors: {
    28: 'Бежевий',
    13: 'Білий',
    101: 'Бордовий',
    1028: 'Бронзовий',
    174: 'Блакитний',
    37: 'Жовтий',
    121: 'Зелений',
    355: 'Золотистий',
    289: 'Коричневий',
    55: 'Червоний',
    31: 'Помаранчевий',
    327: 'Рожевий',
    1181: 'Салатовий',
    144: 'Сріблястий',
    4: 'Сірий',
    216: 'Синій',
    268: 'Фіолетовий',
    5: 'Чорний',
  },
};
