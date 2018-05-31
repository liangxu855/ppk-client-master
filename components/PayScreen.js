import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

import {createPay,payFeeGet} from '../network/Service';
import Toast from '../utils/Toast';
import * as WeChat from 'react-native-wechat';


export default class PayScreen extends Component {
  static navigationOptions = {
    title: "会员"
  }
  constructor(props) {
    super(props);
    //应用注册
    this.state = {
      current_choose_pay_type: 0,
      feeData:[]
    };
  }

  componentDidMount(){
     payFeeGet().then((result) =>{
       if(result.status){
         let feeD = [];
         result.entry.forEach(function(element) {
           if(element.type === 1){
             feeD[0] = element;
           }else if(element.type === 2){
             feeD[1] = element;
           }
         }, this);
        console.log("feeD"+JSON.stringify(feeD));
         this.setState({
            feeData:feeD
         });
       }
     }).catch((error) =>{
        Toast.show(error.errStr, Toast.LONG);
     });
  }

  componentWillUnmount() {
    console.log("PayScreen will unmount");
  }

  _onChoosePayType = (index) => {
    if (this.props.recommendNum >= 10 && index < 2) {
      return;
    }
    if (this.props.recommendNum < 10 && index >= 2) {
      return;
    }
    this.setState({ current_choose_pay_type: index });
  }

  _createPayOrder = () => {
    let fee = 0;
    let type = 1;
    if (this.state.current_choose_pay_type === 0) {
      fee = this.state.feeData[0].monthPrice;
      type = this.state.feeData[0].type;
    } else if (this.state.current_choose_pay_type === 1) {
      fee = this.state.feeData[0].yearPrice;
      type = this.state.feeData[0].type;
    } else if (this.state.current_choose_pay_type === 2) {
      fee = this.state.feeData[1].monthPrice;
      type = this.state.feeData[1].type;
    } else if (this.state.current_choose_pay_type === 3) {
      fee = this.state.feeData[1].yearPrice;
      type = this.state.feeData[1].type;
    }

    createPay(fee,type).then((result) =>{
      if (result.status) {
        this._callWeiXinToPay(result.entry);
      } else {
        Toast.show(result.message, Toast.LONG);
      }
    }).catch((error)=>{
      Toast.show(error.message, Toast.LONG);
    });
  }

  /** 
    partnerId: '',  // 商家向财付通申请的商家id
    prepayId: '',   // 预支付订单
    nonceStr: '',   // 随机串，防重发
    timeStamp: '',  // 时间戳，防重发
    package: '',    // 商家根据财付通文档填写的数据和签名
    sign: ''        // 商家根据微信开放平台文档对数据做的签名
  */
  _callWeiXinToPay = (orderInfo) => {
    WeChat.pay(orderInfo).then((result) => {
      if (result.errCode == 0) {
        Toast.show('支付成功', Toast.LONG);
        this.props.paySuccess();
      } else {
        Toast.show(result.errStr, Toast.LONG);
      }
    });
  }

