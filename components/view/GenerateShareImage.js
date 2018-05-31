import React, { Component } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ImageBackground,
  TouchableHighlight,
  Modal 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import FastImage from 'react-native-fast-image';
import { ScreenWidth } from '../../Constants';
import * as WeChat from 'react-native-wechat';
import Toast from '../../utils/Toast';

class GenerateShareImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      imageUri: ""
    };
  }
  showModal = (show) => {
    this.setState({
      visible: show
    });
  }
  onImageLoad = ()=>{
    captureRef(this._captureRef, {
      format: "jpg",
      quality: 0.5
    })
    .then(
      uri => {
        console.log("Image saved to", uri);
        this.setState({imageUri:uri});
      },
      error => {
        console.error("Oops, snapshot failed", error);
      }
    );
  }
  shareToWechat = (uri)=>{
    WeChat.isWXAppInstalled()
    .then((isInstalled) => {
        if (isInstalled) {
          console.log("begin to share to:"+uri);
            WeChat.shareToSession(
              {
                title: '分享商品图片',
                description: '商品图片分享描述',
                type: "imageUrl",
                imageUrl: uri,
                // filePath: uri,
                // fileExtension: "jpg"
              }
            ).then((response)=>{
              Toast.show("分享成功",Toast.SHORT);
            },(error)=>{
              Toast.show("分享失败"+error.message,Toast.LONG);
            }).catch((error) => {
                Toast.show("分享失败"+error.message,Toast.LONG);
            });
        } else {
            Toast.show('没有安装微信软件，请您安装微信之后再试', Toast.LONG);
        }
    }).catch(err => {
        Toast.show(err, Toast.LONG);
    });
  }
  render() {
    return (
      <Modal
        animationType="slide"
        transparent
        presentationStyle={'overFullScreen'}
        visible={this.state.visible}
        onRequestClose={() => {
          console.log("hide modal");
          this.showModal(false);
        }}>
        <View style={{width: ScreenWidth, height: ScreenWidth* 1233/750, justifyContent: "flex-end", backgroundColor: "white"}}
          ref={(ref)=>{this._captureRef=ref;}}>
          <Image style={{ width: ScreenWidth, height: ScreenWidth }} source={{
                  uri: "http://t08img.yangkeduo.com/images/2018-04-11/2714bfea98dd8da46b368d5fa585d868.jpeg",
                  // priority: FastImage.priority.normal
              }} />
          <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}> 
              <View>
                <Text>无印良品MUJI柔和</Text>
                <View></View>
                <Text>已拼111件</Text>
              </View>
              <TouchableHighlight onPress={()=>this.shareToWechat(this.state.imageUri)}>
                <ImageBackground source={require('../../img/QRbackground.png')}
                  style={{ width:140, height: 159, alignItems: 'center', justifyContent: 'center', paddingTop: 20, marginRight: 20,}}>
                    <QRCode value={"http://www.mochongsoft.com/testurl"} 
                        size={130} color='black' />
                </ImageBackground>
              </TouchableHighlight>
          </View>
          <Image source={require('../../img/bottom.png')} style={{marginBottom: 20}} onLoad={this.onImageLoad} />
        </View>
      </Modal>
    );
  }
}

export default GenerateShareImage;
