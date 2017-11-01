import { StackNavigator } from 'react-navigation';

// global
import IntroScreen from '../intro/containers/IntroScreen';
import ChooseDealerScreen from '../dealer/containers/ChooseDealerScreen';
import MenuScreen from '../menu/containers/MenuScreen';
import ProfileScreen from '../profile/containers/ProfileScreen';
import ServiceScreen from '../service/containers/ServiceScreen';

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
import NewCarListScreen from '../catalog/newcar/containers/NewCarListScreen';
import NewCarItemScreen from '../catalog/newcar/containers/NewCarItemScreen';
import NewCarCityScreen from '../catalog/newcar/containers/NewCarCityScreen';

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
      ProfileScreen: { screen: ProfileScreen },
      ServiceScreen: { screen: ServiceScreen },
      Catalog2Screen: {
        screen: StackNavigator({
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
          NewCarListScreen: { screen: NewCarListScreen },
          NewCarItemScreen: { screen: NewCarItemScreen },
          NewCarCityScreen: { screen: NewCarCityScreen },
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
