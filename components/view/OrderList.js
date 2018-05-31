import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    // ImageBackground,
    FlatList,
    // Animated,
    StyleSheet,
    ListView,
    TouchableOpacity
} from 'react-native';

// import FilView from './FilView';
import NoResultView from './NoResultView';
import Toast from '../../utils/Toast';
import Spinner from 'react-native-spinkit';
import ServiceVar from '../../network/ServiceVar';
import FastImage from 'react-native-fast-image';
import { getOrderList } from '../../network/Service';

// Spinner types:
// 'CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 
// 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress',
// 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class OrderList extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        this.list = [];
        this.state = {
            // dataSource: ds.cloneWithRows(this.list),
            data: this.list,
            refreshing: false,
            pageNum: 1,
            nomore: true,
            extensionType: 0,
        };
    }
    componentWillUnmount() {
        console.log("OrderList will unmount");
    }
    componentDidMount() {
        this._getOrderList();
    }

    getFormatTimeString = (time) => {
        const dateFormat = require('dateformat');
        return dateFormat(time, 'yyyy-mm-dd HH:MM:ss');
    }

    onEndReached = () => {
        if (this.state.nomore) {
            return;
        }
        this._onLoadMore();
    };

    _onLoadMore = () => {
        const pages = this.state.pageNum + 1;
        this.setState({ pageNum: pages }, () => { this._getOrderList(); });

        // this._getOrderList();
    }

    _getOrderList = (isChangeExtension = false) => {
        getOrderList(this.state.pageNum, 10, this.props.orderType, this.state.extensionType).then((result) => {
            console.log('_getOrderList:' + JSON.stringify(result));
            if (result.status && result.entry && result.entry.length) {
                if (this.state.pageNum == 1) {
                    this.list = [];
                }
                this.list = [...this.list, ...result.entry];
                this.setState({ data: this.list, nomore: !result.hasNext });
            } else {
                // console.log('this.state.list:' + JSON.stringify(this.state.data));
                if (isChangeExtension) {
                    this.list = [];
                    this.setState({
                        data: this.list,
                        nomore: true
                    });
                } else {
                    this.setState({
                        nomore: true
                    });
                }
                // Toast.show(result.message);
            }
        }).catch((error) => {
            Toast.show(error.message);
        });

    }

    onRefresh = () => {
        this.pageNum = 1;
        // this.setState({ refreshing: true });
        this._getOrderList();
    }

    _chooseExtensionType = (index) => {
        if (index === this.state.extensionType) {
            return;
        }
        console.log('extensionType:' + index);
        this.setState({ extensionType: index, pageNum: 1 }, () => { this._getOrderList(true); });
        // this._getOrderList();
    }

    renderItem = (item) => {
        let rowItem = item.item;
        let timestring = this.getFormatTimeString(rowItem.orderCreateTime);
        let img = null;

        if (rowItem.thumbnailUrl && rowItem.thumbnailUrl.length > 0) {
            img = <FastImage source={{
                uri: rowItem.thumbnailUrl,
                priority: FastImage.priority.normal
            }}
                style={{ width: 72, height: 72 }}
                resizeMode={FastImage.resizeMode.contain}
            />;
        } else {
            img = <Image style={styles.goodImg} source={require('../../img/tab_icon.png')} />;
        }
        let orderStatusStyle = styles.normalOrder;
         if (rowItem.orderStatus === 4) {
            orderStatusStyle = styles.disableOrder;
        }
        let orderStatusString = rowItem.orderStatusDesc;
        return (
            <View style={styles.rowContainer}>
                <View style={styles.top}>
                    <Text style={{ color: '#444444', fontSize: 13 }}>{rowItem.orderDec}</Text>
                    <Text style={{ color: '#999999', fontSize: 13 }}>{timestring} 下单</Text>
                </View>
                <View style={{ height: 1, backgroundColor: '#dddddd' }} />
                <View style={{ height: 106, flex: 1, flexDirection: 'row', paddingLeft: 15, paddingRight: 15, paddingTop: 15 }}>
                    {img}
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#444444', fontSize: 14, marginLeft: 13, }} numberOfLines={2}>{rowItem.goodsName}</Text>
                        <View style={orderStatusStyle}>
                            <Text style={{ color: '#ffffff', fontSize: 12 }}>{orderStatusString}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: 1, backgroundColor: '#dddddd' }} />
                <View style={{ height: 45, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginRight: 15 }}>
                    <Text style={{ color: '#444444', fontSize: 13 }}>实际付款：</Text>
                    <Text style={{ color: '#444444', fontSize: 13 }}>¥{(rowItem.orderAmount / 100).toFixed(2)}</Text>
                    <View style={{ width: 1, backgroundColor: '#eeeeee', height: 14, marginLeft: 5, marginRight: 5 }}></View>
                    <Text style={{ color: '#444444', fontSize: 13 }}>预计收益：</Text>
                    <Text style={{ color: '#d12129', fontSize: 17 }}>¥{(rowItem.promotionAmount / 100).toFixed(2)}</Text>

                </View>
            </View>
        );
    }

    render() {
        let typeTextStyle1, typeTextStyle2;
        if (this.state.extensionType == 0) {
            typeTextStyle1 = styles.selectItemColor;
            typeTextStyle2 = styles.unSelectItemColor;
        } else {
            typeTextStyle1 = styles.unSelectItemColor;
            typeTextStyle2 = styles.selectItemColor;
        }
        let footerView = null;
        if (this.state.data.length >= 0) {
            footerView = this.state.nomore ?
                (<Text style={styles.footerBg}>没有更多拉～</Text>)
                : (<Spinner style={{ position: 'absolute', top: 120 }} isVisible={this.state.loading} type='Bounce' size={50} color='#000000' />);
        } else {
            footerView = <View />;
        }
        return (
            <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', backgroundColor: '#eeeeee' }}>
                {/* <Spinner style={{position:'absolute', top: 120}} isVisible={this.state.loading} type='Bounce' size={50} color='#000000' /> */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 45 }}>
                    <TouchableOpacity
                        style={styles.itemBg}
                        onPress={() => this._chooseExtensionType(0)}>
                        <Text style={typeTextStyle1}>我的订单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.itemBg, { marginLeft: 20 }]}
                        onPress={() => this._chooseExtensionType(1)}>
                        <Text style={typeTextStyle2}>团队订单</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{ flex: 1, marginTop: 0, }}
                    ListHeaderComponent={() => <View />}
                    ListFooterComponent={footerView}
                    ListEmptyComponent={(<NoResultView func={() => { }} title='抱歉，还没有订单' />)}
                    data={this.state.data}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={this.renderItem}
                    refreshing={this.state.refreshing}
                    ref={(ref) => this._listRef = ref}
                    onEndReached={this.onEndReached}
                    onRefresh={this.onRefresh}
                    disableVirtualization={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flex: 1,
        marginTop: 10,
        height: 198,
        backgroundColor: '#ffffff',
    },
    top: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-between'
    },
    footerBg: {
        color: '#333',
        fontSize: 12,
        marginTop: 7,
        backgroundColor: '#f5f5f5',
        padding: 10,
        textAlign: 'center'
    },
    itemBg: {
        width: 90,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectItemColor: {
        fontSize: 14,
        color: '#B02933'
    },
    unSelectItemColor: {
        fontSize: 14,
        color: '#333333'
    },
    goodImg: {
        width: 72,
        height: 72
    },
    normalOrder: {
        backgroundColor: '#B09F7B',
        width: 45,
        height: 18,
        borderRadius: 2,
        marginLeft: 13,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    disableOrder: {
        backgroundColor: '#999999',
        width: 45,
        height: 18,
        borderRadius: 2,
        marginLeft: 13,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
