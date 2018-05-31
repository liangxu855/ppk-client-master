import React, {Component} from "react";

import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native';
import { LongButton } from '../baseComp';
import { prefetchToken, checkToken } from '../../network/Service';
import { NavigationActions } from 'react-navigation';
import * as WeChat from 'react-native-wechat';
import SplashScreen from 'react-native-splash-screen';

class LoginHomeScreen extends Component {
  constructor(props) {
    super(props);
    WeChat.registerApp('wx202d26e48c2ab6f7');
  }

  componentDidMount() {
    SplashScreen.hide();
    prefetchToken(()=>{
      checkToken().then((response)=>{
        DeviceEventEmitter.emit("switchMain", 1);
      }).catch((error)=>{
        //nothing to do;
      });
    });
  }

  componentWillUnmount() {
    console.log("LoginHomeScreen will unmount");
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../img/login_background.png')} style={{
          flex: 1, position: 'absolute', top:0, left:0, right:0, bottom:0, justifyContent: 'center', alignItems: 'center',}}>
        <Image source={require('../../img/logo.png')} style={{marginBottom:20}}/>
        <Image source={require('../../img/login_header.png')} style={{marginBottom:60}}/>
        <LongButton title='注册' onPress={() => {
          this.props.navigation.navigate('Login', {type: 1});}} />
        <TouchableOpacity
          activeOpacity={0.6} 
          onPress={() => this.props.navigation.navigate('Login', {type: 0})} 
          style={styles.buttonLogin} >
          <Text style={styles.buttonLoginTitle}>已有账号，登录</Text>
        </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000'
  },

  buttonLogin: {
    alignItems: 'center', 
    justifyContent:'center', 
    width: '80%', 
    height: 50, 
    backgroundColor: '#000000', 
    borderWidth: 1,
    borderColor: '#FFDC97',
    borderRadius: 5
  },
  buttonLoginTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFDC97'
  }
});

export default LoginHomeScreen;
