import { StackNavigator } from 'react-navigation';

// global
import IntroScreen from '../intro/containers/IntroScreen';
import ChooseDealerScreen from '../dealer/containers/ChooseDealerScreen';
import MenuScreen from '../menu/containers/MenuScreen';
import ServiceScreen from '../service/containers/ServiceScreen';
import IndicatorsScreen from '../indicators/containers/IndicatorsScreen';

// profile
import ProfileScreen from '../profile/containers/ProfileScreen';
import RegisterScreen from '../profile/containers/RegisterScreen';
import BonusScreen from '../profile/bonus/containers/BonusScreen';
import DiscountsScreen from '../profile/discounts/containers/DiscountsScreen';
import CarHistoryScreen from '../profile/carhistory/containers/CarHistoryScreen';
import CarHistoryDetailsScreen from '../profile/carhistory/containers/CarHistoryDetailsScreen';

// contacts
import ContactsScreen from '../contacts/containers/ContactsScreen';
import AboutScreen from '../contacts/about/containers/AboutScreen';
import MapScreen from '../contacts/map/containers/MapScreen';
import ReferenceScreen from '../contacts/reference/containers/ReferenceScreen';
import AboutHoldingScreen from '../contacts/aboutholding/containers/AboutHoldingScreen';

// info
import InfoListScreen from '../info/containers/InfoListScreen';
import InfoPostScreen from '../info/containers/InfoPostScreen';

// catalog
import CatalogScreen from '../catalog/containers/CatalogScreen';
import AboutDealerScreen from '../catalog/containers/AboutDealerScreen';
import OrderScreen from '../catalog/containers/OrderScreen';
import UsedCarListScreen from '../catalog/usedcar/containers/UsedCarListScreen';
import UsedCarItemScreen from '../catalog/usedcar/containers/UsedCarItemScreen';
import UsedCarCityScreen from '../catalog/usedcar/containers/UsedCarCityScreen';
import NewCarFilterScreen from '../catalog/newcar/containers/NewCarFilterScreen';
import NewCarFilterBrandsScreen from '../catalog/newcar/containers/NewCarFilterBrandsScreen';
import NewCarFilterModelsScreen from '../catalog/newcar/containers/NewCarFilterModelsScreen';
import NewCarFilterBodyScreen from '../catalog/newcar/containers/NewCarFilterBodyScreen';
import NewCarFilterGearboxScreen from '../catalog/newcar/containers/NewCarFilterGearboxScreen';
import NewCarFilterEngineTypeScreen from '../catalog/newcar/containers/NewCarFilterEngineTypeScreen';
import NewCarFilterDriveScreen from '../catalog/newcar/containers/NewCarFilterDriveScreen';
import NewCarListScreen from '../catalog/newcar/containers/NewCarListScreen';
import NewCarItemScreen from '../catalog/newcar/containers/NewCarItemScreen';
import NewCarCityScreen from '../catalog/newcar/containers/NewCarCityScreen';
import CarCostScreen from '../catalog/carcost/containers/CarCostScreen';

// tva
import TvaScreen from '../tva/containers/TvaScreen';
import TvaResultsScreen from '../tva/containers/TvaResultsScreen';

// eko
// import EkoScreen from '../eko/containers/EkoScreen';
import ReviewsScreen from '../eko/reviews/containers/ReviewsScreen';
import ReviewScreen from '../eko/reviews/containers/ReviewScreen';
import ReviewsFilterDateScreen from '../eko/reviews/containers/ReviewsFilterDateScreen';
import ReviewsFilterRatingScreen from '../eko/reviews/containers/ReviewsFilterRatingScreen';
import ReviewAddMessageStepScreen from '../eko/reviews/containers/ReviewAddMessageStepScreen';
import ReviewAddRatingStepScreen from '../eko/reviews/containers/ReviewAddRatingStepScreen';

const CatalogScreenNavigator = StackNavigator({
  CatalogScreen: { screen: CatalogScreen },
  AboutDealerScreen: { screen: AboutDealerScreen },
  OrderScreen: { screen: OrderScreen },
  UsedCarListScreen: { screen: UsedCarListScreen },
  UsedCarItemScreen: { screen: UsedCarItemScreen },
  UsedCarCityScreen: { screen: UsedCarCityScreen },
  NewCarFilterScreen: { screen: NewCarFilterScreen },
  NewCarFilterBrandsScreen: { screen: NewCarFilterBrandsScreen },
  NewCarFilterModelsScreen: { screen: NewCarFilterModelsScreen },
  NewCarFilterBodyScreen: { screen: NewCarFilterBodyScreen },
  NewCarFilterGearboxScreen: { screen: NewCarFilterGearboxScreen },
  NewCarFilterEngineTypeScreen: { screen: NewCarFilterEngineTypeScreen },
  NewCarFilterDriveScreen: { screen: NewCarFilterDriveScreen },
  NewCarListScreen: { screen: NewCarListScreen },
  NewCarItemScreen: { screen: NewCarItemScreen },
  NewCarCityScreen: { screen: NewCarCityScreen },
  CarCostScreen: { screen: CarCostScreen },
});

