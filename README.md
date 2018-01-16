# Приложение Atlant-m

## Решение проблем со сборкой

### Android

1. Приложение падает если одновременно используется react-native-maps и react-native-device-info

Решение:

https://github.com/airbnb/react-native-maps/issues/1300

## TODO:
- вынести в один компонент AboutScreen и AboutDealerScreen
- вынести в один компонент Flatlist с pull-to-refresh и infinity scroll
- попробовать добавить areStateEquals в connect
https://medium.com/@jidefr/the-most-unknown-redux-performance-trick-986fdfe871fa
- Обновиться до react-navigation beta 20
- Поддержать iphone x
- Еко: если нет отзывов в массив нет выбранного дилера, а должен быть всегда, смотри actions.js
- Разобраться с react-native-debugger, отключить redux-logger
- Переделать все места, где что-то вложено внутрь Image (для обновления 0.51)
- Заиспользовать везде FooterButton
- Всегда при попытка обратиться к API проверять наличие соединения и реагировать в этом случае соответствующим сообщением
- Разобраться со списками в android, рисовать бордер если элемент `last`
- Перейти везде на async/await в actions
- Прокинуть в компонент DealerItemList параметр `isGoBack`
- Внедрить единую систему обработки ошибок
- Обработка ошибок ввиду `Network request failed`
