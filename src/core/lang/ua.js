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
      bonus: 'Бонусная программа Атлант-М',
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
    chooseDateButton: 'Выбрать дату',
    choose: 'вибрати',
    month: {
      1: 'Январь',
      2: 'Февраль',
      3: 'Март',
      4: 'Апрель',
      5: 'Май',
      6: 'Июнь',
      7: 'Июль',
      8: 'Август',
      9: 'Сентябрь',
      10: 'Октябрь',
      11: 'Ноябрь',
      12: 'Декабрь',
    },
  },
  Navigation: {
    back: 'Назад',
  },
  ChooseDateTimeComponent: {
    chooseTime: 'Выбери удобное для тебя время',
    loading: {
      timeService: 'ищем свободное время на СТО',
      timeTestDrive: 'ищем свободное время для тест-драйва',
    },
    Notifications: {
      error: {
        period: 'Нет доступных периодов, попробуй выбрать другой день',
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
    continue: 'Продолжить',
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
    action: 'Оценить мой автомобиль',
  },
  Notifications: {
    success: {
      title: 'Все вийшло!',
      titleSad: 'Мы грустим =(',
      text: 'Наши менеджеры вскоре свяжутся с тобой. Спасибо!',
      textOnline: 'Спасибо! Твоя запись оформлена, ждём!',
      textOrder:
        "Запит успішно відправлено. Наші менеджери незабаром зв'яжуться з тобою. Дякуємо!",
      textPush:
        'Ты успешно подписался на получение PUSH-уведомлений!\r\n\r\nОни не будут часто приходить, только лишь при появлении новых интересных акций.',
      textPushSad: 'Нам будет тебя не хватать...\r\nВозвращайся скорее!',
      textProfileUpdate: 'Твои данные успешно обновлены',
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
  NewCarItemScreen: {
    Notifications: {
      buyType: {
        title: 'Вариант покупки авто',
        text:
          'Хочешь забронировать авто или просто отправить запрос?\r\n\r\n' +
          'Бронирование позволит тебе гарантированно получить автомобиль, внеся небольшую предоплату.\r\n\r\n' +
          'Разумеется, эта сумма засчитывается в стоимость авто.',
      },
    },
    sendQuery: 'Отправить запрос',
    makeOrder: 'Забронировать',
    show: 'посмотреть',
    plates: {
      complectation: 'Комплектация',
      engine: 'Двигатель',
      gearbox: {
        name: 'КПП',
      },
      wheel: 'Привод',
      color: 'Цвет',
    },
    carLocation: 'Автомобиль расположен по адресу',
    tech: {
      title: 'Характеристики',
      base: 'Основные',
      year: 'Год выпуска',
      engine: {
        title: 'Двигатель',
        type: 'Тип',
        fuel: 'Топливо',
        volume: 'Рабочий объём',
        power: {
          hp: 'Мощность',
        },
      },
      gearbox: {
        title: 'Трансмиссия',
        type: 'Тип',
        count: 'Количество передач',
        wheel: 'Привод',
      },
      body: {
        title: 'Кузов',
        type: 'Тип кузова',
        width: 'Длина',
        height: 'Ширина',
        high: 'Высота',
        clirens: 'Клиренс',
        trunk: 'Объём багажника',
        fuel: 'Объём топливного бака',
      },
      interior: {
        title: 'Салон',
      },
    },
    techData: {
      title: 'Эксплуатационные характеристики',
      maxSpeed: 'Максимальная скорость',
      dispersal: 'Разгон с 0 до 100 км/ч',
      fuel: {
        city: 'Расход топлива (город)',
        track: 'Расход топлива (трасса)',
        both: 'Расход топлива (смешанный)',
      },
    },
    shortUnits: {
      litres: 'л.',
      milimetrs: 'мм.',
      hp: 'л.с.',
    },
    complectation: {
      title: 'Комплектация',
    },
    testDrive: 'тест-драйв',
    wannaCar: 'хочу это авто!',
  },
  NewCarListScreen: {
    title: 'Новые автомобили',
  },
  UserCarListScreen: {
    title: 'Подержанные автомобили',
  },
  UserCarItemScreen: {
    showFull: 'Показать полное описание...',
    showLess: 'Свернуть',
    plates: {
      mileage: 'Пробег',
    },
    creditCalculate: 'рассчитать кредит',
    myPrice: 'предложить\r\nсвою цену',
  },
  ContactsScreen: {
    closedDealer: {
      title: 'Автоцентр закрыт',
      text:
        '\r\nОставь заявку на звонок и наши менеджеры перезвонят как только автоцентр откроется.\r\n\r\nОставим заявку на звонок?',
      yes: 'Да',
      no: 'Нет',
    },
    call: 'Позвонить',
    callOrder: 'Заказать звонок',
    order: 'Заявка',
    sendOrder: 'Отправить заявку',
    site: 'Сайт',
    sites: 'Сайты',
    dealerSites: 'Сайты автоцентра',
    currentActions: 'Текущие акции автоцентра',
  },
  MapScreen: {
    apps: {
      yaNavi: 'Яндекс Навигатор',
      yaMaps: 'Яндекс Карты',
      yaTaxi: 'Яндекс Такси',
      uber: 'Uber',
      googleMaps: 'Google Карты',
      appleMaps: 'Apple Карты',
    },
    empty: {
      text: 'Нет данных для отображения карты',
    },
    chooseApp: 'Выбери приложение для навигации',
    makeRoute: 'Построить маршрут',
    error: {
      title: 'Ошибка',
      text: 'Не удалось открыть приложения для навигации, попробуем снова?',
    },
  },
  ChooseDealerScreen: {
    title: 'Выбери автоцентр',
  },
  EkoScreen: {
    title: 'Отзывы и предложения',
    dealerReviews: 'Отзывы о работе автоцентра',
  },
  ReviewAddMessageStepScreen: {
    title: 'Новый отзыв',
  },
  ReviewAddMessageForm: {
    label: {
      plus:
        'Что тебе понравилось в работе автоцентра? Кому бы ты хотел выразить благодарность?',
      minus: 'Чем ты остался недоволен в работе автоцентра?',
    },
  },
  ReviewAddRatingStepScreen: {
    title: 'Новый отзыв',
    mainReview: 'Общее впечатление',
    mainReview2: 'Насколько в целом вы удовлетворены?',
    addReview: 'Поставь оценку нашей работе...',
    Notifications: {
      success: {
        text: 'Твой отзыв успешно отправлен!',
      },
    },
  },
  ReviewsScreen: {
    title: 'Отзывы',
  },
  ReviewScreen: {
    title: 'Отзыв',
    rating: 'Рейтинг',
  },
  ReviewsFilterDateScreen: {
    title: 'Отзывы за период',
    periods: {
      all: 'все',
      week: 'неделя',
      month: 'месяц',
      year: 'год',
    },
  },
  ReviewsFilterRatingScreen: {
    title: 'Отзывы c рейтингом',
    Notifications: {
      rating: '"Рейтинг от" не может быть больше "рейтинга до"',
      rating2: '"Рейтинг до" не может быть меньше "рейтинга от"',
    },
    rating: {
      from: 'рейтинг от',
      to: 'рейтинг до',
    },
  },
  IndicatorsScreen: {
    title: 'Индикаторы',
    empty: {
      text: 'Нет индикаторов для отображения',
    },
  },
  InfoListScreen: {
    title: 'Акции',
    empty: {
      text: 'В данный момент нет акций',
    },
    refresh: 'Обновить список акций',
  },
  InfoPostScreen: {
    button: {
      callMe: 'позвоните мне',
    },
    filter: {
      from: 'с',
      to: 'по',
    },
  },
  IntroScreen: {
    button: 'Выбери свой автоцентр',
  },
  DiscountsScreen: {
    title: 'Скидки',
    empty: {
      text: 'Скидок пока нет',
    },
  },
  ReestablishScreen: {
    title: 'Вход по логину и паролю',
    fieldsRequired: 'Поля логин и пароль обязательны для заполнения',
    loginRequired: 'Нам нужно знать твой логин, чтобы восстановить доступ',
    notFound: {
      text:
        'Мы очень раздасадованы тем, что ты не обнаружил свои автомобили и бонусный счет в личном кабинете.',
      text2: 'Пожалуйста, дай нам ещё один шанс!',
      caption: 'Введи свои данные для доступа к старому личному кабинету.',
      caption2:
        'Это последний раз когда тебе придётся вспомнить эти магические комбинации цифр и букв для входа в личный кабинет.',
    },
    forgotPass: 'Не помню пароль',
    findMyData: 'Найдите мои данные',
  },
  ProfileSettingsScreen: {
    title: 'Редактирование профиля',
    Notifications: {
      error: {
        emailPhone: {
          title: 'Заполни телефон или Email',
          text:
            'Пожалуйста укажи хотя бы один контакт для возможности связи с тобой',
        },
      },
    },
    save: 'Сохранить',
  },
  ProfileScreenInfo: {
    empty: {
      cars: 'У тебя пока ещё нет автомобилей, о которых мы знаем...',
      whereMyCars: 'Не видишь свои авто?',
    },
    bonus: {
      title: 'Бонусный счёт',
      text: 'История накопления и трат твоих бонусов',
      show: 'Посмотреть',
      moreInfo: 'Подробнее о бонусной программе',
      current: {
        text: 'У тебя пока',
        text2: 'баллов', // 0
        text3: 'Узнай больше о бонусной программе и накапливай баллы быстрее!',
        giveMeMore: 'Хочу больше баллов',
      },
      total: 'Всего',
      empty: {
        text: 'Бонусов пока нет',
      },
    },
    editData: 'Редактировать данные',
    exit: 'Выйти',
  },
  ProfileScreen: {
    Notifications: {
      error: {
        phone: 'Телефон не должен быть пустым',
        phoneProvider:
          'Не опознан мобильный оператор или не правильный формат номера',
        wrongCode: 'Неверный код',
      },
    },
    approve: 'Подтвердить',
    getCode: 'Получить код',
  },
  CallMeBackScreen: {
    title: 'Перезвоните мне',
    button: 'Жду звонка',
  },
  UserCars: {
    title: 'Мои автомобили',
    current: 'текущие',
    archive: 'архив',
    archiveCheck: 'Проверим архив?',
    empty: {
      text: 'У тебя нет текущих автомобилей.',
    },
    menu: {
      history: 'История обслуживания',
      makeCurrent: 'Сделать текущим',
      addToArchive: 'Скрыть в архив',
    },
    Notifications: {
      success: {
        statusUpdate: 'Статус автомобиля изменён',
      },
    },
  },
  BonusInfoScreen: {
    title: 'Бонусная программа',
  },
  ServiceScreen: {
    title: 'Запись на сервис',
    Notifications: {
      error: {
        chooseDate: 'Необходимо выбрать дату для продолжения',
      },
    },
    button: 'Записаться!',
  },
  ServiceScreenStep1: {
    Notifications: {
      error: {
        chooseService: 'Необходимо выбрать желаемую услугу для продолжения',
      },
      loading: {
        dealerConnect: 'подключение к СТО для выбора услуг',
        calculatePrice: 'вычисляем предв.стоимость',
      },
    },
    price: 'Предв.стоимость',
  },
  OrderPartsScreen: {
    title: 'Заказ зап.частей',
    title2: 'Заказать зап.части',
  },
  TvaScreen: {
    title: 'Табло выдачи авто',
  },
  TvaResultsScreen: {
    title: 'Информация об авто',
    serviceMan: 'Мастер-приёмщик',
    time: 'Время выдачи',
    status: 'Статус',
    messageToServiceMan: 'Сообщение мастеру',
    Notifications: {
      success: {
        messageSent: 'Сообщение успешно отправлено',
      },
    },
    send: 'Отправить',
  },
  Form: {
    group: {
      main: 'Основное',
      dealer: 'Автоцентр',
      dealerCar: 'Автоцентр і автомобіль',
      car: 'Автомобіль',
      contacts: 'Контактні дані',
      foto: 'Фотографії',
      additional: 'Додатково',
      social: 'Твои соц.сети для быстрого входа',
      date: 'Дата',
      part: 'Запасная часть',
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
        car2: 'Выбери автомобиль',
        service: 'Выбери услугу',
        carTestDrive: 'Автомобіль для тест-драйву',
        carNameComplectation: 'Марка, модель і комплектація',
        carNameYear: 'Марка, модель і рік випуску',
        carNumber: 'Гос.номер автомобиля',
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
        login: 'Логин',
        pass: 'Пароль',
        birthday: 'Когда у тебя день рождения?',
        social: 'Привяжи соц.сети',
        part: 'Что будем заказывать?',
      },
      placeholder: {
        dealer: 'Вибери зручний для тебе автоцентр',
        engineType: 'Вкажи тип двигуна...',
        comment: 'На випадок якщо тобі потрібно передати нам більше інформації',
        gearbox: 'Вибери коробку передач...',
        carYear: 'Вибери рік випуску...',
        carTestDrive: 'Вибери автомобіль для тест-драйву',
        date: 'починаючи з ',
        birthday: 'Мы обязательно поздравим!',
        service: 'Что будем делать с авто?',
        part: 'Номер, название или перечень необходимых зап.частей',
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
