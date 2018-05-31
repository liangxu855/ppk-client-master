import React, { Component } from 'react';
import {  
  View,
  Image,
  Text,
  StyleSheet,
  SectionList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { getSettlement, getMemberInfo, updateUserInfo } from '../../network/Service';
import Toast from '../../utils/Toast';
import storage, { STORAGE_KEY_USER_INFO } from '../../utils/Storage';

export default class SettingScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: "我的",
      header: null
    };
  }
  constructor(props) {
    super(props);

    this.state = {
      amountToSettle: 0.00,
      amountSettled: 0.00,
      amountWithdraw: 0.00,
      userLevel: "代理经理",
      mobile: "138****7777"
    };
  }

  componentWillUnmount() {
    console.log("SettingScreen component will unmount");
    this.listener.remove();
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener("TabToSettings", ()=>{
      this.updateSettlement();
      this.updateUserInfo();
    });
    storage.getItem(STORAGE_KEY_USER_INFO)
    .then((result)=>{
      if (result && result.length > 5){
        let userInfo = JSON.parse(result);
        this.setState({
          mobile: userInfo.mobile,
          userLevel: userInfo.userLevelDesc || "代理经理",
        });
      }
    });
    this.updateSettlement();
  }

  updateUserInfo = () => {
    getMemberInfo().then((result)=>{
      updateUserInfo({
        "userLevel":result.entry.userLevel, 
        "userLevelDesc": result.entry.userLevelDesc
      });
      this.setState({userLevel: result.entry.userLevelDesc});
    });
  }

  updateSettlement = () => {
    getSettlement().then((response)=>{
      this.setState({
        amountToSettle: response.entry.toSettleAmount,
        amountSettled: response.entry.settledAmount,
        amountWithdraw: response.entry.availableAmount,
      });
    }).catch((err)=>{
      Toast.show(err.message, Toast.LONG);
    });
    return true;
  }

  showInfoOfType = (type) => {
    let title = '待结算';
    let content = '推广后所产生的未结算订单';

    if (type === 1){
      title = '已结算';
      content='用户确认收货并且已经过了退货时间的订单，就可以结算';
    } else if (type === 2) {
      title = '可提现';
      content='本月15号之前结算的订单，本月20可提现';
    }
    Alert.alert(
      title,
      content,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );
  }

  renderHeaderUserInfo = () => {
    return (
      <View style={{position: 'absolute', left: 10, top:70, flexDirection:'row'}}>
      <Image source={require('../../img/avatar.png')} style={{width:50, height:50}}/>
      <View style={{marginLeft: 13}}>
        <Text style={{color: 'white', fontSize:18}}>{this.state.mobile}</Text>
        <Text style={{color: 'white', fontSize:11, marginTop:10}}>{this.state.userLevel}</Text>
      </View>
    </View> 
    );
  }

  renderHeaderItem = (type)=> {
    let title = type === 1 ? '已结算' : type === 2 ? '可提现': '待结算';
    let amount = type === 1 ? this.state.amountSettled : type === 2 ? this.state.amountWithdraw: this.state.amountToSettle;
    return (
      <View style={{flex:1, alignItems: 'center'}}>
      <TouchableWithoutFeedback onPress={()=>{this.showInfoOfType(type);}}>
        <View style={{flexDirection: 'row', marginBottom:8}}>
          <Text style={{fontSize:13, color:"#999999", marginRight:10}}>{title}</Text>
          <Image source={require("../../img/question.png")}></Image>
        </View>
      </TouchableWithoutFeedback>
      <Text style={{fontSize:23, color:"#333333", fontWeight: '800'}}>{amount}</Text>
      </View> 
    );
  }

  renderHeader = () => {
    return (
      <View style={{flex:1}}>
        <View style={{flex:1, backgroundColor: '#2E2923', alignItems: 'center', height: 154 }}>
          {this.renderHeaderUserInfo()}
        </View>
        <View style={{flexDirection: 'row', backgroundColor: "white", justifyContent:'space-between', alignItems:'center', height: 71}}>
          {this.renderHeaderItem(0)}
          {this.renderHeaderItem(1)}
          {this.renderHeaderItem(2)}
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.props.navigation.navigate('TiXian');}}>
        <View style={{flex:1, height: 44, backgroundColor:'white', alignItems:'center', justifyContent:'center'}}>
          <View style={{position:'absolute', top:0, left:0,right:0, height:1, backgroundColor:'#E5E5E5'}}/>
          <Text style={{fontSize: 14, color: '#D12129', fontWeight: '500'}}>去提现</Text>
        </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderSectionHeader = ()=> {
    return (
      <View style={{backgroundColor: '#F6F6F6', height: 10}}></View>
    );
  }
  renderItem = ({item})=> {
    let icon=null;
    let navigator = 'About';
    if (item.key === 0) {
      navigator = 'InviteCode';
      icon =<EvilIcons  name='share-google'  size={20} style={{marginLeft:13, marginRight: 13}}/>; 
    } else if (item.key === 1) {
      navigator = 'Order';
      icon=<Ionicons  name='ios-list-box-outline' size={20} style={{marginLeft:13, marginRight: 13}}/>;
    } else if (item.key === 2) {
      icon=<SimpleLineIcons  name='people'  size={20} style={{marginLeft:13, marginRight: 13}}/>;
      navigator = 'Team';
    } else if (item.key === 3) {
      icon=<EvilIcons  name='question'  size={20} style={{marginLeft:13, marginRight: 13}}/>;
      navigator = 'NewGuide';
    } else if (item.key === 4) {
      icon=<EvilIcons  name='exclamation'  size={20} style={{marginLeft:13, marginRight: 13}}/>;
      navigator = 'About';
    }
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={()=>{
        this.props.navigation.navigate(navigator);
        }}>
      <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', height:44, backgroundColor: 'white'}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          {icon}
          <Text style={{position:'absolute', left:50, fontSize: 14, color: '#444444'}}>{item.title}</Text>
        </View>
        <Ionicons name='ios-arrow-forward' size={26} color='#C7C7CC'  style={{marginLeft:13, marginRight: 13}}/>
      </View>
      </TouchableOpacity>
    );
  }

  render() {
    var sections = [
      { key: "A", data: [{ title: "我的邀请码",key:0 }] },
      { key: "B", data: [{ title: "我的订单",key:1 }, { title: "我的团队" ,key:2}] },
      { key: "C", data: [{ title: "新手攻略",key:3 }, { title: "关于拼拼客" ,key:4}] },
    ];
    return (
      <View style={styles.container}>
        <SectionList
            style={{flex:1, position:'absolute', top:0, left:0,right: 0,bottom:0}}
            renderSectionHeader={this.renderSectionHeader}
            renderItem={this.renderItem}
            sections={sections}
            refreshing={true}
            keyExtractor={(item,index)=>`${item}${index}`}
            ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor:'#E5E5E5'}}></View>}
            ListHeaderComponent={this.renderHeader}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6'
  }
});
