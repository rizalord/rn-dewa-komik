import React from 'react';
import {Dimensions, Text, StyleSheet, AsyncStorage} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Welcome from '../controllers/Auth/Welcome';
import Register from '../controllers/Auth/Register';
import Login from '../controllers/Auth/Login';
import Home from '../controllers/General/Home';
import Explore from '../controllers/General/Explore';
import Bookmark from '../controllers/General/Bookmark';
import Profile from '../controllers/General/Profile';
import DetailComic from '../controllers/Others/DetailComic';
import ReadComic from '../controllers/Others/ReadComic';
import GenreScreen from '../controllers/Others/GenreScreen';
import ProfileSettings from './../controllers/Others/Profiles/SettingsLayout'
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {fromRight, fromBottom} from 'react-navigation-transitions';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

console.disableYellowBox = true;

const AuthAppStack = createStackNavigator(
  {
    Welcome: {
      screen: Welcome,
      navigationOptions: {
        header: null,
      },
    },
    Register: {
      screen: Register,
      navigationOptions: {
        header: null,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Welcome',
  },
);

const GeneralAppStack = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return <Icon name="home" style={{color: tintColor}} size={25} />;
        },
      },
      params: {
        routeName: 'Home',
      },
    },
    Explore: {
      screen: Explore,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return <Icon name="compass" size={25} style={{color: tintColor}} />;
        },
      },
      params: {
        routeName: 'Explore',
      },
    },
    Bookmark: {
      screen: Bookmark,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return (
            <Feather name="book-open" size={25} style={{color: tintColor}} />
          );
        },
      },
      params: {
        routeName: 'Bookmark',
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return (
            <Feather
              name="user"
              size={25}
              style={{paddingBottom: 5, color: tintColor}}
            />
          );
        },
      },
    },
  },
  {
    activeColor: 'orange',
    barStyle: {
      backgroundColor: 'white',
      borderWidth: 0.5,
      borderBottomWidth: 1,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderColor: 'transparent',
      overflow: 'hidden',
    },
    style : {
        backgroundColor : 'rgba(255,255,255,0)'
    }
    // initialRouteName : "Profile",
    // tabBarOptions: {
    //   activeTintColor: 'orange',
    //   inactiveTintColor: 'rgba(0,0,0,0.7)',
    //   showIcon: true,
    //   style: {
    //     borderTopLeftRadius: 16,
    //     borderTopRightRadius: 16,
    //     backgroundColor: 'rgb(255,255,255)',
    //     position: 'absolute',
    //     bottom: 0,
    //     // padding: 10,
    //     width: Dimensions.get('window').width,
    //     height: 58,
    //     zIndex: 8,
    //     elevation: 5,
    //     shadowOffset: {width: 0, height: -10},
    //     shadowColor: 'rgba(0,0,0,1)',
    //     shadowOpacity: 1,
    //     shadowRadius: 5,
    //   },
    // },

    // defaultNavigationOptions: ({navigation}) => ({
    //   tabBarLabel: ({focused}) => {
    //     const {routeName} = navigation.state;
    //     switch (routeName) {
    //       case 'Home':
    //         return focused ? (
    //           <Text style={styles.navText}>{routeName}</Text>
    //         ) : null;
    //         break;
    //       case 'Explore':
    //         return focused ? (
    //           <Text style={styles.navText}>{routeName}</Text>
    //         ) : null;
    //         break;
    //       case 'Bookmark':
    //         return focused ? <Text style={styles.navText}>Library</Text> : null;
    //         break;
    //       case 'Profile':
    //         return focused ? (
    //           <Text style={styles.navText}>{routeName}</Text>
    //         ) : null;
    //         break;
    //       default:
    //         return null;
    //         break;
    //     }
    //   },
    // }),
  },
);

// Other's Transition
const handleCustomTransition = ({scenes}) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  if (prevScene && nextScene.route.routeName === 'Genres') {
    return fromBottom();
  }

  return fromRight(600);
};

const OtherAppStack = createStackNavigator(
  {
    DetailComic: {
      screen: DetailComic,
    },
    ReadComic: {
      screen: ReadComic,
    },
    Genres: {
      screen: GenreScreen,
    },
    ProfileSettings : {
      screen :  ProfileSettings
    }
  },
  {
    headerMode: 'none',
    // initialRouteName : 'Genres',
    transitionConfig: nav => handleCustomTransition(nav),
  },
);

export default function Routes() {
  return createAppContainer(
    createStackNavigator(
      {
        Auth: {
          screen: AuthAppStack,
          navigationOptions: {
            header: null,
          },
        },
        General: {
          screen: GeneralAppStack,
        },
        Other: {
          screen: OtherAppStack,
        },
      },
      {
        headerMode: 'none',
        initialRouteName: 'Auth',
      },
    ),
  );
}

const styles = StyleSheet.create({
  navText: {
    color: 'orange',
    textAlign: 'center',

    marginTop: -5,
    marginBottom: 5,
  },
});
