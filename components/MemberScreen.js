import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  Alert,
  DeviceEventEmitter
} from 'react-native';

import { ScreenWidth } from '../Constants';
import {getMemberInfo, updateUserInfo} from '../network/Service';
import Toast from '../utils/Toast';
import PayScreen from './PayScreen';

export default class MemberScreen extends Component {
  static navigationOptions = {
    title: "会员"
  }

  constructor(props) {
    super(props);
    this.state = {
      userLevel:0,
      userLevelDesc:'',
      userLevelEndTimeDesc:'',
      recommendNum:0,
      quarterlyCommission:'',
      quarterlyRankings:0,
      cardNum:0,
      usedCardNum:0,
      modalVisible: false,
    };
  }

  componentWillUnmount() {
    console.log("MemberScreen will unmount");
    this.listener.remove();
  }
  
  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener("TabToMember", ()=>{
      this._getMemBerInfo();
    });
    this._getMemBerInfo();
  }

  //邀请新用户
  _onPressInvite = () =>{

  }

  _setModalVisible(visible) {
      this.setState({ modalVisible: visible });
  }

  _getMemBerInfo = () => {
    getMemberInfo().then((result)=>{
          this.setState({
            userLevel:result.entry.userLevel,//1：代理；2：运营总监；3：合伙人,4运营总监体验卡
            userLevelDesc:result.entry.userLevelDesc,
            recommendNum:result.entry.recommendNum,//已邀请人数
            userLevelEndTimeDesc:result.entry.userLevelEndTimeDesc,//等级失效时间描述
            quarterlyCommission:result.entry.quarterlyCommission,//季度佣金
            quarterlyRankings:result.entry.quarterlyRankings,//季度排名
            cardNum: result.entry.operationCardTotalNum,
            usedCardNum: result.entry.operationCardUsedNum,
          });
          updateUserInfo({"userLevel":result.entry.userLevel, "userLevelDesc": result.entry.userLevelDesc});
    }).catch((error)=>{
          Toast.show(error.message, Toast.LONG);
    });
  }

  _paySuccess = () =>{
    this._setModalVisible(false);
    this._getMemBerInfo();
  }

  render() {
    let userDesc=null;
    let userLevelName = '';
    let shengjiButton = false;
    let desc1,desc2,bottomText;
    if(this.state.userLevel === 1) {
        userDesc = null;
        shengjiButton = true;
        userLevelName = this.state.userLevelDesc || "代理经理";
        desc1 = '运营总监 综合佣金提高10倍';
        desc2 = '邀请10名注册，享价99/月升级为运营总监';
        // desc2 = '邀请10名注册，升级为运营总监';
        bottomText = (<Text style={{color:'#cea976',fontSize:14}}>已邀请{this.state.recommendNum}人</Text>);
    } else if(this.state.userLevel === 2){
        userDesc= <Text style={{ color: '#b69359', fontSize: 11,marginTop:2 }}>{this.state.userLevelEndTimeDesc}</Text>;
        userLevelName = this.state.userLevelDesc || "运营总监";
        desc1 = '合伙人 可额外获得佣金10%';
        desc2 = '每月团队保持佣金5w，且季度排名TOP500内';
        // bottomText = <Text style={{color:'#cea976',fontSize:14}}>当前季度总佣金 {this.state.quarterlyCommission}  排名TOP {this.state.quarterlyRankings}</Text>;
        bottomText = (<Text style={{color:'#cea976',fontSize:14}}>已邀请{this.state.recommendNum}人</Text>);
    } else if(this.state.userLevel === 3){
        userDesc= <Text style={{ color: '#b69359', fontSize: 11,marginTop:2 }}>{this.state.userLevelEndTimeDesc}</Text>;
        userLevelName = this.state.userLevelDesc || "合伙人";
        desc1 = '合伙人 可获得额外佣金10%';
        desc2 = '每月团对保持佣金5w, 且季度排名TOP500内';
        // bottomText = <Text style={{color:'#cea976',fontSize:14}}>当前季度总佣金 {this.state.quarterlyCommission}  排名TOP {this.state.quarterlyRankings}</Text>;
        bottomText = (<Text style={{color:'#cea976',fontSize:14}}>已邀请{this.state.recommendNum}人</Text>);
    } else if(this.state.userLevel === 4){
        userDesc= <Text style={{ color: '#b69359', fontSize: 11,marginTop:2 }}>{this.state.userLevelEndTimeDesc}</Text>;
        shengjiButton = true;
        userLevelName = this.state.userLevelDesc || '运营总监 体验中';
        desc1 = '运营总监 综合佣金提高10倍';
        desc2 = '邀请10名注册，享价99/月升级为运营总监';
        // desc2 = '邀请10名注册，升级为运营总监';
        bottomText = <Text style={{color:'#cea976',fontSize:14}}>已邀请{this.state.recommendNum}人</Text>;
    } else {
       userDesc = null;
    }
    return (
      <ScrollView style={{backgroundColor:"#F6F6F6"}}>
        <ImageBackground style={styles.title_container_bg} source={require('../img/title_bar_bg.png')}>
          {shengjiButton ? <TouchableHighlight onPress={()=>{
            this._setModalVisible(true);
            // Alert.alert(
            //   "会员升级提示",
            //   "请邀请满10人，之后您的等级会自动升级，谢谢",
            //   [
            //     {text: 'OK', onPress: () => console.log('OK Pressed')},
            //   ],
            //   { cancelable: false }
            // );
          }} style={{
            backgroundColor: '#ddd2ba', width: 76,
            height: 25, borderRadius: 5, alignItems: 'center', justifyContent: 'center',
            position: 'absolute', right: 33, top: 62,
          }}>
            <Image source={require('../img/shengji_icon.png')}></Image>
          </TouchableHighlight> : null}
          <Text style={styles.title_name}> 会员中心 </Text>
          <View style={styles.jiaose_style} >
            <Text style={styles.jiaose_name}> {userLevelName} </Text>
          </View>
          {userDesc}
          <Image style={{position: 'absolute', bottom: 20,width:ScreenWidth-30,height:125,flex:1}} source={require('../img/jiaose_card_bg.png')} />
          <View style={{ width: ScreenWidth, height: 95, marginTop: 20, alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={{ color: '#563C1C', fontSize: 21, marginLeft: 45 }}>{desc1} </Text>
            <Text style={{ color: '#76633e', fontSize: 14, marginLeft: 45,marginTop:10 }}> {desc2} </Text>
          </View>

          <View style={{ position: 'absolute', bottom: 0, backgroundColor: '#413b33', height: 43, flex: 1, width: ScreenWidth, alignItems: 'center', justifyContent: 'center' }}>
            {/*<Text style={{ color: '#c2a46b', fontSize: 14 }}>已注册2人 邀请></Text>*/bottomText}
          </View>
        </ImageBackground>
        {this.state.userLevel !== 3 ?
        <View style={styles.tiyanka}>
          <Image style={{marginLeft:33}} source={require('../img/yunyingzongjian_icon.png')}></Image>
          <View>
              <Text style={{ color: '#76633e', fontSize: 17,marginLeft:30 }}>运营总监体验卡  x{this.state.cardNum}</Text>
              <Text style={{ color: '#999999', fontSize: 12,marginLeft:30,marginTop:5 }}>每邀请10位好友注册，即可获得一张</Text>
              <Text style={{ color: '#999999', fontSize: 12,marginLeft:30,marginTop:5 }}>已使用 {this.state.usedCardNum}张</Text>
          </View>
        </View>
        : null
        }
        <Image  source={require('../img/detail_desc1.png')} style={{width:ScreenWidth,height:ScreenWidth*1643/750, marginTop:20}}/>
        {/* <Image  source={require('../img/detail_desc.png')} style={{width:ScreenWidth,height:ScreenWidth*89/75, marginTop:20}}/> */}
        <Modal visible={this.state.modalVisible}
            animationType={'slide'}
            transparent
            onRequestClose={() => this._setModalVisible(false)}>
            <TouchableOpacity
                style={{flex: 1}}
                onPress={() => this._setModalVisible(false)}>
                <View style={styles.modalBackground}>
                    <View style={[styles.modalBox, {position: 'absolute',bottom: 0}]}>
                        <PayScreen
                            recommendNum={this.state.recommendNum}
                            cancel={() => this._setModalVisible(false)}
                            paySuccess={()=>this._paySuccess()}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title_container_bg: {
    flex: 1,
    width: ScreenWidth,
    height: 260,
    alignItems: 'center',
  },
  title_name: {
    marginTop: 29,
    color: '#ffffff',
    fontSize: 19,
    justifyContent: 'center'
  },
  jiaose_style: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  jiaose_name: {
    color: '#f6eadb',
    fontSize: 19
  },
  tiyanka:{
    flexDirection:'row',
    flex:1,
    backgroundColor:'#ffffff',
    borderRadius:5,
    borderWidth: 1,
    borderColor: '#999999',
    margin:15,
    height:95,
    alignItems:"center"
  },
  modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    modalBox:{
       width:ScreenWidth,
       height:400,
       backgroundColor:'#ffffff'
    },
});
