import {createStackNavigator} from 'react-navigation-stack';
// import Animated, {Easing} from 'react-native-reanimated';
import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator';

// global
import IntroScreen from '../intro/containers/IntroScreen';
import ChooseDealerScreen from '../dealer/containers/ChooseDealerScreen';
import BottomTabNavigation from '../menu/containers/BottomTabNavigation';
// import ServiceScreen from '../service/containers/ServiceScreen';
import OrderPartsScreen from '../service/containers/OrderPartsScreen';
import ServiceContainer from '../service/containers/ServiceContainer';
import ServiceScreenNewStep2 from '../service/containers/OnlineService/ServiceScreenNewStep2';
import CarCostScreen from '../catalog/carcost/containers/CarCostScreen';
import IndicatorsScreen from '../indicators/containers/IndicatorsScreen';
import SettingsScreen from '../settings/containers/SettingsScreen';

// tva
import TvaScreen from '../tva/containers/TvaScreen';
import TvaResultsScreen from '../tva/containers/TvaResultsScreen';

// eko
import ReviewsScreen from '../eko/reviews/containers/ReviewsScreen';
import ReviewScreen from '../eko/reviews/containers/ReviewScreen';
import ReviewsFilterDateScreen from '../eko/reviews/containers/ReviewsFilterDateScreen';
import ReviewsFilterRatingScreen from '../eko/reviews/containers/ReviewsFilterRatingScreen';
import ReviewAddMessageStepScreen from '../eko/reviews/containers/ReviewAddMessageStepScreen';
import ReviewAddRatingStepScreen from '../eko/reviews/containers/ReviewAddRatingStepScreen';

import CallMeBackScreen from '../profile/containers/CallMeBackScreen';
import NewCarItemScreen from '../catalog/newcar/containers/NewCarItemScreen';
import NewCarFilterScreen from '../catalog/newcar/containers/NewCarFilterScreen';
import UsedCarItemScreen from '../catalog/usedcar/containers/UsedCarItemScreen';
import UsedCarFilterScreen from '../catalog/usedcar/containers/UsedCarFilterScreen';
import MapScreen from '../contacts/map/containers/MapScreen';

import OrderScreen from '../catalog/containers/OrderScreen';
import OrderTestDriveScreen from '../catalog/containers/OrderTestDriveScreen';
import TestDriveScreen from '../catalog/containers/TestDriveScreen';
import OrderMyPriceScreen from '../catalog/containers/OrderMyPriceScreen';
import OrderCreditScreen from '../catalog/containers/OrderCreditScreen';

import ReestablishScreen from '../profile/containers/ReestablishScreen';

export const getRouter = (initialRouteName) => {
  return createStackNavigator(
    {
      MapScreen: {
        screen: MapScreen,
      },
      NewCarItemScreen: {screen: NewCarItemScreen},
      NewCarFilterScreen: {
        screen: NewCarFilterScreen,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
      UsedCarItemScreen: {screen: UsedCarItemScreen},
      UsedCarFilterScreen: {
        screen: UsedCarFilterScreen,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
      ReestablishScreen: {screen: ReestablishScreen},
      IntroScreen: {screen: IntroScreen}, // это скрин с кнопкой Выбери автосервис
      BottomTabNavigation: {screen: BottomTabNavigation}, // это нижнее меню
      ChooseDealerScreen: {screen: ChooseDealerScreen}, // выбор диллера скрин
      ServiceScreen: {screen: ServiceContainer}, // заявка на СТО
      ServiceScreenStep2: {screen: ServiceScreenNewStep2}, // заявка на СТО - выбор даты
      OrderPartsScreen: {screen: OrderPartsScreen}, // заявка на зап.части
      CallMeBackScreen: {screen: CallMeBackScreen},
      CarCostScreen: {screen: CarCostScreen},
      IndicatorsScreen: {screen: IndicatorsScreen}, // индикаторы
      // табло выдачи автомобиля
      TvaScreen: {screen: TvaScreen},
      TvaResultsScreen: {screen: TvaResultsScreen},
      // это вроде отзывы
      Eko2Screen: {
        screen: createStackNavigator({
          ReviewsScreen: {screen: ReviewsScreen},
          ReviewScreen: {screen: ReviewScreen},
          ReviewsFilterDateScreen: {screen: ReviewsFilterDateScreen},
          ReviewsFilterRatingScreen: {screen: ReviewsFilterRatingScreen},
          ReviewAddMessageStepScreen: {screen: ReviewAddMessageStepScreen},
          ReviewAddRatingStepScreen: {screen: ReviewAddRatingStepScreen},
        }),
        navigationOptions: {
          header: null,
        },
      },
      OrderScreen: {screen: OrderScreen},
      TestDriveScreen: {screen: TestDriveScreen},
      OrderTestDriveScreen: {screen: OrderTestDriveScreen},
      OrderMyPriceScreen: {screen: OrderMyPriceScreen},
      OrderCreditScreen: {
        screen: OrderCreditScreen,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
      SettingsScreen: {screen: SettingsScreen},
    },
    {
      initialRouteName,
      transitionConfig: () => ({
        screenInterpolator: (sceneProps) => {
          // Disable the transition animation when resetting to the home screen.
          return sceneProps.scene.route.routeName === 'BottomTabNavigation'
            ? StackViewStyleInterpolator.forFadeFromBottomAndroid(sceneProps)
            : StackViewStyleInterpolator.forHorizontal(sceneProps);
        },
      }),
    },
  );
};
