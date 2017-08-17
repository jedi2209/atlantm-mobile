import { StackNavigator } from 'react-navigation';

// global
import IntroScreen from '../intro/containers/IntroScreen';
import ChooseDealerScreen from '../dealer/containers/ChooseDealerScreen';
import MenuScreen from '../menu/containers/MenuScreen';
import ProfileScreen from '../profile/containers/ProfileScreen';

// contacts
import ContactsScreen from '../contacts/containers/ContactsScreen';
import AboutScreen from '../contacts/about/containers/AboutScreen';
import FeedbackScreen from '../contacts/feedback/containers/FeedbackScreen';
import MapScreen from '../contacts/map/containers/MapScreen';
import ReferenceScreen from '../contacts/reference/containers/ReferenceScreen';
import AboutHoldingScreen from '../contacts/aboutholding/containers/AboutHoldingScreen';

// info
import InfoListScreen from '../info/containers/InfoListScreen';
import InfoPostScreen from '../info/containers/InfoPostScreen';

const getRouter = initialRouteName => StackNavigator(
  {
    IntroScreen: { screen: IntroScreen },
    MenuScreen: { screen: MenuScreen },
    ChooseDealerScreen: { screen: ChooseDealerScreen },
    ContactsScreen: {
      screen: StackNavigator({
        index: { screen: ContactsScreen },
        AboutScreen: { screen: AboutScreen },
        FeedbackScreen: { screen: FeedbackScreen },
        MapScreen: { screen: MapScreen },
        ReferenceScreen: { screen: ReferenceScreen },
        AboutHoldingScreen: { screen: AboutHoldingScreen },
      },
        {
          // initialRouteName: 'MapScreen',
          headerMode: 'float',
        }),
      navigationOptions: {
        header: null,
      },
    },
    InfoScreen: {
      screen: StackNavigator({
        InfoListScreen: { screen: InfoListScreen },
        InfoPostScreen: { screen: InfoPostScreen },
      }, {
        headerMode: 'float',
      }),
      navigationOptions: {
        header: null,
      },
    },
    ProfileScreen: { screen: ProfileScreen },
  },
  {
    initialRouteName,
    headerMode: 'float',
  },
);

export default getRouter;
