import React, { Component } from 'react';
import {  
  View, 
  Text, 
  TextInput, 
  Image,
  ImageBackground,
  StyleSheet,
  TouchableHighlight,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  DeviceEventEmitter
} from 'react-native';
import { LongButton, KeyboardDismessView  } from '../baseComp';
import { ScreenWidth } from '../../Constants';
import Toast from '../../utils/Toast';
import { loginGetCaptcha, loginDoLogin, loginRegister } from '../../network/Service';


export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileInput: '',
      captchaInput: '',
      inviteCodeInput: '',
      fetchCaptcha: '获取验证码',
      captchaEnable: true,
      isLoginView: this.props.navigation.state.params.type === 0,
      timer: null,
    };
  }

  pressCaptcha= () => {
    if (this.state.fetchCaptcha !== '获取验证码') {
      return;
    }
    if (this.state.mobileInput.length !== 11) {
      Toast.show("请输入有效手机号", Toast.SHORT);
      return;
    }

    loginGetCaptcha(this.state.mobileInput, this.state.isLoginView).then((respose) => {
      Toast.show("验证码发送成功", Toast.SHORT);
    }).catch((error)=>{
      let meesage = error.message;
      if (!this.state.isLoginView) { //注册页
        if (meesage.indexOf("该手机号码已注册") !== -1) { //已经注册过，需要跳转到登录页
           Alert.alert("注册出错", "用户已经注册，请跳转登录页继续登录", 
                      [
                        {text: '取消', onPress: ()=>{}, style: 'cancel'},
                        {text: '去登录', onPress: ()=>{
                          if (this.state.timer != null) {
                            clearInterval(this.state.timer);
                          }
                          this.setState({
                            isLoginView: true, 
                            fetchCaptcha: "获取验证码",
                            captchaEnable: true,
                            timer: null
                          });
                        }},
                      ], { cancelable: true});
          return;
        }
      }
      Toast.show(meesage, Toast.LONG);
    });

    let countdown = 60;
    this.setState({
      timer: setInterval(()=>{
        this.setState({
          fetchCaptcha: `${countdown--}秒`,
          captchaEnable: false
        });
        if (countdown <= 0) {
          clearInterval(this.state.timer);
          this.setState({
            fetchCaptcha: "获取验证码",
            captchaEnable: true,
            timer: null
          });
        }
      }, 1000)
    });
  }

  componentWillUnmount() {
    console.log("LoginScreen will unmount");
    if (this.state.timer !== null) {
      clearInterval(this.state.timer);
      this.setState({timer: null});
    }
  }

  navigateToMain = ()=>{
    DeviceEventEmitter.emit("switchMain", 1);
  }
  
  pressRegisterOrLogin = ()=>{
    if (this.state.mobileInput.length !== 11) {
      Toast.show("请输入有效手机号", Toast.SHORT);
      return;
    }
    if (this.state.captchaInput.length !== 4) {
      Toast.show("请输入有效验证码", Toast.SHORT);
      return;
    }
    if (this.state.isLoginView) {
      loginDoLogin(this.state.mobileInput, this.state.captchaInput).then((response) => {
        //登录成功，页面跳转
        this.navigateToMain();
      }).catch((error)=>{
        Toast.show(error.message, Toast.LONG);
      });
    } else {
      if (this.state.inviteCodeInput.length <= 2) {
        Toast.show("请输入有效邀请码", Toast.SHORT);
        return;
      }
      loginRegister(this.state.mobileInput, this.state.captchaInput, this.state.inviteCodeInput).then((response) => {
        //注册成功，页面跳转
        this.navigateToMain();
      }).catch((error)=>{
        Toast.show(error.message, Toast.LONG);
      });
    }

  }

  render() {
    return (
      // <KeyboardDismessView>
      <View style={styles.container}>
        <ImageBackground source={require('../../img/login_background.png')} style={{
          flex: 1, position: 'absolute', top:0, left:0, right:0, bottom:0, justifyContent: 'center', alignItems: 'center',}}>
        
        <KeyboardAvoidingView style={{width: '90%'}} behavior={'position'} keyboardVerticalOffset={0}>
        <Image source={require('../../img/logo.png')} style={{marginBottom:20, alignSelf: 'center'}}/>
        <Image source={require('../../img/login_header.png')} style={{marginBottom:60, alignSelf: 'center'}}/>
          <TextInput 
            placeholder="请输入手机号码" 
            placeholderTextColor='#999999'
            keyboardType='phone-pad'
            clearButtonMode='while-editing'
            style={styles.inputStyle}
            onChangeText={(mobileInput)=>this.setState({mobileInput})}
            underlineColorAndroid='transparent'
            width={ScreenWidth * 0.9}/>
          <View style={{flexDirection: 'row', marginBottom:25}}>
            <TextInput 
              placeholder="请输入验证码"
              placeholderTextColor='#999999'
              keyboardType='numeric'
              clearButtonMode='while-editing'
              underlineColorAndroid='transparent' 
              onChangeText={(captchaInput)=>this.setState({captchaInput})}
              style={[styles.inputStyle, {borderTopRightRadius:0, borderBottomRightRadius:0, marginBottom: 0}]}
              width={ScreenWidth * 0.6}/>
            <TouchableHighlight onPress={this.pressCaptcha} disabled={!this.state.captchaEnable}
                style={[{justifyContent: 'center', alignItems:'center', backgroundColor: '#FFD278', 
                          width: ScreenWidth*0.3, borderTopRightRadius:5, borderBottomRightRadius:5}, this.state.captchaEnable ?null:{backgroundColor: '#DDD1BB'} ]}>
              <Text style={{color: '#73520C', fontSize: 16, fontWeight: '800'}}>{this.state.fetchCaptcha}</Text>
            </TouchableHighlight>
          </View>
            { this.state.isLoginView ?
              null:
              <TextInput 
                placeholder="请输入邀请码"
                placeholderTextColor='#999999'
                keyboardType='numeric'
                clearButtonMode='while-editing'
                underlineColorAndroid='transparent'
                onChangeText={(inviteCodeInput)=>this.setState({inviteCodeInput})}
                style={styles.inputStyle}
                width={ScreenWidth * 0.9}/>
            }
          <LongButton title={this.state.isLoginView ?"登录": "注册"} style={{width: '100%'}} onPress={this.pressRegisterOrLogin}/>
        </KeyboardAvoidingView>
        </ImageBackground>
      </View>
        // </KeyboardDismessView>
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
    inputStyle: {
      backgroundColor: '#ffffff',
      height: 50,
      padding: 10,
      fontSize: 16,
      marginLeft: 0,
      marginBottom:25, 
      borderRadius: 5
    }
  });