import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    Platform
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from './view/ScrollableTabBar';
import TitleBar from './view/TitleBar';
import OrderList from './view/OrderList';


export default class OrderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showList: false,
            text: ''
        };
    }
    static navigationOptions = () => {
    return {
      tabBarVisible: false,
      title: "我的订单",
    };
  }

    componentDidMount() {
        // this._navListener = this.props.navigation.addListener('didFocus', () => {
        //   StatusBar.setBarStyle('light-content');
        //   Platform.OS ==='android' && StatusBar.setBackgroundColor('#6a51ae');
        // });
        // this.getOrders();
    }

    componentWillUnmount() {
        console.log("OrderScreen will unmount");
    }

    _goBack = () => {

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/*<TitleBar func={this._goBack} title='我的订单' />*/}
                <ScrollableTabView
                    style={{ flex: 1, backgroundColor: '#FFFFFF' }}
                    renderTabBar=
                    {() => <ScrollableTabBar />}
                    ref={(tabView) => { this.tabView = tabView; }}>
                    <View tabLabel='全部' style={{ flex: 1 }}>
                        <OrderList orderType='0' ></OrderList>
                    </View>
                    <View tabLabel='已付款' style={{ flex: 1 }}><OrderList orderType='1'/></View>
                    <View tabLabel='已收货' style={{ flex: 1 }}><OrderList orderType='2'/></View>
                    <View tabLabel='已结算' style={{ flex: 1 }}><OrderList orderType='3'/></View>
                    <View tabLabel='已失效' style={{ flex: 1 }}><OrderList orderType='4'/></View>
                </ScrollableTabView>

            </View>
        );
    }
}