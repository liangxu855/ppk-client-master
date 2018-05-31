import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    TouchableHighlight,
} from 'react-native';
import { LongButton, KeyboardDismessView } from './baseComp';
import { ScreenWidth } from '../Constants';

export default class TiXianScreen extends Component {

    static navigationOptions = () => {
    return {
      tabBarVisible: false,
      title: "提现",
    };
  }

    state = {
        mobileInput: '',
        captchaInput: '',
        inviteCodeInpput: '',
        fetchCaptcha: '获取验证码',
    }

    componentWillUnmount() {
        console.log("TiXianScreen will unmount");
    }
    
    _tixian = () => {
        Alert.alert(
            "提现提醒",
            "当前可提现金额为0",
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          );
    }

    render() {
        // const viewType = this.props.navigation.state.params.type;
        return (
            // <KeyboardDismessView>
            <View style={styles.container}>
                <View style={{ backgroundColor: '#ffffff', height: 135,marginTop: 10 }}>
                    <View style={{ height: 1, backgroundColor: '#dddddd' }} />
                    <View style={{ flexDirection: 'row', height: 44, alignItems: 'center', }}>
                        <Text style={{ width: 85, fontSize: 14, color: '#444444', paddingLeft: 15 }}>支付宝</Text>
                        <TextInput
                            placeholder="请输入支付宝账号"
                            placeholderTextColor='#999999'
                            clearButtonMode='while-editing'
                            style={styles.inputStyle}
                            underlineColorAndroid='transparent'
                            width={ScreenWidth * 0.7} />
                    </View>
                    <View style={{ height: 1, backgroundColor: '#dddddd' }} />
                    <View style={{ flexDirection: 'row', height: 44, alignItems: 'center', }}>
                        <Text style={{ width: 85, fontSize: 14, color: '#444444', paddingLeft: 15 }}>姓名</Text>
                        <TextInput
                            placeholder="请输入您的姓名"
                            placeholderTextColor='#999999'
                            clearButtonMode='while-editing'
                            underlineColorAndroid='transparent'
                            style={[styles.inputStyle, { borderTopRightRadius: 0, borderBottomRightRadius: 0, marginBottom: 0 }]}
                            width={ScreenWidth * 0.6} />
                    </View>
                    <View style={{ height: 1, backgroundColor: '#dddddd' }} />
                    <View style={{ flexDirection: 'row', height: 44, alignItems: 'center', }}>
                        <Text style={{ width: 85, fontSize: 14, color: '#444444', paddingLeft: 15 }}>提现金额</Text>
                        <TextInput
                            placeholder="可提现金额"
                            placeholderTextColor='#999999'
                            keyboardType='numeric'
                            clearButtonMode='while-editing'
                            underlineColorAndroid='transparent'
                            style={styles.inputStyle}
                            width={ScreenWidth * 0.6} />
                    </View>
                </View>

                <TouchableHighlight style={{
                    height: 43, marginLeft: 15, marginRight: 15, marginTop: 60, backgroundColor: '#cda967',
                    borderRadius: 5, alignItems: 'center', justifyContent: 'center'
                }}
                    onPress={() => this._tixian()}>
                    <Text style={{ color: '#ffffff', fontSize: 17 }}>提现</Text>
                </TouchableHighlight>

            </View>
            // {/*</KeyboardDismessView>*/}
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    inputStyle: {
        height: 44,
        fontSize: 14,
        marginLeft: 0,
        borderRadius: 5
    }
});