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
      settings: 'Налаштування',
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
    chooseDate: 'Виберіть дату',
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
    chooseTime: 'Виберіть зручний час',
    loading: {
      timeService: 'шукаємо вільний час на СТО',
      timeTestDrive: 'шукаємо вільний час для тест-драйву',
    },
    Notifications: {
      error: {
        period: 'Немає доступних періодів, спробуйте вибрати інший день',
      },
    },
  },
  DealerItemList: {
    // выбор автоцентра
    chooseDealer: 'Виберіть зручний автоцентр',
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
    text: 'Розкажіть світу про свій досвід і залиште відгук!',
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
      text: "Наші менеджери незабаром зв'яжуться з вами. Дякуємо!",
      textOnline: 'Дякуємо! Запит оформлено, чекаємо!',
      textOrder:
        "Запит успішно відправлено. Наші менеджери незабаром зв'яжуться з вами. Дякуємо!",
      textPush:
        'Ви успішно підписалися на отримання PUSH-повідомлень!\r\n\r\nВони не будуть часто приходити, тільки лише при появі нових цікавих акцій.',
      textPushSad: 'Нам буде не вистачати вас...\r\nПовертайтеся швидше!',
      textProfileUpdate: 'Дані успішно оновлено',
    },
    error: {
      title: 'Хьюстон, у нас проблеми...',
      text: 'Сталася помилка, спробуємо знову?',
    },
    UpdatePopup: {
      title: 'Вже є нова версія! 🏎',
      text: 'Будь ласка, онови додаток до актуальної версії.',
      update: 'Оновити',
      later: 'Пізніше',
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
          'Бронювання дозволить вам гарантовано отримати автомобіль, внісши невелику передоплату.\r\n\r\n' +
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
    warranty: 'Гарантія',
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
    titleShort: 'Нові',
  },
  CarsFilterScreen: {
    title: 'Параметри',
    chooseBrandModel: {
      title: 'Марка і модель',
      title2: 'Виберіть марку і модель',
      titles: ['модель', 'моделі', 'моделей'],
    },
    resultsButton: {
      show: 'Показати',
    },
    price: 'Ціна',
    brands: 'Бренди',
    models: 'Моделі',
    notFound: 'Немає пропозицій',
    filters: {
      city: {
        title: 'Місто',
      },
      year: {
        title: 'Рік випуску',
        from: 'від',
        to: 'до',
      },
      mileage: {
        title: 'Пробіг, км.',
      },
      price: {
        title: 'Ціна',
        nds: 'НДС 20%',
        special: 'Спец.ціна',
      },
      power: {
        title: 'Потужність, к.с.',
      },
      engineVolume: {
        title: "Об'єм двигуна, л",
      },
      gearbox: {
        title: 'Коробка передач',
      },
      body: {
        title: 'Кузов',
      },
      enginetype: {
        title: 'Тип двигуна',
      },
      drive: {
        title: 'Тип приводу',
      },
      guarantee: {
        title: 'На гарантії',
      },
      breakInsurance: {
        title: 'Застрахований від поломок',
      },
      fullServiceHistory: {
        title: 'Повна сервісна історія',
      },
      onlineOrder: {
        title: 'Можна забронювати онлайн',
      },
      colors: {
        title: 'Колір',
      },
    },
  },
  Sort: {
    title: 'Сортувати за',
    price: {
      asc: 'Зростанням ціни',
      desc: 'Спаданням ціни',
    },
    date: {
      desc: 'Датою розміщення',
    },
    year: {
      desc: 'Роком випуску: новіші',
      asc: 'Роком випуску: старші',
    },
    mileage: {
      asc: 'Пробігом',
    },
  },
  UsedCarListScreen: {
    title: 'Автомобілі з пробігом',
    titleShort: 'З пробігом',
  },
  UsedCarItemScreen: {
    showFull: 'Показати повний опис...',
    showLess: 'Згорнути',
    creditCalculate: 'розрахувати\r\nкредит',
    myPrice: 'запропонувати\r\nсвою ціну',
  },
  UsedCarFilterScreen: {
    city: 'Місто',
    apply: 'Застосувати',
  },
  FullScreenGallery: {
    from: 'із',
  },
  ContactsScreen: {
    closedDealer: {
      title: 'Автоцентр закритий',
      text: '\r\nЗалиште запит на дзвінок і наші менеджери зателефонують як тільки автоцентр відкриється.\r\n\r\nЗалишимо запит на дзвінок?',
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
    chooseApp: 'Виберіть додаток для навігації',
    makeRoute: 'Побудувати маршрут',
    error: {
      title: 'Помилка',
      text: 'Не вдалося використати програми для навігації, спробуємо знову?',
    },
  },
  ChooseDealerScreen: {
    title: 'Виберіть автоцентр',
  },
  EkoScreen: {
    title: 'Відгуки та пропозиції',
    dealerReviews: 'Відгуки про автоцентр',
    empty: {
      text: 'Немає відгуків для відображення',
    },
  },
  ReviewAddMessageStepScreen: {
    title: 'Новий відгук',
  },
  ReviewAddMessageForm: {
    label: {
      plus: 'Що сподобалося в роботі автоцентру?',
      minus: 'Чи залишилися незадоволеними роботою автоцентру??',
    },
    placeholder: {
      plus: 'Що сподобалося в роботі автоцентру? Кому б хотілося висловити подяку?',
      minus: 'Чи залишилися незадоволеними роботою автоцентру??',
    },
  },
  ReviewAddRatingStepScreen: {
    title: 'Новий відгук',
    mainReview: 'Загальне враження',
    mainReview2: 'Наскільки в цілому ви задоволені?',
    addReview: 'Поставте оцінку нашій роботі...',
    approve: 'Я дозволяю публікувати мій відгук',
    Notifications: {
      success: {
        text: 'Відгук успішно відправлено!',
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
    button: 'Виберіть свій автоцентр',
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
    loginRequired: 'Нам потрібно знати логін, щоб відновити доступ',
    notFound: {
      text: 'Ми дуже засмучені тим, що ви не побачили свої автомобілі і бонусний рахунок в особистому кабінеті.',
      text2: 'Будь ласка, дайте нам ще один шанс!',
      caption:
        'Введіть свої дані для доступу до старої версії особистого кабінету.',
      caption2:
        'Це останній раз коли доводиться згадувати ці магічні комбінації цифр і букв для входу в особистий кабінет.',
    },
    forgotPass: "Не пам'ятаю пароль",
    findMyData: 'Знайдіть мої дані',
  },
  ProfileSettingsScreen: {
    title: 'Редагування профілю',
    Notifications: {
      error: {
        emailPhone: {
          title: 'Заповніть телефон або Email',
          text: "Будь ласка, вкажіть хоча б один контакт для можливості зв'язку з вами",
        },
      },
    },
    save: 'Зберегти',
  },
  ProfileScreenInfo: {
    empty: {
      cars: 'Поки ще не має автомобілів, про які ми знаємо...',
      whereMyCars: 'Не бачите свої авто?',
    },
    bonus: {
      title: 'Бонусний рахунок',
      text: 'Історія накопичення і витрат бонусів',
      show: 'Переглянути',
      moreInfo: 'Детальніше про бонусну програму',
      current: {
        text: 'У вас поки що',
        text2: 'балів', // 0
        text3:
          'Дізнайтеся більше про бонусну програму і накопичуйте бали швидше!',
        giveMeMore: 'Хочу більше балів',
        bonuses: 'бонусів', // 0
        bonus: 'бонус', // 1
      },
      total: 'Всього',
      empty: {
        text: 'Бонусів ще немає',
      },
    },
    cashback: {
      title: 'Cashback',
      statusText: 'Поточний статус ',
      deadline: 'Діє до ',
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
      text: 'У вас немає поточних автомобілів.',
    },
    menu: {
      service: 'Записатися на сервіс',
      history: 'Історія обслуговування',
      tocalc: 'Калькулятор ТО',
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
        wrongDealer: 'Будь ласка, переконайтеся, що у вашому кабінеті обрано автоцентр із профільною маркою.',
      },
      loading: {
        dealerConnect: 'підключення до СТО для вибору послуг',
        calculatePrice: 'вираховуємо попередню вартість',
      },
    },
    price: "Обов'язкові роботи",
    priceRecommended: 'Рекоменд.работы',
    total: 'Разом',
  },
  OrderPartsScreen: {
    title: 'Замовлення запчастин',
    title2: 'Замовити запчастини',
  },
  TvaScreen: {
    title: 'Табло видачі авто',
    carNotFound: 'Автомобіль з держ. номером ### не знайдено',
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
  SettingsScreen: {
    pushTitle: 'Хочу отримувати інформацію про акції',
    pushText: 'Будьте в курсі нових акцій та пропозицій',
    pushText2: '\r\nМи не будемо турбувати вас через дрібниці.\r\nОбіцяємо!',
    mainLanguage: 'Мова інтерфейсу',
    rateAppTitle: 'Залишити відгук на додаток',
    mailtoUs: 'Питання чи пропозиція?\r\nНапишіть нам!',
  },
  PhoneChangeScreen: {
    title: 'Залишилося\r\nзовсім трішки',
    comment:
      'Нам потрібно знати номер телефону для пошуку даних в наших корпоративних системах.\r\n\r\nМи не будемо відправляти SMS та іншу рекламу без вашого схвалення.',
    enterCode: 'Код',
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
      social: 'Соц. мережі для швидкого входу',
      date: 'Дата',
      part: 'Запасна частина',
    },
    field: {
      label: {
        dealer: 'Автоцентр',
        name: "Ім'я",
        date: 'Виберіть зручну дату',
        secondName: 'По батькові',
        lastName: 'Прізвище',
        carMileage: 'Пробіг [в кілометрах]',
        engineVolume: "Об'єм двигуна [в куб.см]",
        engineType: 'Тип двигуна',
        car: 'Виберіть бажаний автомобіль',
        car2: 'Виберіть автомобіль',
        service: 'Виберіть послугу',
        carTestDrive: 'Автомобіль для тест-драйву',
        carNameComplectation: 'Марка, модель і комплектація',
        carNameYear: 'Марка, модель і рік випуску',
        carNumber: 'Держ. номер автомобіля',
        creditSumm: 'Бажана сума кредиту',
        creditWant: 'Цікавить кредит',
        tradeinWant: 'Цікавить trade-in',
        carYourPrice: 'Ваша ціна за автомобіль',
        carBrand: 'Марка',
        carModel: 'Модель',
        carYear: 'Рік випуску',
        carVIN: 'VIN номер',
        gearbox: 'Тип КПП',
        wheel: 'Привід',
        email: 'Email',
        phone: 'Телефон',
        foto: 'Завантажте фото',
        comment: 'Коментар',
        login: 'Логін',
        pass: 'Пароль',
        birthday: 'Коли у вас день народження?',
        social: 'Додайте соц. мережі',
        part: 'Що будемо замовляти?',
      },
      placeholder: {
        dealer: 'Виберіть автоцентр',
        engineType: 'Вкажіть тип двигуна...',
        wheel: 'Укажите тип привіда...',
        comment: 'На випадок якщо потрібно передати нам більше інформації',
        gearbox: 'Виберіть коробку передач...',
        carYear: 'Виберіть рік випуску...',
        carTestDrive: 'Виберіть автомобіль для тест-драйву',
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
      receiveCode: 'Отримати код',
    },
  },
  Base: {
    or: 'чи',
    all: 'Всі',
    cancel: 'Скасувати',
    reset: 'Очистити',
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