const removeDuplicateRoutes = (state) => {
  if (!state.routes) return state

  let duplicateRoutesCount = 0

  const routes = state.routes.reduce((out, route, index) => {
    const cleanRoute = removeDuplicateRoutes(route)

    if (!index) {
      out.push(cleanRoute)
    } else {
      const prevIndex = index - 1
      const prevRouteName = out[prevIndex].routeName
      if (prevRouteName === route.routeName) {
        ++duplicateRoutesCount
        out[prevIndex] = cleanRoute
      } else {
        out.push(cleanRoute)
      }
    }

    return out
  }, [])

  // don't clone state, we want to keep references intact (at least at the top
  // level)
  state.routes = routes
  state.index -= duplicateRoutesCount

  return state
};

const defaultGetStateForAction = CatalogScreenNavigator.router.getStateForAction;
CatalogScreenNavigator.router.getStateForAction = (action, state) => {
  // console.log('action', action);
  // console.log('state', state);

  // if (state && action && action.routeName === 'UsedCarCityScreen') {
  //   console.log('state.routes[1].routes', state.routes[1].routes);
  //   state.routes[1].routes = state.routes[1].routes.filter(route => {
  //     console.log('route', route);
  //     // return route.routeName !== 'UsedCarListScreen';
  //     return true;
  //   });
  // }

  // if (state) {
  //   console.log('before', state);
  //   let newState = { ...state };
  //   newState = removeDuplicateRoutes(state);
  //   console.log('after', newState);
  // }

  // console.log('action', action);
  // console.log('state', state);

  // this.props.navigationChange(action.routeName ? action.routeName : mainScreen);
  return defaultGetStateForAction(action, state);
};

const getRouter = initialRouteName => {
  return StackNavigator(
    {
      IntroScreen: { screen: IntroScreen },
      MenuScreen: { screen: MenuScreen },
      ChooseDealerScreen: { screen: ChooseDealerScreen },
      ContactsScreen: {
        screen: StackNavigator({
          ContactsScreen: { screen: ContactsScreen },
          AboutScreen: { screen: AboutScreen },
          MapScreen: { screen: MapScreen },
          ReferenceScreen: { screen: ReferenceScreen },
          AboutHoldingScreen: { screen: AboutHoldingScreen },
        }),
        navigationOptions: {
          header: null,
        },
      },
      InfoListScreen: {
        screen: StackNavigator({
          InfoListScreen: { screen: InfoListScreen },
          InfoPostScreen: { screen: InfoPostScreen },
        }),
        navigationOptions: {
          header: null,
        },
      },
      Profile2Screen: {
        screen: StackNavigator({
          ProfileScreen: { screen: ProfileScreen },
          RegisterScreen: { screen: RegisterScreen },
          BonusScreen: { screen: BonusScreen },
          DiscountsScreen: { screen: DiscountsScreen },
          CarHistoryScreen: { screen: CarHistoryScreen },
          CarHistoryDetailsScreen: { screen: CarHistoryDetailsScreen },
        }),
        navigationOptions: {
          header: null,
        },
      },
      ServiceScreen: { screen: ServiceScreen },
      IndicatorsScreen: { screen: IndicatorsScreen },
      Catalog2Screen: {
        screen: CatalogScreenNavigator,
        navigationOptions: {
          header: null,
        },
      },
      Tva2Screen: {
        screen: StackNavigator({
          TvaScreen: { screen: TvaScreen },
          TvaResultsScreen: { screen: TvaResultsScreen },
        }),
        navigationOptions: {
          header: null,
        },
      },
      Eko2Screen: {
        screen: StackNavigator({
          // EkoScreen: { screen: EkoScreen },
          ReviewsScreen: { screen: ReviewsScreen },
          ReviewScreen: { screen: ReviewScreen },
          ReviewsFilterDateScreen: { screen: ReviewsFilterDateScreen },
          ReviewsFilterRatingScreen: { screen: ReviewsFilterRatingScreen },
          ReviewAddMessageStepScreen: { screen: ReviewAddMessageStepScreen },
          ReviewAddRatingStepScreen: { screen: ReviewAddRatingStepScreen },
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

export default getRouter;
