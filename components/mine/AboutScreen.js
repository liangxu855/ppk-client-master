
import React, { Component } from 'react';
import {  
    View, 
    Text, 
    Image,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    DeviceEventEmitter
} from 'react-native';
import { loginLogout } from '../../network/Service';

import { ScreenWidth } from '../../Constants';
import { LongButton } from '../baseComp';
import Toast from '../../utils/Toast';

export default class AboutScreen extends Component {
  static navigationOptions = () => {
    return {
      tabBarVisible: false,
      title: "关于拼拼客",
    };
  }

  navigateToMainLogin = ()=>{
    DeviceEventEmitter.emit("switchMain", 0);
  }

  componentWillUnmount() {
    console.log("AboutScreen will unmount");
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../img/login_background.png')} style={{
          flex: 1, position: 'absolute', top:0, left:0, right:0, bottom:0, justifyContent: 'center', alignItems: 'center',}}>
        <Image source={require('../../img/logo.png')} style={{marginBottom:20}}/>
        <Image source={require('../../img/login_header.png')} style={{marginBottom:60}}/>
        <Image source={require('../../img/aboutQR.jpg')} style={{width:150, height:150,marginBottom:40}}/>
        <LongButton title='退出' onPress={() => {
          loginLogout().then((response) => {
            this.navigateToMainLogin();
          }).catch((err)=>{
            Toast.show(err.message, Toast.LONG);
          });
          }} />
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000'
  },
});