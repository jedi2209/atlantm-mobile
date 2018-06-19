# Приложение Atlant-m

Требуется наличие fastlane для выгрузки в маркеты

Установка fastlane для MacOS через brew: brew cask install fastlane

# Команды для сборки

Выгрузка в TestFlight: `npm run ios-build` / `npm run ios-release`
Выгрузка в Google Play: `npm run android-build` / `npm run android-release`

Изменение версии происходит исключительно через `npm version [major | minor | patch]`


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
- Внедрить единую систему обработки ошибок
- Обработка ошибок ввиду `Network request failed`
- Сделать обертку вокруг `DatePicker`
- Сделат компонент на основе `PricePicker`, проверить необходимость `onPressModal`

