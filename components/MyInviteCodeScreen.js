import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal
} from 'react-native';
import { LongButton, KeyboardDismessView } from './baseComp';
import { ScreenWidth } from '../Constants';
import TitleBar from './view/TitleBar';
import WeChatShare from './view/WeChatShare';
import {getInviteCode} from '../network/Service';
import FastImage from 'react-native-fast-image';
import * as WeChat from 'react-native-wechat';
import Toast from '../utils/Toast';
import ChooseShareHaiBao from './view/ChooseShareHaiBao';

export default class MyInviteCodeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // inviteCode: '',
            // recommendNum: 0,
            inviteData:{}
        };
        WeChat.registerApp('wx202d26e48c2ab6f7');
    }

    static navigationOptions = () => {
    return {
      tabBarVisible: false,
      title: "我的邀请码",
    };
  }
    componentWillUnmount() {
        console.log("MyInviteCodeScreen will unmount");
    }
    componentDidMount() {
        this._getInviteCode();
    }

    _getInviteCode = () =>{
        getInviteCode().then((result)=>{
          this.setState({
            inviteData:result.entry
          });
        }).catch((error)=>{
          Toast.show(error.message, Toast.LONG);
        });
    }

    _showModal = (index) =>{
        //0是分享链接，1是分享海报
        console.log("_showModal:"+index);
        if(index == 0){
            let data={};
            data.type = 'news';
            data.title = this.state.inviteData.title;
            data.description = this.state.inviteData.desc;
            data.thumbImage = this.state.inviteData.thumbIcon;
            data.webpageUrl = this.state.inviteData.url;
            this.WeChatShareScreen.setShareData(data);
            this.WeChatShareScreen._setModalVisible(true);
        }else{
            // let data={};
            // data.type = 'imageUrl';
            // data.imageUrl = 'http://mat1.gtimg.com/fashion/images/index/2017/08/25/mrjx1.jpg';
            // this.WeChatShareScreen.setShareData(data);
            this._showHaoBaiModal();
        }
    } 

    _showHaoBaiModal = () =>{
        this.ChooseShareHaiBao._setModalVisible(true);
    }

    _shareHaiBao = (index) =>{
        let data={};
        data.type = 'imageUrl';
        let key = 'type'+(index+1);
        if (this.state.inviteData && this.state.inviteData.shareImages) {
            data.imageUrl= this.state.inviteData.shareImages[key];
            console.log("imageUrl:"+data.imageUrl);
            if (data.imageUrl && data.imageUrl.length > 0) {
                this.WeChatShareScreen.setShareData(data);
                this.WeChatShareScreen._setModalVisible(true);
            } else {
                Toast.show("分享失败, 图片路径不存在", Toast.SHORT);
            }
        } else {
            Toast.show("分享失败", Toast.SHORT);
        }
    }

    render() {
        return (
            <View style={{flex:1}}>
            <ScrollView style={styles.container}>
                {/*<TitleBar title='我的邀请码' />*/}
                <View style={{ height: 135, backgroundColor: '#352f29',alignItems:'center'}}>
                    <ImageBackground style={{ flex:1,marginTop:53,width:ScreenWidth}} source={require('../img/jiaose_card_bg.png')}>
                    <Text style={{ color: '#563C1C', fontSize: 21 ,marginTop:20,marginLeft:45}}>我的邀请码 {this.state.inviteData.inviteCode}</Text>
                    <Text style={{ color: '#76633e', fontSize: 14,marginTop:5,marginLeft:45 }}>当前已邀请 {this.state.inviteData.recommendNum}人</Text>
                    </ImageBackground>
                </View>
                <View style={{ flexDirection: 'row',marginTop:15,justifyContent:'space-between' }}>
                    <FastImage source={require('../img/ad_01.png')} 
                        style={{width:(ScreenWidth-55)/2,height:(ScreenWidth-55)/(2*ScreenWidth)*667,marginLeft:22.5 }} resizeMode={FastImage.resizeMode.contain}/>
                    <FastImage source={require('../img/ad_02.png')} 
                    style={{width:(ScreenWidth-55)/2,height:(ScreenWidth-55)/(2*ScreenWidth)*667,marginRight:22.5 }} resizeMode={FastImage.resizeMode.contain}/>
                </View>
                    <FastImage source={require('../img/ad_03.png')} 
                    style={{width:(ScreenWidth-55)/2,height:(ScreenWidth-55)/(2*ScreenWidth)*667,marginLeft:22.5,marginTop:15,marginBottom:70 }} resizeMode={FastImage.resizeMode.contain}/>
            </ScrollView>
            <View style={{position: 'absolute',bottom:0,flexDirection:'row',height:60,paddingLeft:30,
            paddingRight:30,alignItems:'center',justifyContent:'space-between',flex:1,backgroundColor:'#ffffff',borderTopWidth:2,borderTopColor:'#efefef'}}>
                    <TouchableOpacity style={styles.shareLink} onPress={()=>this._showModal(0)}>
                        <Text style={{color:'#ffffff',fontSize:16}}>分享邀请链接</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sharePic} onPress={()=>this._showModal(1)}>
                        <Text style={{color:'#ffffff',fontSize:16}}>分享邀请海报</Text>
                    </TouchableOpacity>
            </View>
                <WeChatShare
                    shareData={this.state.shareData}
                    ref={(ref) => {
                        this.WeChatShareScreen = ref;}}
                />
                <ChooseShareHaiBao
                shareHaiBao = {this._shareHaiBao}
                ref={(ref) => {
                        this.ChooseShareHaiBao = ref;}}
                />
                </View>
        );
    }
}
//cancel={() => this._setModalVisible(false)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    shareLink:{
        width:(ScreenWidth-68)/2,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#cda967',
        height:45,
        borderRadius:4
    },
    sharePic:{
        width:(ScreenWidth-68)/2,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#e45d33',
        height:45,
        borderRadius:4,
        marginLeft:15
    },
});