import { StackNavigator } from 'react-navigation';
import LoginHomeScreen from './LoginHomeScreen';
import  LoginScreen  from './LoginScreen';

let LoginStack = StackNavigator(
  {
    Home: {
      screen: LoginHomeScreen
    },
    Login: {
      screen: LoginScreen
    },
  },
  {
    headerMode: 'none',
    // mode: 'modal',
    initialRouteName: 'Home',
  }
);

export default LoginStack;
