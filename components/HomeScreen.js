import React, { Component } from 'react';
import {
  View, 
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableHighlight,
  Animated,
  Linking
} from 'react-native';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import ScrollableTabBar  from './view/ScrollableTabBar';
import TitleBar from './view/searchTitleBar';
import ProductList from './view/ProductList';
import { ScreenWidth } from '../Constants';
import Toast from '../utils/Toast';
import GenerateShareImage from './view/GenerateShareImage';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: "首页",
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      showList: false,
      text: '',
      headerHeight: ScreenWidth*28/75,
      currentHeight: new Animated.Value(ScreenWidth*28/75),
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
      Platform.OS ==='android' && StatusBar.setBackgroundColor('#6a51ae');
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
    console.log("HomeScreen component will unmount");
  }
  
  searchData = (text) => {
    if (text && text.length > 0) {
        if (this.state.showList && this.listview) {
            this.setState({showList: true, text: text},this
                .listview
                .searchData(text));
        } else {
            this.setState({showList: true, text: text});
        }
    } else {
        this.setState({showList: false, text: ''});
    }
  }

  navigateToMainLogin = ()=>{
    // let url ="pinduoduo://com.xunmeng.pinduoduo/duo_coupon_landing.html?goods_id=5695868&pid=1001297_11170011"; 
    // Linking.canOpenURL(url).then( supported => {
    //   if (!supported) {
    //     Toast.show("拼多多未安装");
    //   } else {
    //     return Linking.openURL(url);
    //   }
    // }).catch(err => console.error('An error occurred', err));
  }

  _onScroll = (event)=>{
      let newH = event.nativeEvent.contentOffset.y;
      let headerHeight = this.state.headerHeight;
      if(newH <=0){
        newH = 0;
      }
      if(newH >= headerHeight){
        newH = headerHeight;
      }
      this.setState({currentHeight:headerHeight-newH});
  }

  render() {
    let typeTitle=[{key:"全部", value:0}, {key:"美食",value:1}, {key:"母婴",value:4}, {key:"水果",value:13}, 
                    {key:"服饰",value: 14}, {key:"百货", value:15}, {key:"美妆", value:16}, {key:"电器", value:18}, 
                    {key:"男装", value:743}, {key:"家纺", value:818}, {key:"鞋包", value:1281}, {key:"运动", value:1451}, 
                    {key:"手机", value:1543}];
    let outView=typeTitle.map((item)=>{
      return (<View tabLabel={item.key} style={{flex: 1}}  key={item.key}>
      <ProductList onScroll={this._onScroll} navigate={this.props.navigation.navigate} category={item.value} filterEnable/>
    </View>);
    });
    return (
      <View style={{flex:1}}>
        <TitleBar func={this.searchData} searchDispose={()=>{
            this.props.navigation.navigate("Search");
          }}/>
        <Animated.View style={{justifyContent:'center', alignItems:'center', width: ScreenWidth, height: this.state.currentHeight, zIndex:-1}}>
          <TouchableHighlight onPress={()=>{this.navigateToMainLogin();}}>
            <Image source={require('../img/header.png')} resizeMode='cover' style={{width: ScreenWidth, height: this.state.headerHeight}}/>
          </TouchableHighlight>
        </Animated.View>
        <ScrollableTabView
            style={{flex: 1, backgroundColor:'#FFFFFF'}}
            renderTabBar=
              {() => <ScrollableTabBar />}
              ref={(tabView) => { this.tabView = tabView; }}>
              {outView}
        </ScrollableTabView>
        {/* <GenerateShareImage ref={(ref)=>this.ShareRef=ref} visible={false}/> */}
      </View>
    );
  }
}
