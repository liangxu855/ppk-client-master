import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Linking
} from 'react-native';
import ViewShot from "react-native-view-shot";
import FastImage from 'react-native-fast-image';
import { ScreenWidth } from '../Constants';
// import Request from '../network/Request';
// import ServiceVar from '../network/ServiceVar';
import Toast from '../utils/Toast';
import { goodDetail, getGoodShareLink } from '../network/Service';
import WeChatShare from './view/WeChatShare';



export default class GoodsDetailScreen extends Component {
    static navigationOptions = () => {
        return {
            tabBarVisible: false,
            title: "商品详情",
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            good: {}
        };
    }
    componentWillUnmount() {
        console.log("GoodsDetailScreen will unmount");
    }
    componentDidMount() {
        this._getGoodsDetail();
    }

    _getGoodsDetail = () => {
        // let request = new Request();
        // request.setUrl(ServiceVar.goods_getDetail);
        // request.setGet();
        // request.addParam('userId', '10012');
        // request.addParam('goodId', this.props.navigation.state.params.goodId);
        // request.start((result) => {
        //     if (result.status) {
        //         this.setState({
        //             good: result.entry
        //         });
        //     } else {
        //         Toast.show(result.message, Toast.LONG);
        //     }
        // }, (error) => {
        //     Toast.show(error.message, Toast.LONG);
        // });

        goodDetail(this.props.navigation.state.params.goodId).then((result) => {
            this.setState({
                good: result.entry
            });
        }).catch((error) => {
            Toast.show(error.message, Toast.LONG);
        });
    }

    _zigouZhuan = (pid, goodId) => {
        let url = "pinduoduo://com.xunmeng.pinduoduo/duo_coupon_landing.html?goods_id=" + goodId + "&pid=" + pid;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                Toast.show("拼多多未安装");
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    _shareZhuan = (goodId) => {
        getGoodShareLink(goodId).then((result) => {
            if (result.status) {
                let data = {};
                data.type = 'imageUrl';
                data.imageUrl = result.entry.shareImageUrl;
                this.WeChatShareScreen.setShareData(data);
                this.WeChatShareScreen._setModalVisible(true);
            }
        }).catch((error) => {
            Toast.show(error.message, Toast.LONG);
        });
    }

    _isOwnEmpty = (obj) => {
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                return false;
            }
        }
        return true;
    }

    render() {
        if (this._isOwnEmpty(this.state.good)) {
            return (<View />);
        }
        let detailList = this.state.good.goodsGalleryUrls;
        let goodsPicList = [];
        detailList.forEach(function (element) {
            goodsPicList.push(<FastImage style={{ width: ScreenWidth, height: ScreenWidth }} key={element} source={{
                uri: element,
                priority: FastImage.priority.normal
            }} />);
        }, this);
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <FastImage source={{
                        uri: this.state.good.imageUrl,
                        priority: FastImage.priority.normal
                    }}
                        style={{ width: ScreenWidth, height: ScreenWidth / 2 }}
                        resizeMode={FastImage.resizeMode.cover} />
                    <View style={{ flex: 1, backgroundColor: '#ffffff', paddingTop: 10 }}>
                        <Text style={{ color: '#333333', fontSize: 18, marginLeft: 10, marginRight: 10 }}>{this.state.good.goodName}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#B02933', fontSize: 12 }}>券后价</Text>
                                <Text style={{ color: '#B02933', fontSize: 16 }}>¥{(this.state.good.quanPrice / 100).toFixed(2)}</Text>
                                <Text style={{ color: '#999999', fontSize: 12, marginLeft: 4, textDecorationLine: 'line-through' }}>¥{(this.state.good.nowPrice / 100).toFixed(2)}</Text>
                            </View>
                            <Text style={{ color: '#999999', fontSize: 12 }}>已拼{this.state.good.soldQuantity}件</Text>
                        </View>
                        <View style={{ height: 1, flex: 1, backgroundColor: '#F6F6F6', marginTop: 10 }} />
                        <View style={{ marginTop: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginRight: 10 }}>
                            <ImageBackground source={require('../img/coupon.png')}
                                style={{ width: 60, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 11 }}>券 ￥{(this.state.good.couponDiscount / 100).toFixed(2)}</Text>
                            </ImageBackground>
                            <Text style={{ color: '#666666', fontSize: 11, marginLeft: 4 }}>优惠券剩余{this.state.good.couponRemainQuantity}张</Text>
                        </View>
                        <View style={{ height: 10, width: ScreenWidth, backgroundColor: '#F6F6F6' }}></View>
                        <Text style={{ marginTop: 10, marginBottom: 10, fontSize: 14, color: '#666666', marginLeft: 10, marginRight: 10 }}>{this.state.good.goodDesc}</Text>
                        <View style={{ height: 10, width: ScreenWidth, backgroundColor: '#F6F6F6' }}></View>
                    </View>
                    {goodsPicList}
                </ScrollView>
                <View style={{
                    position: 'absolute', width: ScreenWidth, backgroundColor: '#ffffff', bottom: 0, flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center', height: 60, paddingLeft: 15, paddingRight: 15
                }}>
                    <TouchableOpacity
                        style={[styles.bottom_item, { backgroundColor: '#CDA967' }]}
                        onPress={() => this._zigouZhuan(this.state.good.pid, this.state.good.goodId)}>
                        <Text style={{ color: '#ffffff' }}>自购赚¥{(this.state.good.ziGouProfit / 100).toFixed(2)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.bottom_item, { marginLeft: 15, backgroundColor: '#E45D33' }]}
                        onPress={() => this._shareZhuan(this.state.good.goodId)}>
                        <Text style={{ color: '#ffffff' }}>分享赚¥{(this.state.good.shareProfit / 100).toFixed(2)}</Text>
                    </TouchableOpacity>
                </View>
                <WeChatShare
                    shareData={this.state.shareData}
                    ref={(ref) => {
                        this.WeChatShareScreen = ref;
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottom_item: {
        flex: 1,
        borderRadius: 4,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },

});