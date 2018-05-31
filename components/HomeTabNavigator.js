import React, {Component} from 'react';
import { 
  Image,
  DeviceEventEmitter,
} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';

import HomeScreen  from './HomeScreen';
import SettingScreen from './mine/SettingScreen';
import AboutScreen from './mine/AboutScreen';
import TeamScreen from './mine/TeamScreen';
import MemberScreen from './MemberScreen';
import NewScreen from './mine/NewScreen';

import TiXianScreen from './TiXianScreen';
import MyInviteCodeScreen from './MyInviteCodeScreen';
import OrderScreen from './OrderScreen';
import GoodsDetailScreen from './GoodsDetailScreen';
import SearchScreen from './SearchScreen';

// render() {
//   const { getScreenDetails, scene } = this.props
//   const details = getScreenDetails(scene)
//   return (
//     <View>
//       <Text>{details.options.title}</Text>
//     <View>
//   )

const MineStack = StackNavigator (
  {
    Mine: {
      screen: SettingScreen
    },
    Team: {
      screen: TeamScreen
    },
    About: {
      screen: AboutScreen
    },
    TiXian:{
      screen:TiXianScreen
    },
    InviteCode:{
      screen:MyInviteCodeScreen
    },
    Order:{
      screen:OrderScreen
    },
    NewGuide:{
      screen:NewScreen
    }
  },
  {
    headerMode: 'float',
    initialRouteName: 'Mine',
    navigationOptions: {
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        backgroundColor: '#352F29',
      },
      headerTintColor: 'white'
    }
  }
);

const HomeStack = StackNavigator(
  {
    HomeMain: {
      screen: HomeScreen
    },
    ProductDetail: {
      screen: GoodsDetailScreen
    },
    Search: {
      screen: SearchScreen
    }
  },
  {
    headerMode: 'float',
    initialRouteName: 'HomeMain',
    navigationOptions: {
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        backgroundColor: '#352F29',
      },
      headerTintColor: 'white'
    }
  }
);

const TabNav = TabNavigator(
  {
    HomeMain: { screen: HomeStack },
    Member: { screen: MemberScreen },
    Settings: { screen: MineStack },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        // let iconName;
        if (routeName === 'HomeMain') {
          // iconName = `ios-home${focused ? '' : '-outline'}`;
        } else if (routeName === 'Member') {
          return <Image source={focused ? require("../img/tab_member_a.png"):require("../img/tab_member.png")} />;
          // iconName = `ios-person${focused ? '' : '-outline'}`;
        } else if (routeName === 'Settings') {
          return <Image source={focused ? require("../img/tab_mine_a.png"):require("../img/tab_mine.png")} />;
          // iconName = `ios-options${focused ? '' : '-outline'}`;
        }
        return <Image source={focused ? require("../img/tab_home_a.png"):require("../img/tab_home.png")} />;
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        // return <Ionicons name={iconName} size={20} color={tintColor} />;
      },
      tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
        let destKey = scene.route.key;
        if (destKey === 'HomeMain') {
          if (!scene.focused) {
            DeviceEventEmitter.emit("TabToMain");
          }
        } else if (destKey === 'Member') {
          if (!scene.focused) {
            DeviceEventEmitter.emit("TabToMember");
          }
        } else if (destKey === 'Settings') {
          if (!scene.focused) {
            DeviceEventEmitter.emit("TabToSettings");
          }
        }
        jumpToIndex(scene.index);
      }
    }),
    tabBarOptions: {
      activeTintColor: '#333333',
      inactiveTintColor: '#999999',
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

export default TabNav;
