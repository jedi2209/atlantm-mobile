export default {
  App: {
    APIError: 'Ошибка при загрузке данных.\r\nПопробуйте позже.',
  },
  Menu: {
    main: {
      // основное меню
      autocenter: 'Автоцентр',
      autocenters: 'Автоцентры',
      actions: 'Акции',
      newcars: 'Новые авто',
      usedcars: 'Авто с пробегом',
      reviews: 'Отзывы',
      indicators: 'Индикаторы',
      settings: 'Настройки',
      notifications: 'Уведомления',
      service: 'Сервис',
      tva: 'Табло выдачи авто',
      bonus: 'Бонусная программа',
    },
    bottom: {
      // нижнее меню
      search: 'Авто',
      main: 'Главный',
      dealer: 'Автоцентр',
      lkk: 'Кабинет',
      order: 'Заявка',
      menu: 'Меню',
      chat: 'Чат',
    },
  },
  ColorBox: {
    // всплывашка с цветом на складе
    code: 'код цвета',
  },
  DatePickerCustom: {
    // выбор даты в формах
    chooseDate: 'Выберите дату',
    chooseDateButton: 'Выбрать дату',
    choose: 'выбрать',
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
    chooseTime: 'Выберите удобное для вас время',
    loading: {
      timeService: 'ищем свободное время на СТО',
      timeTestDrive: 'ищем свободное время для тест-драйва',
    },
    Notifications: {
      error: {
        period: 'Нет доступных периодов, попробуйте выбрать другой день',
      },
    },
  },
  DealerItemList: {
    // выбор автоцентра
    chooseDealer: 'Выберите удобный для вас автоцентр',
    notAvailable: 'В данном автоцентре выбранная вами услуга недоступна',
  },
  SelectItemByCountry: {
    error: {
      title: 'Ошибка',
      text: 'Не удалось получить данные по выбранному автоцентру, попробуем снова?',
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
    continue: 'Продолжить',
  },
  ModalView: {
    close: 'закрыть',
  },
  PhotoViewer: {
    errorLoad: 'Не удалось загрузить фото',
  },
  RateThisApp: {
    title: 'Нравится приложение?',
    text: 'Расскажите миру о своём опыте и оставьте свой отзыв!',
    rate: 'Оценить',
    no: 'Нет, спасибо',
    later: 'Не сейчас',
  },
  CarCostScreen: {
    title: 'Оценка моего авто',
    action: 'Оценить мой автомобиль',
    chooseFoto: 'Выбрать фото',
  },
  Notifications: {
    success: {
      title: 'Всё получилось!',
      titleSad: 'Мы грустим =(',
      text: 'Наши менеджеры вскоре свяжутся с вами. Спасибо!',
      textOnline: 'Спасибо! Ваша запись оформлена, ждём!',
      textOrder:
        'Заявка успешно отправлена. Наши менеджеры вскоре свяжутся с вами. Спасибо!',
      textPush:
        'Вы успешно подписались на получение PUSH-уведомлений!\r\n\r\nОни не будут часто приходить, только лишь при появлении новых интересных акций.',
      textPushSad: 'Нам будет вас не хватать...\r\nВозвращайтесь скорее!',
      textProfileUpdate: 'Ваши данные успешно обновлены',
      copy: 'Успешно скопировано!',
    },
    error: {
      title: 'Хьюстон, у нас проблемы...',
      title2: 'Упс...',
      text: 'Произошла ошибка, попробуем снова?',
    },
    UpdatePopup: {
      title: 'Есть свежая версия! 🏎',
      text: 'Пожалуйста, обновите приложение до актуальной версии.',
      update: 'Обновить',
      later: 'Позже',
    },
    PushAlert: {
      title: 'Уведомления выключены',
      text: 'Необходимо разрешить получение push-уведомлений для приложения Атлант-М в настройках',
      later: 'Позже',
      approve: 'Разрешить',
    },
  },
  CarList: {
    emptyMessage: 'Нет автомобилей для отображения',
    badges: {
      specialPrice: 'спец.цена',
      ordered: ['', 'в резерве', 'продан'],
    },
    price: {
      byRequest: 'Цена по запросу',
    },
  },
  OrderCreditScreen: {
    title: 'Заявка на кредит',
    analog: 'или аналог',
  },
  OrderMyPriceScreen: {
    title: 'Предложите свою цену',
  },
  OrderScreen: {
    title: 'Заявка на авто',
    titleSimiliar: 'Заявка на похожее авто',
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
  NewCarItemScreen: {
    Notifications: {
      buyType: {
        title: 'Вариант покупки авто',
        text:
          'Хотите забронировать авто или просто отправить запрос?\r\n\r\n' +
          'Бронирование позволит вам гарантированно получить автомобиль, внеся небольшую предоплату.\r\n\r\n' +
          'Разумеется, эта сумма засчитывается в стоимость авто.',
      },
    },
    sendQuery: 'Отправить запрос',
    makeOrder: 'Забронировать',
    show: 'посмотреть',
    plates: {
      complectation: 'Комплектация',
      mileage: 'Пробег',
      engine: 'Двигатель',
      gearbox: {
        name: 'КПП',
      },
      wheel: 'Привод',
      color: 'Цвет',
    },
    warranty: 'Гарантия',
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
        torque: 'Макс.крутящий момент',
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
      year: 'г.в.',
      torque: 'Нм',
      speed: 'км/ч',
    },
    complectation: {
      title: 'Комплектация',
      main: 'Заводская комплектация',
      additional: 'Дополнительные опции',
    },
    testDrive: 'Тест-драйв',
    wannaCar: 'Хочу это авто!',
  },
  NewCarListScreen: {
    title: 'Новые автомобили',
    titleShort: 'Новые',
  },
  CarsFilterScreen: {
    title: 'Параметры',
    chooseBrandModel: {
      title: 'Марка и модель',
      title2: 'Выберите марку и модель',
      titles: ['модель', 'модели', 'моделей'],
    },
    resultsButton: {
      show: 'Показать',
    },
    price: 'Цена',
    brands: 'Бренды',
    models: 'Модели',
    notFound: 'Нет предложений',
    filters: {
      city: {
        title: 'Город',
      },
      year: {
        title: 'Год выпуска',
        from: 'от',
        to: 'до',
      },
      mileage: {
        title: 'Пробег, км.',
      },
      price: {
        title: 'Цена',
        nds: 'НДС 20%',
        special: 'Спец.цена',
      },
      power: {
        title: 'Мощность, л.с',
      },
      engineVolume: {
        title: 'Объем двигателя, л.',
      },
      gearbox: {
        title: 'Коробка передач',
      },
      body: {
        title: 'Кузов',
      },
      enginetype: {
        title: 'Тип двигателя',
      },
      drive: {
        title: 'Привод',
      },
      guarantee: {
        title: 'На гарантии',
      },
      breakInsurance: {
        title: 'Застрахован от поломок',
      },
      fullServiceHistory: {
        title: 'Полная сервисная история',
      },
      onlineOrder: {
        title: 'Можно забронировать онлайн',
      },
      colors: {
        title: 'Цвет',
      },
    },
  },
  Sort: {
    title: 'Сортировать по',
    price: {
      asc: 'Возрастанию цены',
      desc: 'Убыванию цены',
    },
    date: {
      desc: 'Дате размещения',
    },
    year: {
      desc: 'Году: новее',
      asc: 'Году: старше',
    },
    mileage: {
      asc: 'Пробегу',
    },
  },
  UsedCarListScreen: {
    title: 'Авто с пробегом',
    titleShort: 'С пробегом',
  },
  UsedCarItemScreen: {
    showFull: 'Показать полное описание...',
    showLess: 'Свернуть',
    creditCalculate: 'рассчитать\r\nкредит',
    myPrice: 'предложить\r\nсвою цену',
  },
  UsedCarFilterScreen: {
    city: 'Город',
    apply: 'Применить',
  },
  FullScreenGallery: {
    from: 'из',
  },
  ContactsScreen: {
    closedDealer: {
      title: 'Автоцентр закрыт',
      text: '\r\nОставьте заявку на звонок и наши менеджеры перезвонят как только автоцентр откроется.\r\n\r\nОставим заявку на звонок?',
      yes: 'Да',
      no: 'Нет',
    },
    emergencyManager: {
      title: 'Аварийный менеджер Атлант-М',
      subTitle: 'комплексная помощь при ДТП 24/7',
    },
    chat: {
      title: 'Чат',
      subTitle: 'Отвечаем с 8 до 20',
    },
    timework: 'часы работы',
    timework2: 'Время работы',
    navigate: 'Построить маршрут',
    address: 'Адрес',
    call: 'Позвонить',
    callOrder: 'Заказать звонок',
    order: 'Заявка',
    sendOrder: 'Отправить заявку',
    site: 'Сайт',
    sites: 'Сайты',
    dealerSites: 'Сайты автоцентра',
    currentActions: 'Текущие акции автоцентра',
    socialNetworks: {
      title: 'Будем на связи!',
      subtitle: 'cоц.сети и мессенджеры',
    },
  },
  WorkTimeScreen: {
    weeekdayShort: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
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
    chooseApp: 'Выберите приложение для навигации',
    makeRoute: 'Построить маршрут',
    error: {
      title: 'Ошибка',
      text: 'Не удалось открыть приложения для навигации, попробуем снова?',
    },
  },
  ChatScreen: {
    title: 'Онлайн чат',
  },
  ChooseDealerScreen: {
    title: 'Выберите автоцентр',
  },
  EkoScreen: {
    title: 'Отзывы и предложения',
    dealerReviews: 'Отзывы о работе автоцентра',
    empty: {
      text: 'Нет отзывов для отображения',
    },
  },
  ReviewAddMessageStepScreen: {
    title: 'Новый отзыв',
  },
  ReviewAddMessageForm: {
    label: {
      plus: 'Что вам понравилось в работе автоцентра?',
      minus: 'Чем вы остались недовольны в работе автоцентра?',
    },
    placeholder: {
      plus: 'Что вам понравилось в работе автоцентра? Кому бы вы хотели выразить благодарность?',
      minus: 'Чем вы остались недоволен в работе автоцентра?',
    },
  },
  ReviewAddRatingStepScreen: {
    title: 'Новый отзыв',
    mainReview: 'Общее впечатление',
    mainReview2: 'Насколько вы удовлетворены?',
    addReview: 'Поставьте оценку нашей работе...',
    approve: 'Я разрешаю опубликовать мой отзыв',
    Notifications: {
      success: {
        text: 'Ваш отзыв успешно отправлен!',
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
  ReviewDealerAnswer: {
    dealerAnswer: 'Ответ автоцентра',
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
      from: 'от',
      to: 'до',
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
      actionFinished: 'Акция завершена!',
    },
    filter: {
      from: 'с',
      to: 'по',
    },
  },
  IntroScreen: {
    button: 'Выберите свой автоцентр',
    chooseRegion: 'Выберите ваш регион',
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
    loginRequired: 'Нам нужно знать ваш логин, чтобы восстановить доступ',
    notFound: {
      text: 'Мы очень раздасадованы тем, что вы не обнаружили свои автомобили и бонусный счет в личном кабинете.',
      text2: 'Пожалуйста, дайте нам ещё один шанс!',
      caption: 'Введите свои данные для доступа к старому личному кабинету.',
      caption2:
        'Это последний раз когда вам придётся вспомнить эти магические комбинации цифр и букв для входа в личный кабинет.',
    },
    forgotPass: 'Не помню пароль',
    findMyData: 'Найдите мои данные',
  },
  ProfileSettingsScreen: {
    title: 'Редактирование профиля',
    Notifications: {
      error: {
        emailPhone: {
          title: 'Заполните телефон или Email',
          text: 'Пожалуйста укажите хотя бы один контакт для возможности связи с вами',
        },
      },
      deleteAccount: {
        title: 'Вы уверены?',
        text: 'Ваш аккаунт будет безвозвратно удалён со всей информацией.\r\n\r\nВосстановить удалённые данные невозможно.',
      },
    },
    save: 'Сохранить',
    deleteAccount: 'Удалить профиль',
  },
  CarInfoScreen: {
    title: 'Информация об автомобиле',
  },
  ProfileScreenInfo: {
    empty: {
      cars: 'У вас пока ещё нет автомобилей, о которых мы знаем...',
      whereMyCars: 'Не видите свои авто?',
    },
    bonus: {
      title: 'Бонусный счёт',
      text: 'История накопления и трат ваших бонусов',
      show: 'Посмотреть',
      moreInfo: 'Подробнее о бонусной программе',
      current: {
        text: 'У вас пока',
        text2: 'баллов', // 0
        text3:
          'Узнайте больше о бонусной программе и накапливайте баллы быстрее!',
        giveMeMore: 'Хочу больше баллов',
        bonuses: 'бонусов', // 0
        bonus: 'бонус', // 1
      },
      total: 'Всего',
      empty: {
        text: 'Бонусов пока нет',
      },
    },
    cashback: {
      title: 'Cashback',
      statusText: 'Текущий статус ',
      deadline: 'Действует до ',
    },
    additionalPurchase: {
      title: 'Покупки',
      text: 'История ваших покупок в автоцентрах Атлант-М',
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
    restrictedPhone:
      'К сожалению вы не можете авторизоваться по этому номеру телефона',
  },
  CallMeBackScreen: {
    title: 'Перезвоните мне',
    button: 'Жду звонка',
  },
  UserCars: {
    title: 'Мои автомобили',
    current: 'текущие',
    archive: 'архив',
    intoArchive: 'в архиве',
    archiveCheck: 'Проверим архив?',
    empty: {
      text: 'У вас нет текущих автомобилей.',
    },
    menu: {
      service: 'Записаться на сервис',
      history: 'История обслуживания',
      tocalc: 'Калькулятор ТО',
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
  AdditionalPurchaseScreen: {
    title: 'Мои покупки',
    tabs: {
      cars: 'Автомобили',
      additionalPurchase: 'Покупки',
      insurance: 'Страховки',
    },
  },
  ServiceScreen: {
    title: 'Запись на сервис',
    Notifications: {
      error: {
        chooseDate: 'Необходимо выбрать дату для продолжения',
      },
    },
    works: {
      service: 'Техническое обслуживание',
      tyreChange: 'Шиномонтаж',
      carWash: 'Мойка',
      other: 'Прочий сервис',
    },
    worksService: {
      service: 'Сервис',
      tyreChange: 'Замена шин',
      wheelChange: 'Замена колёс',
      tyreRepair: 'Ремонт шин',
      carWash: 'Мойка',
      other: 'Прочий сервис',
    },
    works2: {
      tyreChange: [
        {
          label: 'Замена колёс',
          value: 'wheelChange',
          key: 'wheelChange',
        },
        {
          label: 'Замена шин',
          value: 'tyreChange',
          key: 'tyreChange',
        },
        {
          label: 'Ремонт шин',
          value: 'tyreRepair',
          key: 'tyreRepair',
        },
      ],
    },
    button: 'Записаться!',
  },
  ServiceScreenStep1: {
    Notifications: {
      error: {
        chooseService: 'Необходимо выбрать желаемую услугу для продолжения',
        wrongDealer:
          'Пожалуйста, убедитесь, что в вашем кабинете выбран автоцентр с профильной маркой.',
        noData:
          'Калькулятор ТО недоступен сейчас для этого автомобиля.\r\nВозможно данные ещё не готовы, или вы указали неверный автоцентр.',
        noDataCar:
          'Калькулятор ТО недоступен сейчас для этого автомобиля.\r\nМы работаем над тем, чтобы исправить ситуацию.',
      },
      loading: {
        dealerConnect: 'подключение к СТО для выбора услуг',
        calculatePrice: 'вычисляем предв.стоимость',
      },
    },
    price: 'Обязательные работы',
    priceRecommended: 'Рекоменд.работы',
    total: 'Итого',
  },
  OrderPartsScreen: {
    title: 'Заказ зап.частей',
    title2: 'Заказать зап.части',
  },
  TvaScreen: {
    title: 'Табло выдачи авто',
    carNotFound: 'Автомобиль с гос.номером ### не найден',
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
  },
  SettingsScreen: {
    pushTitle: 'Хочу получать информацию об акциях',
    pushText: 'Будьте в курсе новых акций и предложений.',
    pushText2: '\r\nМы не будем беспокоить вас по пустякам.\r\nОбещаем!',
    mainLanguage: 'Язык интерфейса',
    rateAppTitle: 'Оставьте отзыв о приложении',
    rateAppTitleTwoRows: 'Оставьте отзыв\nо приложении',
    mailtoUs: 'Вопрос или пожелание?\r\nНапишите нам!',
    regionChange: 'Изменить регион',
  },
  PhoneChangeScreen: {
    title: 'Осталось\r\nчуть-чуть',
    isLoading: 'Входим в личный кабинет...',
    comment:
      'Нам нужно знать ваш телефон, чтобы найти все ваши данные в наших корпоративных системах.\r\n\r\nМы никогда не будем отправлять SMS и другую рекламу без вашего одобрения.',
    enterCode: 'Код',
  },
  Form: {
    group: {
      main: 'Основное',
      dealer: 'Автоцентр',
      services: 'Услуги',
      dealerCar: 'Автоцентр и автомобиль',
      car: 'Автомобиль',
      contacts: 'Контактные данные',
      foto: 'Фотографии',
      additional: 'Дополнительно',
      social: 'Ваши соц.сети для быстрого входа',
      date: 'Дата',
      part: 'Запасная часть',
    },
    field: {
      label: {
        dealer: 'Автоцентр',
        name: 'Имя',
        date: 'Выберите удобную для вас дату',
        secondName: 'Отчество',
        lastName: 'Фамилия',
        carMileage: 'Пробег [в км.]',
        engineVolume: 'Объём двигателя [в куб.см]',
        engineType: 'Тип двигателя',
        car: 'Выберите желаемый автомобиль',
        car2: 'Выберите автомобиль',
        service: 'Выберите услугу',
        serviceSecond: 'Выберите вид работ',
        carTestDrive: 'Автомобиль для тест-драйва',
        carNameComplectation: 'Марка, модель и комплектация',
        carNameYear: 'Марка, модель и год выпуска',
        carNumber: 'Гос.номер автомобиля',
        creditSumm: 'Желаемая сумма кредита',
        creditWant: 'Хочу в кредит',
        tradeinWant: 'У меня есть авто в зачёт',
        carYourPrice: 'Ваша стоимость за автомобиль',
        carBrand: 'Марка',
        carModel: 'Модель',
        carYear: 'Год выпуска',
        carVIN: 'VIN номер',
        gearbox: 'Тип КПП',
        wheel: 'Привод',
        email: 'Email',
        phone: 'Телефон',
        foto: 'Прикрепи фото',
        comment: 'Комментарий',
        login: 'Логин',
        pass: 'Пароль',
        birthday: 'Когда у вас день рождения?',
        social: 'Привяжи соц.сети',
        part: 'Что будем заказывать?',
        serviceTypes: {
          tyreChange: {
            title: 'Шиномонтаж',
            subtitle: 'Выберите услуги',
            second: 'Выберите размер ваших шин',
            additional: 'Дополнительно',
            myTyresInStorage: 'Мои шины у вас',
            leaveTyresInStorage: 'Оставить шины на хранение',
          },
          carWash: {
            title: 'Мойка',
            subtitle: 'Выберите услуги',
            second: 'Выберите тип мойки',
            additional: 'Дополнительно',
          },
        },
      },
      placeholder: {
        dealer: 'Выберите удобный для вас автоцентр',
        engineType: 'Укажите тип двигателя...',
        wheel: 'Укажите тип привода...',
        comment:
          'На случай если вам потребуется передать нам больше информации',
        gearbox: 'Выберите коробку передач...',
        carYear: 'Выберите год выпуска...',
        carTestDrive: 'Выберите автомобиль для тест-драйва',
        date: 'начиная с ',
        birthday: 'Мы обязательно поздравим!',
        service: 'Что будем делать с авто?',
        part: 'Номер, название или перечень необходимых зап.частей',
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
      fieldsRequired1: 'Поля',
      fieldsRequired2: 'обязательны для заполнения',
      fieldRequired1: 'Поле',
      fieldRequired2: 'обязательно для заполнения',
      fieldRequiredMiss: 'Не заполнены обязательные поля',
    },
    button: {
      send: 'Отправить',
      sending: 'Отправляем...',
      receiveCode: 'Получить код',
      nextToDate: 'Далее к выбору даты',
      next: 'Далее',
    },
    agreement: {
      title: 'Пользовательское соглашение',
      fieldName: 'Условия обработки персональных данных',
      first: 'Я подтверждаю своё ознакомление с',
      second: 'условиями обработки персональных данных',
      third: 'и выражаю согласие на обработку персональных данных',
    },
  },
  Base: {
    or: 'или',
    all: 'Все',
    cancel: 'Отмена',
    reset: 'Сброс',
    choose: 'Выбрать',
    ok: 'OK',
    repeat: 'Повторить',
  },
  CarParams: {
    engine: {
      1: 'Бензин',
      2: 'Дизель',
      3: 'Гибрид',
      4: 'Электро',
      9: 'Бензиновый, Газ',
      12: 'Газ',
    },
    gearbox: {
      1: 'Механическая',
      4: 'Автоматическая',
      11: 'DSG',
      12: 'Робот',
      13: 'Вариатор',
      14: 'Редуктор',
    },
    body: {
      1: 'Хетчбэк',
      2: 'Седан',
      3: 'Универсал',
      4: 'Купе',
      5: 'Кабриолет',
      6: 'Минивэн',
      7: 'Фургон',
      8: 'Пикап',
      9: 'Внедорожник',
      10: 'Кроссовер',
      11: 'Микроавтобус',
      12: 'Лифтбэк',
      13: 'Шасси',
      14: 'Автобус',
    },
    wheels: {
      1: 'Полный',
      3: 'Задний',
      4: 'Передний',
    },
    statusDelivery: {
      2: 'На складе',
      5: 'В производстве',
      8: 'В пути',
      14: 'Комиссия',
      12: 'Продан',
    },
  },
  Colors: {
    28: 'Бежевый',
    13: 'Белый',
    101: 'Бордовый',
    1028: 'Бронзовый',
    174: 'Голубой',
    37: 'Желтый',
    121: 'Зеленый',
    355: 'Золотистый',
    289: 'Коричневый',
    55: 'Красный',
    31: 'Оранжевый',
    327: 'Розовый',
    1181: 'Салатовый',
    144: 'Серебристый',
    4: 'Серый',
    216: 'Синий',
    268: 'Фиолетовый',
    5: 'Черный',
  },
};