  render() {
    let style1, style2, style3, style4;
    let moneyColorStyle1, moneyColorStyle2;
    let nowPrice1=false,nowPrice2=false,nowPrice3=false,nowPrice4=false;
    let originalLineStyle1,originalLineStyle2,originalLineStyle3,originalLineStyle4 = {textDecorationLine: 'none'};
    if (this.props.recommendNum > 10) {
      if (this.state.current_choose_pay_type <= 3) {
        style1 = styles.un_select_bg;
        style2 = styles.un_select_bg;
        style3 = styles.select_bg;
        style4 = styles.un_select_bg;
      } else {
        style1 = styles.un_select_bg;
        style2 = styles.un_select_bg;
        style3 = styles.un_select_bg;
        style4 = styles.select_bg;
      }
      moneyColorStyle1 = styles.disable_text_color;
      moneyColorStyle2 = styles.disable_text_color;
    } else {
      if (this.state.current_choose_pay_type === 0) {
        style1 = styles.select_bg;
        style2 = styles.un_select_bg;
        style3 = styles.un_select_bg;
        style4 = styles.un_select_bg;
      } else {
        style1 = styles.un_select_bg;
        style2 = styles.select_bg;
        style3 = styles.un_select_bg;
        style4 = styles.un_select_bg;
      }
      moneyColorStyle2 = styles.disable_text_color;
      moneyColorStyle1 = styles.normal_money_text_color;
    }
    let needPeopleNum = 10 - this.props.recommendNum;
    if (needPeopleNum <= 0) {
      needPeopleNum = 0;
    }

    if(this.state.feeData.length < 2){
      return(<View/>);
    }

    if(this.state.feeData[0].monthOriginalPrice > this.state.feeData[0].monthPrice){
      nowPrice1 = true;
      originalLineStyle1 = {textDecorationLine: 'line-through'};
    }
    if(this.state.feeData[0].yearOriginalPrice > this.state.feeData[0].yearPrice){
      nowPrice2 = true;
      originalLineStyle2 = {textDecorationLine: 'line-through'};

    }
    if(this.state.feeData[1].monthOriginalPrice > this.state.feeData[1].monthPrice){
      nowPrice3 = true;
      originalLineStyle3 = {textDecorationLine: 'line-through'};

    }
    if(this.state.feeData[1].yearOriginalPrice > this.state.feeData[1].yearPrice){
      nowPrice4 = true;
      originalLineStyle4= {textDecorationLine: 'line-through'};
    }

    return (
      <View style={{ height: 400 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => null}>
          <Text style={{ color: '#444444', fontSize: 17, marginLeft: 15, marginTop: 20 }}>运营总监套餐</Text>
          <TouchableOpacity onPress={() => this._onChoosePayType(0)}>
            <View style={[style1, styles.item_space, { marginTop: 15 }]}>
              <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.normal_text_color, { marginLeft: 15 }]}>月度运营总监</Text>
              {this.state.feeData[0].monthSavePrice > 0 &&
              <Text style={[styles.jieyue_text_color, { marginLeft: 15 }]}>节约{this.state.feeData[0].monthSavePrice/100}元</Text>
              }
              </View>
              <View style={{marginRight: 22,flexDirection:'row'}}>
                {nowPrice1 &&
              <Text style={[moneyColorStyle1,{marginRight: 5}]}>¥{this.state.feeData[0].monthPrice/100}</Text>}
              <Text style={[moneyColorStyle1, originalLineStyle1]}>¥{this.state.feeData[0].monthOriginalPrice/100}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._onChoosePayType(1)}>
            <View style={[style2, styles.item_space, { marginTop: 15 }]}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.normal_text_color, { marginLeft: 15 }]}>年度运营总监</Text>
                {this.state.feeData[0].yearSavePrice > 0 &&
                <Text style={[styles.jieyue_text_color, { marginLeft: 15 }]}>节约{this.state.feeData[0].yearSavePrice/100}元</Text>
                }
              </View>
              <View style={{marginRight: 22,flexDirection:'row'}}>
                {nowPrice2 &&
              <Text style={[moneyColorStyle1,{marginRight: 5}]}>¥{this.state.feeData[0].yearPrice/100}</Text>}
              <Text style={[moneyColorStyle1, originalLineStyle2]}>¥{this.state.feeData[0].yearOriginalPrice/100}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={[styles.disable_text_color, { marginLeft: 15, marginTop: 15 }]}>邀请满10人，即可享受特价开通，您还差{needPeopleNum}人</Text>
          <TouchableOpacity onPress={() => this._onChoosePayType(2)}>
            <View style={[style3, styles.item_space, { marginTop: 15 }]}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.normal_text_color, { marginLeft: 15 }]}>月度运营总监</Text>
                {this.state.feeData[1].monthSavePrice > 0 &&
                <Text style={[styles.jieyue_text_color, { marginLeft: 15 }]}>节约{this.state.feeData[1].monthSavePrice/100}元</Text>
                }
              </View>
              <View style={{marginRight: 22,flexDirection:'row'}}>
                {nowPrice3 &&
              <Text style={[moneyColorStyle2,{marginRight: 5}]}>¥{this.state.feeData[1].monthPrice/100}</Text>}
              <Text style={[moneyColorStyle2, originalLineStyle3]}>¥{this.state.feeData[1].monthOriginalPrice/100}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._onChoosePayType(3)}>
            <View style={[style4, styles.item_space, { marginTop: 15 }]}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.normal_text_color, { marginLeft: 15 }]}>年度运营总监</Text>
                {this.state.feeData[1].yearSavePrice > 0 &&
                <Text style={[styles.jieyue_text_color, { marginLeft: 15 }]}>节约{this.state.feeData[1].yearSavePrice/100}元</Text>
                }
              </View>
              <View style={{marginRight: 22,flexDirection:'row'}}>
                {nowPrice4 &&
              <Text style={[moneyColorStyle2,{marginRight: 5}]}>¥{this.state.feeData[1].yearPrice/100}</Text>}
              <Text style={[moneyColorStyle2, originalLineStyle4]}>¥{this.state.feeData[1].yearOriginalPrice/100}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableHighlight style={{
            height: 43, marginLeft: 15, marginRight: 15, marginTop: 15, backgroundColor: '#cda967',
            borderRadius: 5, alignItems: 'center', justifyContent: 'center'
          }}
            onPress={() => this._createPayOrder()}>
            <Text style={{ color: '#ffffff', fontSize: 17 }}>立即支付</Text>
          </TouchableHighlight>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  select_bg: {
    backgroundColor: '#f7f2e9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#574623',
    marginLeft: 15,
    marginRight: 15,
    height: 44,
    alignItems: 'center'
  },
  un_select_bg: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginLeft: 15,
    marginRight: 15,
    height: 44,
    alignItems: 'center'
  },
  normal_text_color: {
    color: '#444444'
  },
  normal_money_text_color: {
    color: '#d12129'
  },
  disable_text_color: {
    fontSize: 14,
    color: '#999999'
  },
  jieyue_text_color: {
    fontSize: 13,
    color: '#888888'
  },
  item_space: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
