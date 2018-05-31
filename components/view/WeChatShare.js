import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Clipboard,
    Modal
} from 'react-native';
import * as WeChat from 'react-native-wechat';
import Toast from '../../utils/Toast';
import { ScreenWidth } from '../../Constants';


/**
 * 微信分享通用底部弹窗，this.props.needCopy为true时，显示复制文案按钮
 * this.props.copyTips需要复制的文案，可动态设置
 */
export default class WeChatShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            transparent: false,
            shareData:this.props.shareData,
            copyTips:this.props.copyTips
        };
    }
    componentWillUnmount() {
		console.log("WeChatShare will unmount");
	}
    /**
     * 设置分享内容
     */
    setShareData = (data) =>{
        this.setState({
            shareData:data
        });
    }

   /**
    * 分享给微信好友，使用shareData来填充
    */
    _shareToWeixin = () => {
        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    WeChat.shareToSession(
                        this.state.shareData
                    //     {
                    //     title: this.state.shareData.title,//'微信好友测试链接',
                    //     description: this.state.shareData.description,//'分享自:王磊的博客(vipstone.cnblogs.com)',
                    //     thumbImage: this.state.shareData.thumbImage,//'http://mat1.gtimg.com/fashion/images/index/2017/08/25/mrjx1.jpg',
                    //     type: this.state.shareData.type,//'news',
                    //     imageUrl:this.state.shareData.imageUrl,
                    //     webpageUrl: this.state.shareData.webpageUrl//'http://www.cnblogs.com/vipstone/p/7485081.html'
                    // }
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

    /**
    * 分享给微信朋友圈，使用shareData来填充
    */
    _shareToTimeLine = () => {
        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    WeChat.shareToTimeline(
                        this.state.shareData,
                        // {
                        //     title: '微信朋友圈测试链接',
                        //     description: '分享自:分享自:王磊的博客(vipstone.cnblogs.com)',
                        //     thumbImage: 'http://mat1.gtimg.com/fashion/images/index/2017/08/25/mrjx1.jpg',
                        //     type: 'imageUrl',
                        //     imageUrl:'http://mat1.gtimg.com/fashion/images/index/2017/08/25/mrjx1.jpg',
                        //     webpageUrl: 'http://www.cnblogs.com/vipstone/p/7485081.html'
                        // }
                    ).then((response)=>{
                        Toast.show("分享成功",Toast.SHORT);
                    }).catch((error) => {
                        Toast.show("分享失败"+error.message, Toast.LONG);
                    });
                } else {
                    Toast.show('没有安装微信软件，请您安装微信之后再试', Toast.LONG);
                }
            });
    }

    setCopyTips = (tips) =>{
        this.setState({
            copyTips:tips
        });
    }

    _copyTips = () => {
        Clipboard.setString(this.state.copyTips);
        Toast.show('已复制到剪贴板', Toast.LONG);
        this.props._setModalVisible(false);
    }

    _setModalVisible(visible) {
        console.log('显示share' + visible);
        this.setState({ modalVisible: visible });
    }

    render() {
        return (
            <Modal
                visible={this.state.modalVisible}
                animationType={'slide'}
                presentationStyle={'overFullScreen'}
                transparent
                // onShow={()=>{this.setState({transparent:true});}}
                onRequestClose={() => this._setModalVisible(false)}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => this._setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalBox, { position: 'absolute', bottom: 0 }]}>
                            <View style={styles.container}>
                                <View style={styles.top}>
                                    <TouchableOpacity style={{ alignItems: 'center', flex: 1 }} onPress={() => this._shareToWeixin()}>
                                        <Image source={require('../../img/wechat_friend.png')} />
                                        <Text style={styles.text}>微信好友</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ alignItems: 'center', flex: 1, marginLeft: 50 }} onPress={() => this._shareToTimeLine()}>
                                        <Image source={require('../../img/wechat_circle.png')} ></Image>
                                        <Text style={styles.text}>朋友圈</Text>
                                    </TouchableOpacity>
                                    {this.props.needCopy && <TouchableOpacity style={{ alignItems: 'center', flex: 1, marginLeft: 50 }} onPress={() => this._shareToTimeLine()}>
                                        <Image source={require('../../img/copy_tips.png')} ></Image>
                                        <Text style={styles.text}>复制文案</Text>
                                    </TouchableOpacity>}
                                </View>
                                <View style={{ backgroundColor: '#999999', height: 6 }}></View>
                                <TouchableOpacity style={styles.cancel} onPress={() => this._setModalVisible(false)}>
                                    <Text style={{ color: '#444444', fontSize: 17 }}>取消</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 215,
        backgroundColor: '#FFFFFF',
    },
    top: {
        height: 150,
        flexDirection: 'row',
        paddingLeft: 90,
        paddingRight: 90,
        alignItems: 'center',
    },
    text: {
        marginTop: 5,
        color: '#999999',
        fontSize: 13
    },
    cancel: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    modalBox: {
        width: ScreenWidth,
        height: 215
    },
});