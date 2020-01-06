import {createStackNavigator} from 'react-navigation-stack';

// global
import IntroScreen from '../intro/containers/IntroScreen';
import ChooseDealerScreen from '../dealer/containers/ChooseDealerScreen';
import BottomTabNavigation from '../menu/containers/BottomTabNavigation';
import ServiceScreen from '../service/containers/ServiceScreen';
import IndicatorsScreen from '../indicators/containers/IndicatorsScreen';

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
import UsedCarItemScreen from '../catalog/usedcar/containers/UsedCarItemScreen';

export const getRouter = initialRouteName => {
  return createStackNavigator(
    {
      NewCarItemScreen: {screen: NewCarItemScreen},
      UsedCarItemScreen: {screen: UsedCarItemScreen},
      IntroScreen: {screen: IntroScreen}, // этоо скрин с кнопкой выберите автосервис
      BottomTabNavigation: {screen: BottomTabNavigation}, // это нижнее меню
      ChooseDealerScreen: {screen: ChooseDealerScreen}, // выбор диллера скрин
      ServiceScreen: {screen: ServiceScreen}, // заявка на СТО
      CallMeBackScreen: {screen: CallMeBackScreen},
      IndicatorsScreen: {screen: IndicatorsScreen}, // индикаторы
      // хз что за экран он используется еще где-то?
      Tva2Screen: {
        screen: createStackNavigator({
          TvaScreen: {screen: TvaScreen},
          TvaResultsScreen: {screen: TvaResultsScreen},
        }),
        navigationOptions: {
          header: null,
        },
      },
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
    },
    {
      initialRouteName,
    },
  );
};
